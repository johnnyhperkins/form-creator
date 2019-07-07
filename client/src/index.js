import React, { useContext, useReducer } from 'react'
import ReactDOM from 'react-dom'

import Context from './context'
import reducer from './reducer'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'

import AppRouter from './AppRouter'

export const BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://border-box.herokuapp.com/graphql'
		: 'http://localhost:4000/graphql'

const httpLink = createHttpLink({
	uri: BASE_URL,
	credentials:
		process.env.NODE_ENV === 'production' ? 'include' : 'same-origin',
})

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	// need to figure out if theres a method on the google user object that lets me know if the token is expired

	let token
	let usertype
	if (localStorage.getItem('bbToken')) {
		token = localStorage.getItem('bbToken')
		usertype = 'email'
	} else if (window.gapi) {
		token = window.gapi.auth2
			.getAuthInstance()
			.currentUser.get()
			.getAuthResponse().id_token
		usertype = 'google'
	}

	return {
		headers: {
			...headers,
			authorization: token ? `${token}` : '',
			usertype,
		},
	}
})

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
	defaultOptions: {
		query: {
			fetchPolicy: 'network-only',
			errorPolicy: 'none',
		},
		mutate: {
			errorPolicy: 'none',
		},
	},
	onError: ({ networkError, graphQLErrors }) => {
		console.log('graphQLErrors (consoled from index)', graphQLErrors)
		console.log('networkError (consoled from index)', networkError)
	},
})

const Root = () => {
	const initialState = useContext(Context)
	const [ state, dispatch ] = useReducer(reducer, initialState)
	return (
		<ApolloProvider client={client}>
			<Context.Provider value={{ state, dispatch }}>
				<AppRouter />
			</Context.Provider>
		</ApolloProvider>
	)
}

ReactDOM.render(<Root />, document.getElementById('root'))
