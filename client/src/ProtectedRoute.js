import React, { useContext } from 'react'
import Context from './context'
import { Route, Redirect } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

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
						<Footer />
					</div>
				)}
			{...rest}
		/>
	)
}

export default ProtectedRoute
