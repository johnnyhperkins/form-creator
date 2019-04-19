import React, { useContext, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Context from './context'
import reducer from './reducer'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import Header from './components/Header'
import EditForm from './pages/EditForm'

import App from './pages/App'

import Splash from './pages/Splash'
import ProtectedRoute from './ProtectedRoute'

import * as serviceWorker from './serviceWorker'

// in order to store the user information we'll have to set up local state and context (context is react's built in store)

 const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql'
  })


const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
})

const Root = () => {
	const initialState = useContext(Context)
	const [ state, dispatch ] = useReducer(reducer, initialState)
	// in order to make changes to the context we need to use a reducer
	return (
		<Router>
			<ApolloProvider client={client}>
				<Context.Provider value={{ state, dispatch }}>
					<ProtectedRoute path="/" component={Header} />
					<Switch>
						<ProtectedRoute exact path="/form/:id" component={EditForm} />
						<ProtectedRoute exact path="/" component={App} />
						<Route path="/login" component={Splash} />
					</Switch>
				</Context.Provider>
			</ApolloProvider>
		</Router>
	)
}

ReactDOM.render(<Root />, document.getElementById('root'))

serviceWorker.unregister()
