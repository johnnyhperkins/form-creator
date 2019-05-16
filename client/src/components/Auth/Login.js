import React, { useContext } from 'react'
import { GraphQLClient } from 'graphql-request'
import { GoogleLogin } from 'react-google-login'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { ME_QUERY } from '../../graphql/queries'
import { BASE_URL } from '../../client'

import Context from '../../context'

const Login = ({ classes }) => {
	const { dispatch } = useContext(Context)
	const onSuccess = async googleUser => {
		try {
			const idToken = googleUser.getAuthResponse().id_token
			const client = new GraphQLClient(BASE_URL, {
				headers: {
					authorization: idToken,
				},
			})

			const { me } = await client.request(ME_QUERY, { idToken })

			dispatch({
				type: 'LOGIN_USER',
				payload: me,
			})
			dispatch({
				type: 'IS_LOGGED_IN',
				payload: googleUser.isSignedIn(),
			})
		} catch (error) {
			dispatch({
				type: 'IS_LOGGED_IN',
				payload: false,
			})
			onFailure(error)
		}
	}

	const onFailure = err => {
		console.error('Error logging in ', err)
	}
	return (
		<div className={classes.root}>
			<Typography
				component="h1"
				variant="h3"
				gutterBottom
				noWrap
				style={{ color: 'rgb(66,133, 244' }}>
				Welcome
			</Typography>
			<GoogleLogin
				onSuccess={onSuccess}
				isSignedIn={true}
				onFailure={onFailure}
				buttonText="Login with Google"
				theme="dark"
				clientId="26591134947-f8m3eed1ihedd8m4mhq5ro57vbdf9ri6.apps.googleusercontent.com"
			/>
		</div>
	)
}

const styles = {
	root: {
		height: 'calc(100vh - 64px)',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		alignItems: 'center',
	},
}

export default withStyles(styles)(Login)
