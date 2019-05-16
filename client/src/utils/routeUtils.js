import React, { useContext } from 'react'
import Context from '../context'
import { Route, Redirect, withRouter } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Protected = ({ component: Component, ...rest }) => {
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

const Public = ({ component: Component, ...rest }) => {
	return (
		<Route
			render={props => (
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

export const ProtectedRoute = withRouter(Protected)
export const PublicRoute = withRouter(Public)
