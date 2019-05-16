import React, { useContext } from 'react'
import Link from './misc/Link'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Logo from './Icons/Logo'

import Context from '../context'
import SignOut from './Auth/Signout'

const Header = ({ classes }) => {
	const { state } = useContext(Context)
	const { currentUser } = state
	return (
		<AppBar position="static">
			<Toolbar className={classes.navBar}>
				<Link to="/">
					<Logo />
				</Link>
				{currentUser ? (
					<SignOut currentUser={currentUser} />
				) : (
					<Link to="/login" color="white">
						Log In
					</Link>
				)}
			</Toolbar>
		</AppBar>
	)
}

const styles = {
	navBar: {
		justifyContent: 'space-between',
		display: 'flex',
		alignItems: 'center',
	},
}

export default withStyles(styles)(Header)
