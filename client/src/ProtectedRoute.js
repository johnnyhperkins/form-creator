import React, { useContext } from 'react'
import Context from './context'
import { Route, Redirect } from 'react-router-dom'

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const { state } = useContext(Context)
	return (
		<Route
			render={props =>
				!state.isAuth ? <Redirect to="/login" /> : <Component {...props} />}
			{...rest}
		/>
	)
}

export default ProtectedRoute
