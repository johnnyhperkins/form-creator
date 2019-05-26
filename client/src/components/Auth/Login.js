import React, { useContext } from 'react'
import { GraphQLClient } from 'graphql-request'
import { GoogleLogin } from 'react-google-login'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import { ME_QUERY } from '../../graphql/queries'
import { BASE_URL } from '../../client'
import EmailLogin from './EmailLogin'
import processSignIn from '../../utils/processSignIn'
import handleError from '../../utils/handleError'
import Typography from '@material-ui/core/Typography'

import Context from '../../context'

const Login = ({ classes }) => {
	const { dispatch } = useContext(Context)

	const onSuccess = async googleUser => {
		try {
			const idToken = googleUser.getAuthResponse().id_token
			const client = new GraphQLClient(BASE_URL, {
				headers: {
					authorization: idToken,
					usertype: 'google',
				},
			})

			const { me } = await client.request(ME_QUERY)
			const isLoggedIn = googleUser.isSignedIn()

			processSignIn({ isLoggedIn, me, isGoogle: true }, dispatch)
		} catch (error) {
			dispatch({
				type: 'IS_LOGGED_IN',
				payload: false,
			})
			handleError(error, dispatch)
		}
	}

	const onFailure = err => {
		console.error('Error logging in ', err)
	}
	return (
		<div className={classes.root}>
			<Grid container justify="center" align="center">
				<Grid item xs={12} sm={6}>
					<EmailLogin dispatch={dispatch} />
					<Divider className={classes.divider} />
					<Typography className={classes.marginBottom} variant="body1">
						Or
					</Typography>
					<GoogleLogin
						onSuccess={onSuccess}
						isSignedIn={true}
						onFailure={onFailure}
						buttonText="Login with Google"
						theme="dark"
						clientId="26591134947-f8m3eed1ihedd8m4mhq5ro57vbdf9ri6.apps.googleusercontent.com"
					/>
				</Grid>
			</Grid>
		</div>
	)
}

const styles = {
	root: {
		padding: '50px 0 0 0',
	},
	marginBottom: {
		marginBottom: 15,
	},
	divider: {
		margin: '15px 0',
	},
}

export default withStyles(styles)(Login)
