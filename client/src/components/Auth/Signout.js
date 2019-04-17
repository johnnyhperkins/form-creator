import React, { useContext } from 'react'
import Context from '../../context'
import { GoogleLogout } from 'react-google-login'
import { withStyles } from '@material-ui/core/styles'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Typography from '@material-ui/core/Typography'

const Signout = ({ classes }) => {
	const { dispatch } = useContext(Context)
	const onSignout = () => {
		dispatch({ type: 'SIGNOUT_USER' })
	}
	return (
		<GoogleLogout
			onLogoutSuccess={onSignout}
			render={({ onClick }) => (
				<span className={classes.root} onClick={onClick}>
					<Typography variant="body1" className={classes.buttonText}>
						Signout
					</Typography>
					<ExitToApp className={classes.buttonIcon} />
				</span>
			)}
		/>
	)
}

const styles = {
	root: {
		cursor: 'pointer',
		display: 'flex',
	},
	buttonText: {
		color: 'orange',
	},
	buttonIcon: {
		marginLeft: '5px',
		color: 'orange',
	},
}

export default withStyles(styles)(Signout)
