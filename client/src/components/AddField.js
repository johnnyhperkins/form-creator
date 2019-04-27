import React from 'react'
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

import { FIELD_TYPES } from '../constants'

const AddField = ({
	classes,
	formFields,
	addField,
	setAddField,
	setNewFieldLabel,
	newFieldLabel,
	setNewFieldType,
	newFieldType,
	handleAddFormField,
}) => {
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
								// variant="outlined"
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
					<Button onClick={() => handleAddFormField()}>Add Field</Button>
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
