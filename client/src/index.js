import React, { useContext, useReducer } from 'react'
import ReactDOM from 'react-dom'

import Context from './context'
import reducer from './reducer'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import AppRouter from './AppRouter'

import * as serviceWorker from './serviceWorker'

const httpLink = new HttpLink({
	uri: 'https://border-box.herokuapp.com/graphql',
})

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
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

serviceWorker.unregister()
