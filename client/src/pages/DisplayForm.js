import React, { useState, useEffect, useContext } from 'react'
import { withRouter, Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

import { SUBMIT_FORM_MUTATION } from '../graphql/mutations'
import { GET_FORM_QUERY, GET_RESPONSES_QUERY } from '../graphql/queries'
import Context from '../context'
import { useClient } from '../client'
import FieldResponse from '../components/FieldResponse'
import UIAlerts from '../components/UIAlerts'

const DisplayForm = ({ classes, match, history }) => {
	const { state: { currentUser } } = useContext(Context)
	const [ staticState, setStaticState ] = useState({
		title: '',
		ownerId: '',
	})
	const [ snackBar, setSnackBar ] = useState({ open: false, message: null })
	const [ formFields, setFormFields ] = useState(null)
	const [ fieldState, setFieldState ] = useState({})
	const [ responsesOpen, setResponsesOpen ] = useState(false)
	const [ formResponses, setFormResponses ] = useState([])

	const { form_id: formId } = match.params

	const client = useClient()

	useEffect(() => {
		getForm()
	}, [])

	const setFormState = formFields => {
		const createFieldState = {}

		formFields.forEach(field => {
			createFieldState[field._id] = ''
		})

		setFieldState(createFieldState)
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}

		setSnackBar({ ...snackBar, open: false })
	}

	const getForm = async () => {
		const {
			getForm: { title, formFields, createdBy: { _id } },
		} = await client.request(GET_FORM_QUERY, {
			_id: formId,
		})
		setStaticState({
			title,
			ownerId: _id,
		})

		setFormFields(formFields)
		setFormState(formFields)

		if (_id === currentUser._id) {
			const { getResponses } = await client.request(GET_RESPONSES_QUERY, {
				formId,
			})

			if (getResponses.length) {
				setFormResponses(getResponses)
			}
		}
	}

	const handleSubmit = async () => {
		const fieldStateArray = Object.keys(fieldState).map(key => ({
			form: formId,
			formField: key,
			value: fieldState[key],
		}))

		const variables = {
			formId,
			input: fieldStateArray,
		}

		setSnackBar({
			open: true,
			message: 'Form Submitted',
		})

		const { submitForm } = await client.request(SUBMIT_FORM_MUTATION, variables)

		history.push('/')

		// setFormState(formFields)
	}

	const renderField = field => {
		const { type, label, _id } = field
		switch (type) {
			case 'Text':
				return (
					<TextField
						className={classes.textField}
						variant="outlined"
						label={label}
						onChange={e =>
							setFieldState({ ...fieldState, [_id]: e.target.value })}
						value={fieldState[label]}
					/>
				)
			case 'Text Area':
				return (
					<TextField
						multiline={true}
						className={classes.textField}
						label={label}
						variant="outlined"
						onChange={e =>
							setFieldState({ ...fieldState, [_id]: e.target.value })}
						rows={2}
						value={fieldState[label]}
					/>
				)
			case 'Button':
				return (
					<Button variant="outlined" className={classes.submitButton}>
						{field.label}
					</Button>
				)
			default:
				return
		}
	}

	return (
		formFields && (
			<div className={classes.root}>
				<Grid container justify="center">
					<Grid item sm={6} className={classes.flexColumn}>
						<Typography variant="h4">
							{responsesOpen ? 'Responses' : staticState.title}
						</Typography>
						{currentUser._id === staticState.ownerId && (
							<div>
								<Link to={`/form/${formId}`} className={classes.smallLink}>
									Edit Form
								</Link>
								<span
									onClick={() => setResponsesOpen(!responsesOpen)}
									className={classes.smallLink}>
									{responsesOpen ? 'View Form' : 'View Responses'}
								</span>
							</div>
						)}
						<Divider className={classes.divider} />

						{responsesOpen ? (
							<div>
								{formResponses && (
									<div>
										{formResponses.map((field, idx) => (
											<FieldResponse
												classes={classes}
												field={field}
												key={idx}
											/>
										))}
									</div>
								)}
							</div>
						) : (
							<div>
								{formFields.map((field, key) => {
									return (
										<div key={key} className={classes.formItem}>
											{renderField(field)}
										</div>
									)
								})}
								<Button variant="outlined" onClick={handleSubmit}>
									Submit
								</Button>
							</div>
						)}
					</Grid>
					<UIAlerts snackBar={snackBar} handleClose={handleClose} />
				</Grid>
			</div>
		)
	)
}

const styles = {
	root: {
		padding: '50px 0 0 0',
	},
	flexColumn: {
		display: 'flex',
		flexDirection: 'column',
	},
	snackbarMessage: {
		textTransform: 'uppercase',
		fontWeight: 'bold',
	},
	textField: {
		margin: '0 15px 0 0',
	},
	formItem: {
		marginBottom: 15,
	},
	submitButton: {
		marginTop: 15,
	},
	divider: {
		margin: '15px 0',
	},
	smallLink: {
		color: '#777',
		display: 'inline-block',
		marginRight: 10,
		textDecoration: 'underline',
		marginTop: 10,
		fontSize: 14,
		cursor: 'pointer',
		fontFamily: 'Roboto',
	},
}

export default withRouter(withStyles(styles)(DisplayForm))
