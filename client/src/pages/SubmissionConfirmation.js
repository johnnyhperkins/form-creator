import React, { useContext } from 'react'

import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

import Link from '../components/misc/Link'
import Context from '../context'

const SubmissionConfirmation = ({ classes }) => {
	const { state: { currentUser } } = useContext(Context)
	return (
		<Grid
			container
			justify="center"
			alignContent="center"
			className={classes.root}>
			<Grid item md={6}>
				<Typography variant="h3">Thank you!</Typography>
				<Typography variant="body1">
					Your responses were successfully recorded.
				</Typography>
				<Divider className={classes.divider} />
				{currentUser ? (
					<Link variant="body1" to="/">
						Back to form list
					</Link>
				) : (
					<Link variant="body1" to="/login">
						Create an account
					</Link>
				)}
			</Grid>
		</Grid>
	)
}

const styles = {
	root: {
		padding: '50px 0 0 0',
	},
	divider: {
		margin: '15px 0',
	},
}

export default withStyles(styles)(SubmissionConfirmation)
