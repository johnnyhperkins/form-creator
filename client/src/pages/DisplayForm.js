import React, { useState, useEffect, useContext } from 'react'

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
import handleError from '../utils/handleError'
import Link from '../components/misc/Link'

const DisplayForm = ({ classes, match, history }) => {
	const { state: { currentUser }, dispatch } = useContext(Context)
	const [ staticState, setStaticState ] = useState({
		title: '',
		ownerId: '',
	})
	const [ formFields, setFormFields ] = useState(null)
	const [ fieldState, setFieldState ] = useState({})
	const [ responsesOpen, setResponsesOpen ] = useState(false)
	const [ formResponses, setFormResponses ] = useState([])

	const { form_id: formId } = match.params

	// need to change this to use a public client for just displaying the form!!
	const client = useClient()

	useEffect(() => {
		try {
			getForm()
		} catch (err) {
			handleError(err, dispatch)
			history.push('/')
		}
	}, [])

	const setFormState = formFields => {
		const createFieldState = {}

		formFields.forEach(field => {
			createFieldState[field._id] = ''
		})

		setFieldState(createFieldState)
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

		if (currentUser && _id === currentUser._id) {
			try {
				const { getResponses } = await client.request(GET_RESPONSES_QUERY, {
					formId,
				})

				if (getResponses.length) {
					setFormResponses(getResponses)
				}
			} catch (err) {
				handleError(err, dispatch)
			}
		}
	}

	const handleSubmit = async () => {
		try {
			const user = currentUser ? currentUser.name : 'Anonymous'
			const input = Object.keys(fieldState).map(key => ({
				form: formId,
				formField: key,
				user,
				value: fieldState[key],
			}))

			await client.request(SUBMIT_FORM_MUTATION, { input })

			dispatch({
				type: 'SNACKBAR',
				payload: { snackBarOpen: true, message: 'Form Submitted' },
			})

			history.push('/submission-successful')
		} catch (err) {
			handleError(err, dispatch)
		}
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
						{currentUser &&
						currentUser._id === staticState.ownerId && (
							<div>
								<Link to={`/form/${formId}`} small="true">
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
	divider: {
		margin: '15px 0',
	},
}

export default withStyles(styles)(DisplayForm)
