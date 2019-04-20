import React, { useState, useContext, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

// import OutlinedInput from '@material-ui/core/OutlinedInput'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
// import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import {
	FORM_ELEMENTS,
	INPUT_TYPES,
	LABEL_POSITIONS,
	FIELD_TYPES,
} from '../constants'
import Select from '@material-ui/core/Select'

import { GET_FORM_QUERY } from '../graphql/queries'
import { EDIT_FIELD_MUTATION } from '../graphql/mutations'
import Context from '../context'
import { useClient } from '../client'

const FormField = ({ classes, field, match, idx }) => {
	const { state, dispatch } = useContext(Context)
	// const [ type, setType ] = useState(field.type || '')
	const { id: formId } = match.params
	const [ labelPosition, setLabelPosition ] = useState(
		field.labelPosition || '',
	)
	const [ formElement, setFormElement ] = useState(field.formElement || '')
	const [ label, setLabel ] = useState('')
	const [ editField, setEditField ] = useState(false)

	const [ inputType, setInputType ] = useState(field.inputType || '')

	const client = useClient()

	const handleUpdateFormField = async () => {
		const { editFormField } = await client.request(EDIT_FIELD_MUTATION, {
			formId,
			idx,
			type: field.type,
			label,
			labelPosition,
			formElement,
			inputType,
		})
		dispatch({ type: 'UPDATE_FORM_FIELD', payload: editFormField })
	}

	return (
		<div>
			<div className={classes.formField}>
				{field.label || `New ${field.type} Field`}{' '}
				<span onClick={() => setEditField(!editField)}>edit</span>
			</div>

			{editField && (
				<div>
					<TextField
						placeholder="Label"
						className={classes.textField}
						margin="normal"
						value={label}
						onChange={e => setLabel(e.target.value)}
					/>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="form-element">Select form element</InputLabel>
						<Select
							value={formElement}
							onChange={e => setFormElement(e.target.value)}
							inputProps={{
								name: 'formElement',
								id: 'form-element',
							}}>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							{Object.values(FORM_ELEMENTS).map((input, idx) => {
								return (
									<MenuItem key={idx} value={input}>
										{input}
									</MenuItem>
								)
							})}
						</Select>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="input-field">Select input type</InputLabel>
						<Select
							value={inputType}
							onChange={e => setInputType(e.target.value)}
							inputProps={{
								name: 'inputType',
								id: 'input-field',
							}}>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							{Object.values(INPUT_TYPES).map((input, idx) => {
								return (
									<MenuItem key={idx} value={input}>
										{input}
									</MenuItem>
								)
							})}
						</Select>
					</FormControl>

					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="label-position">
							Select label position
						</InputLabel>
						<Select
							value={labelPosition}
							onChange={e => setLabelPosition(e.target.value)}
							inputProps={{
								name: 'labelPosition',
								id: 'label-position',
							}}>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							{Object.values(LABEL_POSITIONS).map((input, idx) => {
								return (
									<MenuItem key={idx} value={input}>
										{input}
									</MenuItem>
								)
							})}
						</Select>
					</FormControl>
				</div>
			)}
		</div>
	)
}

const styles = {
	formField: {
		width: 100,
	},
	root: {
		padding: '0 50px',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
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
