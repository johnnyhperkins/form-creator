import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
// import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import EditIcon from '@material-ui/icons/Edit'
import DehazeIcon from '@material-ui/icons/Dehaze'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import styled from 'styled-components'

import { FIELD_TYPES } from '../constants'

const Field = styled.div``

const FormField = ({ classes, field, provided, deleteField, updateField }) => {
	const [ label, setLabel ] = useState('')
	const [ type, setType ] = useState('')
	const [ editField, setEditField ] = useState(false)

	const renderField = field => {
		switch (field.type) {
			case 'Text':
				return (
					<TextField disabled={true} variant="outlined" label={field.label} />
				)
			case 'Text Area':
				return (
					<TextField
						disabled={true}
						multiline={true}
						variant="outlined"
						label={field.label}
					/>
				)
			case 'Button':
				return (
					<Button disabled variant="outlined">
						{field.label}
					</Button>
				)
			default:
				return null
		}
	}

	const handleUpdateField = () => {
		setEditField(false)

		const newType = type === '' ? field.type : type
		updateField({ _id: field._id, type: newType, label })
	}

	return (
		<Field
			className={classes.formFieldContainer}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			ref={provided.innerRef}>
			<div className={classes.formFieldWrapper}>
				<div className={classes.centerFlex}>
					<DehazeIcon className={classes.editIcon} /> {renderField(field)}
				</div>
				<div>
					<EditIcon
						onClick={() => setEditField(!editField)}
						className={classes.editIcon}
					/>{' '}
					<DeleteIcon
						onClick={() => deleteField(field._id)}
						className={classes.deleteIcon}
					/>
				</div>
			</div>

			{editField && (
				<div>
					{/* LABEL */}
					<TextField
						placeholder="Label"
						className={classes.textField}
						margin="normal"
						value={label}
						onChange={e => setLabel(e.target.value)}
					/>

					{/* TYPE */}

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

					<Button variant="outlined" onClick={handleUpdateField}>
						Update
					</Button>
				</div>
			)}
			{/* Close Edit Field */}
		</Field>
	)
}

const styles = {
	root: {
		padding: '0 50px',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		boxSizing: 'border-box',
	},
	centerFlex: {
		display: 'flex',
		alignItems: 'center',
	},
	formFieldWrapper: {
		width: '100%',
		margin: '15px 0',
		display: 'flex',
		justifyContent: 'space-between',
	},
	inline: {
		display: 'inline',
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
	editIcon: {
		color: '#ccc',
		cursor: 'pointer',
		marginRight: 15,
	},
	deleteIcon: {
		color: 'red',
		cursor: 'pointer',
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

export default withRouter(withStyles(styles)(FormField))
