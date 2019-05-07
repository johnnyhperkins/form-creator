import React, { useState, useEffect, useContext } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Drawer from '@material-ui/core/Drawer'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import handleError from '../utils/handleError'

import Divider from '@material-ui/core/Divider'

import Context from '../context'
import AddField from '../components/AddField'

import { FIELD_TYPES } from '../constants'
import FormField from '../components/FormField'
import { GET_FORM_QUERY } from '../graphql/queries'
import {
	UPDATE_FORM_MUTATION,
	CREATE_FIELD_MUTATION,
	UPDATE_FIELD_MUTATION,
	DELETE_FIELD_MUTATION,
} from '../graphql/mutations'

import { useClient } from '../client'

const FieldContainer = styled.div`
	padding: 10px;
	margin-bottom: 10px;
`

const EditForm = ({ classes, match, history }) => {
	const { dispatch } = useContext(Context)
	const [ title, setTitle ] = useState('')
	const [ url, setUrl ] = useState('')
	const [ formFields, setFormFields ] = useState(null)
	const [ label, setLabel ] = useState('')
	const [ type, setType ] = useState('')
	const [ fieldId, setFieldId ] = useState('')
	const [ addField, setAddField ] = useState(false)
	const [ editTitle, setEditTitle ] = useState(false)
	const [ newFieldLabel, setNewFieldLabel ] = useState('')
	const [ newFieldType, setNewFieldType ] = useState('')

	const [ drawerOpen, setDrawerOpen ] = useState(false)

	const { id: formId } = match.params

	const client = useClient()

	useEffect(() => {
		try {
			getForm()
		} catch (err) {
			handleError(err, dispatch)
		}
	}, [])

	const getForm = async () => {
		const {
			getForm: { title, url, formFields },
		} = await client.request(GET_FORM_QUERY, {
			_id: formId,
		})

		setUrl(url)
		setTitle(title)
		setFormFields(formFields)
	}

	const handleUpdateForm = async () => {
		try {
			await client.request(UPDATE_FORM_MUTATION, {
				_id: formId,
				title,
			})
			setEditTitle(false)

			dispatch({
				type: 'SNACKBAR',
				payload: { snackBarOpen: true, message: 'Saved' },
			})
		} catch (err) {
			handleError(err, dispatch)
			history.push('/')
		}
	}

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list)
		const [ removed ] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)

		return result
	}

	const startUpdateField = field => {
		setDrawerOpen(!drawerOpen)
		setType(field.type)
		setLabel(field.label)
		setFieldId(field._id)
	}

	const handleUpdateField = async () => {
		try {
			await client.request(UPDATE_FIELD_MUTATION, {
				_id: fieldId,
				type,
				label,
			})

			const updatedFormFields = formFields.map(field => {
				if (field._id === fieldId) {
					return {
						...field,
						type,
						label,
					}
				}

				return field
			})

			setFormFields(updatedFormFields)
			setDrawerOpen(!drawerOpen)
			setLabel('')
			setType('')
			setFieldId('')

			dispatch({
				type: 'SNACKBAR',
				payload: { snackBarOpen: true, message: 'Field updated' },
			})
		} catch (err) {
			handleError(err, dispatch)
		}
	}

	const handleAddFormField = async () => {
		try {
			const { addFormField } = await client.request(CREATE_FIELD_MUTATION, {
				formId,
				type: newFieldType,
				label: newFieldLabel,
			})

			setFormFields([ ...formFields, addFormField ])
			setNewFieldLabel('')
			setNewFieldType('')

			dispatch({
				type: 'SNACKBAR',
				payload: { snackBarOpen: true, message: 'Field added' },
			})
		} catch (err) {
			handleError(err, dispatch)
		}
	}

	const deleteField = async _id => {
		try {
			await client.request(DELETE_FIELD_MUTATION, {
				_id,
				formId,
			})

			setFormFields(formFields.filter(field => field._id !== _id))
			dispatch({
				type: 'SNACKBAR',
				payload: { snackBarOpen: true, message: 'Field deleted' },
			})
		} catch (err) {
			handleError(err, dispatch)
		}
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
			formFields,
			result.source.index,
			result.destination.index,
		)

		const fieldIds = newFields.map(field => field._id)

		try {
			await client.request(UPDATE_FORM_MUTATION, {
				_id: formId,
				formFields: fieldIds,
			})

			setFormFields(newFields)
			dispatch({
				type: 'SNACKBAR',
				payload: { snackBarOpen: true, message: 'Updated' },
			})
		} catch (err) {
			handleError(err, dispatch)
		}
	}

	const renderTitle = bool => {
		if (bool) {
			return (
				<div className={classes.editTitle}>
					<TextField
						placeholder="Title"
						label="Title"
						className={classes.editTitleField}
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<Button onClick={() => handleUpdateForm()}>Save</Button>
				</div>
			)
		}
		return (
			<Typography variant="h4">
				{title}
				<EditIcon
					onClick={() => {
						setEditTitle(!editTitle)
					}}
				/>
			</Typography>
		)
	}

	return (
		formFields && (
			<div className={classes.root}>
				<Grid container justify="center">
					<Grid item sm={6}>
						{renderTitle(editTitle)}
						<Link to={url} className={classes.smallLink}>
							View Form
						</Link>
						<Divider className={classes.divider} />
						<div>
							<DragDropContext onDragEnd={onDragEnd}>
								<Droppable droppableId={title}>
									{provided => (
										<FieldContainer
											ref={provided.innerRef}
											{...provided.droppableProps}>
											{formFields.map((field, idx) => {
												return (
													<Draggable
														draggableId={field._id}
														key={field._id}
														index={idx}>
														{provided => (
															<FormField
																deleteField={deleteField}
																startUpdateField={startUpdateField}
																field={field}
																formId={formId}
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
							<Divider className={classes.divider} />
							<AddField
								formFields={formFields}
								addField={addField}
								setAddField={setAddField}
								setNewFieldLabel={setNewFieldLabel}
								newFieldLabel={newFieldLabel}
								setNewFieldType={setNewFieldType}
								newFieldType={newFieldType}
								handleAddFormField={handleAddFormField}
							/>
						</div>
					</Grid>
					<Drawer
						open={drawerOpen}
						anchor="right"
						onClose={() => setDrawerOpen(!drawerOpen)}>
						<div className={classes.drawer}>
							<Typography component="h2" variant="h5">
								Edit Field
							</Typography>

							<TextField
								placeholder="Label"
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
										<em>Select</em>
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
								onClick={() => handleUpdateField(fieldId)}>
								Update
							</Button>
						</div>
					</Drawer>
				</Grid>
			</div>
		)
	)
}

const styles = {
	root: {
		padding: '50px 0 0 0',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'flex-start',
		boxSizing: 'border-box',
	},
	snackbarMessage: {
		textTransform: 'uppercase',
		fontWeight: 'bold',
	},
	smallLink: {
		color: '#777',
		display: 'block',
		marginTop: 10,
		fontSize: 14,
		fontFamily: 'Roboto',
	},
	drawer: {
		width: '350px',
		padding: '35px',
		display: 'flex',
		flexDirection: 'column',
	},
	editTitleField: {
		fontSize: '24px',
	},
	textField: {
		margin: '0 15px 0 0',
	},
	deleteIcon: {
		color: 'red',
	},
	formControl: {
		width: '100%',
		marginTop: 15,
	},
	formItem: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	submitButton: {
		marginTop: 15,
	},
	divider: {
		margin: '15px 0',
	},
}

export default withRouter(withStyles(styles)(EditForm))
