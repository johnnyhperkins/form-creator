import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

import { GET_FORM_QUERY } from '../graphql/queries'

import { useClient } from '../client'

const DisplayForm = ({ classes, match }) => {
	const [ title, setTitle ] = useState('')
	const [ formFields, setFormFields ] = useState(null)
	const [ fieldState, setFieldState ] = useState({})

	const { form_id: formId } = match.params

	const client = useClient()

	useEffect(() => {
		getForm()
	}, [])

	const getForm = async () => {
		const {
			getForm: { title, formFields },
		} = await client.request(GET_FORM_QUERY, {
			_id: formId,
		})
		const createFieldState = {}

		formFields.forEach(field => {
			createFieldState[field.label] = ''
		})
		setFieldState(createFieldState)
		setFormFields(formFields)
		setTitle(title)
	}

	const renderField = field => {
		const { type, label } = field
		switch (type) {
			case 'Text':
				return (
					<TextField
						className={classes.textField}
						variant="outlined"
						label={label}
						onChange={e =>
							setFieldState({ ...fieldState, [label]: e.target.value })}
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
							setFieldState({ ...fieldState, [label]: e.target.value })}
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
						<Typography variant="h4">{title}</Typography>
						<Divider className={classes.divider} />
						{formFields.map((field, key) => {
							return (
								<div key={key} className={classes.formItem}>
									{renderField(field)}
								</div>
							)
						})}
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
	divider: {
		margin: '15px 0',
	},
}

export default withRouter(withStyles(styles)(DisplayForm))
