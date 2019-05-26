import React, { useState, useContext } from 'react'
import { Query, Mutation } from 'react-apollo'

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

import ReactLoading from 'react-loading'

import handleError from '../utils/handleError'
import { snackbarMessage } from '../utils/snackbarMessage'
import Context from '../context'
import {
	CREATE_FORM_MUTATION,
	DELETE_FORM_MUTATION,
} from '../graphql/mutations'
import { GET_FORMS_QUERY } from '../graphql/queries'

const Home = ({ classes, history, client }) => {
	const { dispatch } = useContext(Context)
	const [ addForm, setAddForm ] = useState(false)
	const [ title, setTitle ] = useState('')

	const startDeleteForm = (formId, deleteForm) => {
		const action = async () => {
			const res = await deleteForm({ variables: { formId } })
			if (Boolean(res)) {
				snackbarMessage('Form Deleted', dispatch)
			}
		}

		dispatch({
			type: 'TOGGLE_WARNING_MODAL',
			payload: {
				modalOpen: true,
				title: 'Are you sure you want to delete this form?',
				message: 'All fields and responses will be permanently deleted.',
				action,
			},
		})
	}

	const handleClick = id => {
		history.push(`/form/${id}`)
	}

	const handleCreateForm = createForm => {
		return async () => {
			const { errors } = await createForm({
				variables: { title },
			})
			if (errors) return handleError(errors, dispatch)
			setAddForm(false)
			setTitle('')
			snackbarMessage('Form added', dispatch)
		}
	}

	const renderFormItems = forms => {
		return forms.map(form => {
			return (
				<ListItem key={form._id}>
					<ListItemIcon
						className={classes.pointer}
						onClick={() => handleClick(form._id)}>
						<EditIcon />
					</ListItemIcon>
					<ListItemText primary={form.title} />
					<Mutation
						mutation={DELETE_FORM_MUTATION}
						onError={err => handleError(err, dispatch)}
						update={(cache, { data: { deleteForm: { _id } } }) => {
							const { getForms } = cache.readQuery({
								query: GET_FORMS_QUERY,
							})

							cache.writeQuery({
								query: GET_FORMS_QUERY,
								data: {
									getForms: getForms.filter(form => form._id !== _id),
								},
							})
						}}>
						{deleteForm => (
							<Button onClick={() => startDeleteForm(form._id, deleteForm)}>
								<DeleteIcon className={classes.deleteIcon} />
							</Button>
						)}
					</Mutation>
				</ListItem>
			)
		})
	}

	return (
		<div className={classes.root}>
			<Grid container justify="center">
				<Grid item sm={6}>
					<Typography variant="h5">My Forms</Typography>
					<Divider className={classes.divider} />
					<List>
						<Query query={GET_FORMS_QUERY}>
							{({ loading, error, data: { getForms: forms } }) => {
								if (loading) return <ReactLoading color="#2196f3" />
								if (error) {
									return <Typography>{error.message}</Typography>
								}

								return forms.length ? (
									renderFormItems(forms)
								) : (
									<ListItem>
										<ListItemText primary="Click the plus button to create a form." />
									</ListItem>
								)
							}}
						</Query>
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
							{addForm && (
								<Mutation
									mutation={CREATE_FORM_MUTATION}
									errorPolicy="all"
									update={(cache, { data: { createForm } }) => {
										const { getForms } = cache.readQuery({
											query: GET_FORMS_QUERY,
										})
										cache.writeQuery({
											query: GET_FORMS_QUERY,
											data: { getForms: getForms.concat([ createForm ]) },
										})
									}}>
									{createForm => (
										<Button onClick={handleCreateForm(createForm)}>
											Create Form
										</Button>
									)}
								</Mutation>
							)}
						</ListItem>
					</List>
				</Grid>
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

export default withStyles(styles)(Home)
