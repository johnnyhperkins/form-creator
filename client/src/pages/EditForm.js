import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

import { FIELD_TYPES } from '../constants'
import FormField from '../components/FormField'
import { GET_FORM_QUERY } from '../graphql/queries'
import {
	UPDATE_FORM_MUTATION,
	ADD_FIELD_MUTATION,
	EDIT_FIELD_MUTATION,
	UPDATE_FORMFIELD_ORDER,
	DELETE_FIELD_MUTATION,
} from '../graphql/mutations'

import { useClient } from '../client'

const FieldContainer = styled.div`
	padding: 10px;
	margin-bottom: 10px;
`

const EditForm = ({ classes, match }) => {
	const [ title, setTitle ] = useState('')
	const [ currentForm, setCurrentForm ] = useState(null)
	const [ label, setLabel ] = useState('')
	const [ type, setType ] = useState('')
	const [ snackBar, setSnackBar ] = useState({ open: false, message: null })

	const { id: formId } = match.params

	const client = useClient()

	useEffect(() => {
		getForm()
	}, [])

	const getForm = async () => {
		const { getForm } = await client.request(GET_FORM_QUERY, {
			_id: formId,
		})
		setTitle(getForm.title)
		setCurrentForm(getForm)
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}

		setSnackBar({ ...snackBar, open: false })
	}

	const handleUpdateForm = async () => {
		await client.request(UPDATE_FORM_MUTATION, {
			_id: formId,
			title,
		})
		setSnackBar({ open: true, message: 'Saved' })
	}

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list)
		const [ removed ] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)

		return result
	}

	const handleAddFormField = async () => {
		const { addFormField } = await client.request(ADD_FIELD_MUTATION, {
			formId,
			type,
			label,
		})

		setSnackBar({ open: true, message: 'Field added' })
		setCurrentForm({
			...currentForm,
			formFields: [ ...currentForm.formFields, addFormField ],
		})
		setLabel('')
		setType('')
	}

	const deleteField = async _id => {
		await client.request(DELETE_FIELD_MUTATION, {
			_id,
			formId,
		})
		setSnackBar({
			open: true,
			message: 'Field Deleted',
		})
		setCurrentForm({
			...currentForm,
			formFields: currentForm.formFields.filter(field => field._id !== _id),
		})
	}

	const onDragEnd = async result => {
		const { destination, source } = result

		if (
			!destination ||
			(destination.droppableId === source.droppableId &&
				destination.index === source.index)
		)
			return

		const newFields = reorder(
			currentForm.formFields,
			result.source.index,
			result.destination.index,
		)
		setSnackBar({ open: true, message: 'Updated' })
		setCurrentForm({
			...currentForm,
			formFields: newFields,
		})

		const fieldIds = newFields.map(field => field._id)
		await client.request(UPDATE_FORMFIELD_ORDER, {
			_id: formId,
			formFields: fieldIds,
		})
	}

	return (
		currentForm && (
			<div className={classes.root}>
				<div className={classes.formArea}>
					<Typography variant="h4">{title}</Typography>
					{currentForm.formFields.length ? (
						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable droppableId={currentForm._id}>
								{provided => (
									<FieldContainer
										ref={provided.innerRef}
										{...provided.droppableProps}>
										{currentForm.formFields.map((field, idx) => {
											return (
												<Draggable
													draggableId={field._id}
													key={field._id}
													index={idx}>
													{provided => (
														<FormField
															deleteField={deleteField}
															field={field}
															provided={provided}
														/>
													)}
												</Draggable>
											)
										})}
										{provided.placeholder}
									</FieldContainer>
								)}
							</Droppable>
						</DragDropContext>
					) : (
						<div className={classes.emptyFieldsWrapper}>
							<Typography variant="h5" className={classes.emptyFieldsText}>
								Add fields in the sidebar
							</Typography>
						</div>
					)}
				</div>

				<div className={classes.sidebar}>
					<Typography variant="h4">Edit</Typography>
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
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					className={classes.success}
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
			</div>
		)
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
	emptyFieldsText: {
		fontSize: '24px',
		color: '#ddd',
	},
	emptyFieldsWrapper: {
		height: '100vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	snackbarMessage: {
		textTransform: 'uppercase',
		fontWeight: 'bold',
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
