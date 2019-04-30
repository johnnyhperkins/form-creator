import React from 'react'
import withRoot from './withRoot'
import Home from './pages/Home'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Splash from './pages/Splash'
import ProtectedRoute from './ProtectedRoute'
import DisplayForm from './pages/DisplayForm'

import EditForm from './pages/EditForm'

const AppRouter = () => {
	return (
		<Router>
			<Switch>
				<ProtectedRoute exact path="/form/:id" component={EditForm} />
				<ProtectedRoute
					exact
					path="/:username/:form_id"
					component={DisplayForm}
				/>
				<ProtectedRoute exact path="/" component={Home} />
				<Route path="/login" component={Splash} />
			</Switch>
		</Router>
	)
}

export default withRoot(AppRouter)
