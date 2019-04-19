import React, { useContext } from 'react'
import Context from './context'
import { Route, Redirect } from 'react-router-dom'
import Header from './components/Header'

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const { state } = useContext(Context)
	return (
		<Route
			render={props =>
				!state.isAuth ? (
					<Redirect to="/login" />
				) : (
					<div>
						<Header />
						<Component {...props} />
					</div>
				)}
			{...rest}
		/>
	)
}

export default ProtectedRoute
