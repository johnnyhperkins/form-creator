import React, { useState, useContext, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

// import OutlinedInput from '@material-ui/core/OutlinedInput'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'

import FormControl from '@material-ui/core/FormControl'
import { FIELD_TYPES } from '../constants'
import Select from '@material-ui/core/Select'

import FormField from '../components/FormField'
import { GET_FORM_QUERY } from '../graphql/queries'
import { UPDATE_FORM_MUTATION, ADD_FIELD_MUTATION } from '../graphql/mutations'
import Context from '../context'
import { useClient } from '../client'

const EditForm = ({ classes, match }) => {
	const { state, dispatch } = useContext(Context)
	const { currentForm, currentUser } = state

	const [ title, setTitle ] = useState('')

	const [ label, setLabel ] = useState('')
	const [ type, setType ] = useState('')

	const { id: formId } = match.params

	const client = useClient()

	useEffect(() => {
		getForm().then(form => {
			setTitle(form.title)
		})
	}, [])

	const getForm = async () => {
		const { getForm } = await client.request(GET_FORM_QUERY, {
			_id: formId,
		})

		dispatch({ type: 'GET_FORM', payload: getForm })
		return getForm
	}

	const handleUpdateForm = async () => {
		const { updateForm } = await client.request(UPDATE_FORM_MUTATION, {
			_id: formId,
			title,
		})
		dispatch({ type: 'UPDATE_FORM', payload: updateForm })
	}

	const handleAddFormField = async () => {
		const { addFormField } = await client.request(ADD_FIELD_MUTATION, {
			formId,
			type,
			label,
		})

		dispatch({ type: 'ADD_FORM_FIELD', payload: addFormField })
		setLabel('')
		setType('')
	}

	return (
		<div className={classes.root}>
			<div className={classes.formArea}>
				<Typography variant="h4">{currentForm && currentForm.title}</Typography>
				{currentForm &&
					currentForm.formFields.map((field, idx) => {
						return <FormField key={idx} field={field} />
					})}
			</div>

			{currentForm && (
				<div className={classes.sidebar}>
					<Typography variant="h4">Edit </Typography>
					<TextField
						placeholder="Title"
						label="Title"
						variant="outlined"
						className={classes.textField}
						margin="normal"
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>

					<Button variant="outlined" onClick={() => handleUpdateForm()}>
						Update Form
					</Button>

					<hr />

					{/* INPUTS */}
					<Typography variant="h4">Add An Input</Typography>
					<TextField
						placeholder="Label"
						label="Label"
						variant="outlined"
						className={classes.textField}
						margin="normal"
						value={label}
						onChange={e => setLabel(e.target.value)}
					/>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="field-type">Select Type</InputLabel>
						<Select
							value={type}
							label="Type"
							variant="outlined"
							onChange={e => setType(e.target.value)}
							inputProps={{
								name: 'type',
								id: 'field-type',
							}}>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							{Object.values(FIELD_TYPES).map((input, idx) => {
								return (
									<MenuItem key={idx} value={input}>
										{input}
									</MenuItem>
								)
							})}
						</Select>
					</FormControl>
					<Button
						variant="outlined"
						className={classes.submitButton}
						onClick={() => handleAddFormField()}>
						Add Field
					</Button>
				</div>
			)}
		</div>
	)
}

const styles = {
	root: {
		padding: '0 50px',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'flex-start',
		boxSizing: 'border-box',
	},
	sidebar: {
		width: '30%',
		borderLeft: '1px solid black',
		padding: '25px',
		display: 'flex',
		flexDirection: 'column',
	},
	formArea: {
		width: '60%',
		padding: '25px',
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
	formControl: {
		width: 220,
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
	submitButton: {
		marginTop: 15,
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
