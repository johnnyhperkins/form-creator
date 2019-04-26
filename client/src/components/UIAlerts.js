import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { withStyles } from '@material-ui/core/styles'

const UIAlerts = ({ classes, snackBar, handleClose }) => {
	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			open={snackBar.open}
			autoHideDuration={2000}
			onClose={handleClose}
			ContentProps={{
				'aria-describedby': 'message-id',
			}}
			message={
				<span id="message-id" className={classes.snackbarMessage}>
					{snackBar.message}
				</span>
			}
			action={[
				<IconButton
					key="close"
					aria-label="Close"
					color="inherit"
					className={classes.close}
					onClick={handleClose}>
					<CheckCircleIcon />
				</IconButton>,
			]}
		/>
	)
}
const styles = {
	snackbarMessage: {
		textTransform: 'uppercase',
		fontWeight: 'bold',
	},
}

export default withStyles(styles)(UIAlerts)
