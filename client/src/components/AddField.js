import React, { useState, useContext } from 'react'
import { Mutation } from 'react-apollo'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import AddIcon from '@material-ui/icons/Add'
import { ListItemIcon } from '@material-ui/core'

import { CREATE_FIELD_MUTATION } from '../graphql/mutations'
import { FIELD_TYPES } from '../constants'
import { snackbarMessage } from '../utils/snackbarMessage'
import handleError from '../utils/handleError'
import Context from '../context'

const AddField = ({
	classes,
	formFields,
	formId,
	addField,
	setAddField,
	setFormFields,
}) => {
	const { dispatch } = useContext(Context)
	const [ newFieldLabel, setNewFieldLabel ] = useState('')
	const [ newFieldType, setNewFieldType ] = useState('')

	const handleCreateFormField = createFormField => {
		return async () => {
			const {
				data: { createFormField: formField },
				errors,
			} = await createFormField({
				variables: {
					formId,
					type: newFieldType,
					label: newFieldLabel,
				},
			})

			if (errors) return handleError(errors, dispatch)

			setFormFields([ ...formFields, formField ])
			setNewFieldLabel('')
			setNewFieldType('')
			snackbarMessage('Field added', dispatch)
		}
	}
	return (
		<List>
			{!formFields.length && (
				<ListItem>
					<ListItemText primary="Click the plus button to create a field." />
				</ListItem>
			)}
			<ListItem className={classes.addFormItem}>
				<div className={classes.centerVertical}>
					<ListItemIcon
						className={classes.pointer}
						onClick={() => setAddField(!addField)}>
						<AddIcon />
					</ListItemIcon>
					{addField && (
						<div>
							<TextField
								placeholder="Label"
								label="Label"
								className={`${classes.textField} ${classes.addField}`}
								margin="none"
								value={newFieldLabel}
								onChange={e => setNewFieldLabel(e.target.value)}
							/>
							<FormControl
								className={`${classes.formControl} ${classes.addField}`}>
								<InputLabel htmlFor="field-type">Select Type</InputLabel>
								<Select
									value={newFieldType}
									label="Type"
									variant="outlined"
									onChange={e => setNewFieldType(e.target.value)}
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
						</div>
					)}
				</div>
				{addField && (
					<Mutation mutation={CREATE_FIELD_MUTATION}>
						{createFormField => (
							<Button onClick={handleCreateFormField(createFormField)}>
								Add Field
							</Button>
						)}
					</Mutation>
				)}
			</ListItem>
		</List>
	)
}

const styles = {
	textField: {
		margin: '0 15px 0 0',
	},
	formControl: {
		width: '100%',
		marginTop: 15,
	},
	addField: {
		width: 200,
		marginTop: 0,
	},
	addFormItem: {
		minHeight: 78,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	centerVertical: {
		display: 'flex',
		alignItems: 'center',
	},
	formItem: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
}

export default withStyles(styles)(AddField)
