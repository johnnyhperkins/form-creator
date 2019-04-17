import React, { useContext, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Context from './context'
import reducer from './reducer'

import App from './pages/App'

import Splash from './pages/Splash'
import ProtectedRoute from './ProtectedRoute'

import * as serviceWorker from './serviceWorker'

// in order to store the user information we'll have to set up local state and context (context is react's built in store)

const Root = () => {
	const initialState = useContext(Context)
	const [ state, dispatch ] = useReducer(reducer, initialState)
	// in order to make changes to the context we need to use a reducer
	return (
		<Router>
			<Context.Provider value={{ state, dispatch }}>
				<Switch>
					<ProtectedRoute exact path="/" component={App} />
					<Route path="/login" component={Splash} />
				</Switch>
			</Context.Provider>
		</Router>
	)
}

ReactDOM.render(<Root />, document.getElementById('root'))

serviceWorker.unregister()
