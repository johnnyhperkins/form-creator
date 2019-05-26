import React, { useContext } from 'react'
import Context from '../../context'
import { withApollo } from 'react-apollo'
import { GoogleLogout } from 'react-google-login'
import { withStyles } from '@material-ui/core/styles'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Typography from '@material-ui/core/Typography'

const Signout = ({ classes, currentUser, isGoogle, client }) => {
	const { dispatch } = useContext(Context)
	const onSignout = () => {
		client.cache.reset()
		localStorage.removeItem('bbToken')
		dispatch({ type: 'SIGNOUT_USER' })
	}

	return isGoogle ? (
		<GoogleLogout
			onLogoutSuccess={onSignout}
			render={({ onClick }) => (
				<div className={classes.root}>
					{currentUser.picture && (
						<img
							src={currentUser.picture}
							className={classes.picture}
							alt={currentUser.name}
						/>
					)}
					<span className={classes.signout} onClick={onClick}>
						<Typography variant="body1" className={classes.white}>
							Signout
						</Typography>
						<ExitToApp className={classes.buttonIcon} />
					</span>
				</div>
			)}
		/>
	) : (
		<div className={classes.root}>
			<span className={classes.signout} onClick={onSignout}>
				<Typography variant="body1" className={classes.white}>
					Signout
				</Typography>
				<ExitToApp className={classes.buttonIcon} />
			</span>
		</div>
	)
}

const styles = theme => ({
	root: {
		display: 'flex',
		alignContent: 'flex-end',
		alignItems: 'center',
	},
	signout: {
		cursor: 'pointer',
		display: 'flex',
	},
	buttonIcon: {
		marginLeft: '5px',
	},
	white: {
		color: 'white',
	},
	picture: {
		height: '40px',
		borderRadius: '90%',
		marginRight: theme.spacing.unit * 2,
	},
})

export default withApollo(withStyles(styles)(Signout))
