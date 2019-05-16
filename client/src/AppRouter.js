import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import Splash from './pages/Splash'
import DisplayForm from './pages/DisplayForm'
import EditForm from './pages/EditForm'
import SubmissionConfirmation from './pages/SubmissionConfirmation'
import withRoot from './withRoot'
import Home from './pages/Home'

import { ProtectedRoute, PublicRoute } from './utils/routeUtils'

const AppRouter = () => {
	return (
		<Router>
			<Switch>
				<ProtectedRoute exact path="/form/:id" component={EditForm} />
				<PublicRoute exact path="/:username/:form_id" component={DisplayForm} />
				<PublicRoute
					exact
					path="/submission-successful"
					component={SubmissionConfirmation}
				/>
				<ProtectedRoute exact path="/" component={Home} />
				<PublicRoute path="/login" component={Splash} />
			</Switch>
		</Router>
	)
}

export default withRoot(AppRouter)
