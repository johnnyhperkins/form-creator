import React, { useState, useContext, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { GET_FORM_QUERY } from '../graphql/queries'
import Context from '../context'

import Typography from '@material-ui/core/Typography'

import { useClient } from '../client'

// first want to check if user has forms,
// if so list them otherwise only display the create new forms button
const EditForm = ({ classes, match }) => {
	const { state, dispatch } = useContext(Context)
	const { currentForm, currentUser } = state

	const client = useClient()

	useEffect(() => {
		const { id } = match.params
		getForm(id)
	}, [])

	const getForm = async formId => {
		const { getForm } = await client.request(GET_FORM_QUERY, {
			formId,
			createdBy: currentUser._id,
		})
		// debugger
		dispatch({ type: 'GET_FORM', payload: getForm })
	}

	return (
		<div className={classes.root}>
			<form className={classes.form}>
				<Typography variant="h2">Edit Form</Typography>
				{currentForm && (
					<div>
						<p>{currentForm.title}</p>
					</div>
				)}
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

export default withRouter(withStyles(styles)(EditForm))
