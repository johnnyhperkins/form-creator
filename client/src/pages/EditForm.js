import React, { useState, useContext} from 'react'
import withRoot from '../withRoot'
import { withStyles } from '@material-ui/core/styles'
import Context from '../context'

import Typography from '@material-ui/core/Typography'

import { useClient } from '../client'


// first want to check if user has forms,
// if so list them otherwise only display the create new forms button
const EditForm = ({ classes }) => {
	const { state, dispatch } = useContext(Context)
	const [ title, setTitle ] = useState('')
	const client = useClient()

	return (
		<div className={classes.root}>
			<form className={classes.form}>
				<Typography variant="h2">Edit Form</Typography>
			</form>
		</div>
	)
}

const styles = {
	root: {
		height: '100vh',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		alignItems: 'center',
	},
	textField: {
		width: 200,
	},
	deleteIcon: {
		color: 'red',
	},
	form: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		alignItems: 'center',
	},
	formItem: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	rootMobile: {
		display: 'flex',
		flexDirection: 'column-reverse',
	},
	navigationControl: {
		position: 'absolute',
		top: 0,
		left: 0,
		margin: '1em',
	},
	popupImage: {
		padding: '0.4em',
		height: 200,
		width: 200,
		objectFit: 'cover',
	},

	popupTab: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
	},
}

export default withRoot(withStyles(styles)(EditForm))
