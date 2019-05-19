import React, { useContext, useReducer } from 'react'
import ReactDOM from 'react-dom'

import Context from './context'
import reducer from './reducer'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'

import AppRouter from './AppRouter'

export const BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://border-box.herokuapp.com/graphql'
		: 'http://localhost:4000/graphql'

const httpLink = createHttpLink({
	uri: BASE_URL,
})

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	// need to figure out if theres a method on the google user object that lets me know if the token is expired

	// const token = localStorage.getItem('token')
	// !Boolean(token) &&
	let token
	if (window.gapi) {
		token = window.gapi.auth2
			.getAuthInstance()
			.currentUser.get()
			.getAuthResponse().id_token
		// localStorage.setItem('token', token)
	}

	// console.log(localStorage.getItem('token'))

	return {
		headers: {
			...headers,
			authorization: token ? `${token}` : '',
		},
	}
})

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
	defaultOptions: {
		query: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		},
		mutate: {
			errorPolicy: 'all',
		},
	},
	// onError: ({ networkError, graphQLErrors }) => {
	// 	console.log('graphQLErrors', graphQLErrors)
	// 	console.log('networkError', networkError)
	// },
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
