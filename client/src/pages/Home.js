import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import { withStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import { ListItemIcon } from '@material-ui/core'

import handleError from '../utils/handleError'
import Context from '../context'
import {
	CREATE_FORM_MUTATION,
	DELETE_FORM_MUTATION,
} from '../graphql/mutations'
import { GET_FORMS_QUERY } from '../graphql/queries'
import { useClient } from '../client'

const Home = ({ classes, history }) => {
	const { dispatch } = useContext(Context)
	const [ addForm, setAddForm ] = useState(false)
	const [ title, setTitle ] = useState('')
	const [ forms, setForms ] = useState(null)
	const [ idToDelete, setIdToDelete ] = useState(null)

	const client = useClient()

	useEffect(() => {
		try {
			getForms()
		} catch (err) {
			handleError(err, dispatch)
		}
	}, [])

	useEffect(
		() => {
			if (idToDelete) {
				confirmDelete()
			}
		},
		[ idToDelete ],
	)

	const handleSubmit = async () => {
		try {
			const { createForm } = await client.request(CREATE_FORM_MUTATION, {
				title,
			})

			setForms([ ...forms, createForm ])
			setAddForm(false)
			setTitle('')

			dispatch({
				type: 'SNACKBAR',
				payload: { snackBarOpen: true, message: 'Form Added' },
			})
		} catch (err) {
			handleError(err, dispatch)
		}
	}

	const handleClick = id => {
		history.push(`/form/${id}`)
	}

	const confirmDelete = () => {
		dispatch({
			type: 'TOGGLE_WARNING_MODAL',
			payload: {
				modalOpen: true,
				title: 'Are you sure you want to delete this form?',
				message: 'All fields and responses will be permanently deleted.',
				action: handleDeleteForm,
			},
		})
	}

	const handleDeleteForm = async () => {
		try {
			await client.request(DELETE_FORM_MUTATION, { formId: idToDelete })
			setForms(forms.filter(form => form._id !== idToDelete))

			dispatch({
				type: 'SNACKBAR',
				payload: { snackBarOpen: true, message: 'Form Deleted' },
			})

			setIdToDelete(null)
		} catch (err) {
			handleError(err, dispatch)
		}
	}

	const getForms = async () => {
		const { getForms } = await client.request(GET_FORMS_QUERY)

		setForms(getForms)
	}

	return (
		<div className={classes.root}>
			<Grid container justify="center">
				{forms && (
					<Grid item sm={6}>
						<Typography variant="h5">My Forms</Typography>
						<Divider className={classes.divider} />
						<List>
							{forms.length ? (
								forms.map(form => {
									return (
										<ListItem className={classes.formItem} key={form._id}>
											<ListItemIcon
												className={classes.pointer}
												onClick={() => handleClick(form._id)}>
												<EditIcon />
											</ListItemIcon>
											<ListItemText primary={form.title} />
											<Button onClick={() => setIdToDelete(form._id)}>
												<DeleteIcon className={classes.deleteIcon} />
											</Button>
										</ListItem>
									)
								})
							) : (
								<ListItem>
									<ListItemText primary="Click the plus button to create a form." />
								</ListItem>
							)}
							<Divider className={classes.divider} />
							<ListItem className={classes.addFormItem}>
								<div className={classes.centerVertical}>
									<ListItemIcon
										className={classes.pointer}
										onClick={() => setAddForm(!addForm)}>
										<AddIcon />
									</ListItemIcon>
									{addForm && (
										<TextField
											label="Title"
											variant="outlined"
											className={classes.textField}
											margin="none"
											value={title}
											onChange={e => setTitle(e.target.value)}
										/>
									)}
								</div>
								{addForm && <Button onClick={handleSubmit}>Create Form</Button>}
							</ListItem>
						</List>
					</Grid>
				)}
			</Grid>
		</div>
	)
}

const styles = {
	root: {
		padding: '50px 0 0 0',
	},
	textField: {
		margin: '0 15px',
		width: '90%',
		background: '#fff',
		flexGrow: 2,
	},
	deleteIcon: {
		color: 'red',
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
	divider: {
		margin: '15px 0',
	},
	pointer: {
		cursor: 'pointer',
	},
}

export default withRouter(withStyles(styles)(Home))
