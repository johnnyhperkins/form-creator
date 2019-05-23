import React, { useContext, useState, useEffect } from 'react'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import handleError from '../utils/handleError'
import { snackbarMessage } from '../utils/snackbarMessage'
import Context from '../context'
import { useClient } from '../client'
import { UPDATE_FIELD_MUTATION } from '../graphql/mutations'
import { FIELD_TYPES } from '../constants'

const EditDrawerContent = ({ classes, formFields, setFormFields, onClose }) => {
	const client = useClient()
	const { dispatch, state: { ui: { drawer } } } = useContext(Context)

	const [ label, setLabel ] = useState('')
	const [ type, setType ] = useState('')

	useEffect(() => {
		setLabel(drawer.label)
		setType(drawer.type)
	}, [])

	const handleUpdateField = async () => {
		try {
			await client.request(UPDATE_FIELD_MUTATION, {
				_id: drawer._id,
				type,
				label,
			})

			const updatedFormFields = formFields.map(field => {
				if (field._id === drawer._id) {
					return {
						...field,
						type,
						label,
					}
				}

				return field
			})

			setFormFields(updatedFormFields)
			setLabel('')
			setType('')
			onClose()
			snackbarMessage('Field Updated', dispatch)
		} catch (err) {
			handleError(err, dispatch)
		}
	}

	return (
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
				onClick={() => handleUpdateField()}>
				Update
			</Button>
		</div>
	)
}

export default EditDrawerContent
