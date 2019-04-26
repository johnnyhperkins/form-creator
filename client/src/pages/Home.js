import React, { useState, useContext, useEffect } from 'react'
import { withRouter } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'

import Context from '../context'
import {
	CREATE_FORM_MUTATION,
	DELETE_FORM_MUTATION,
} from '../graphql/mutations'
import { GET_FORMS_QUERY } from '../graphql/queries'
import { useClient } from '../client'

const Home = ({ classes, history }) => {
	const { state, dispatch } = useContext(Context)
	const [ title, setTitle ] = useState('')
	const client = useClient()

	useEffect(() => {
		getForms()
	}, [])

	const handleSubmit = async () => {
		const { createForm } = await client.request(CREATE_FORM_MUTATION, { title })
		dispatch({ type: 'CREATE_FORM', payload: createForm })
		setTitle('')
	}

	const handleClick = id => {
		history.push(`/form/${id}`)
	}

	const handleDeleteForm = async id => {
		await client.request(DELETE_FORM_MUTATION, { formId: id })
		dispatch({ type: 'DELETE_FORM', payload: id })
	}

	const getForms = async () => {
		const { getForms } = await client.request(GET_FORMS_QUERY)
		dispatch({ type: 'GET_FORMS', payload: getForms })
	}

	return (
		<div className={classes.root}>
			<div className={classes.formArea}>
				{state.forms && (
					<div>
						<Typography variant="h4">My Forms</Typography>
						<List>
							{state.forms.map(form => {
								return (
									<ListItem className={classes.formItem} key={form._id}>
										<ListItemText
											className={classes.pointer}
											onClick={() => handleClick(form._id)}
											primary={form.title}
										/>
										<Button onClick={() => handleDeleteForm(form._id)}>
											<DeleteIcon className={classes.deleteIcon} />
										</Button>
									</ListItem>
								)
							})}
						</List>
					</div>
				)}
			</div>
			<div className={classes.sidebar}>
				<Typography variant="h4">Create A Form</Typography>
				<TextField
					required
					label="Title"
					variant="outlined"
					placeholder="Name your form"
					className={classes.textField}
					margin="normal"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<Button variant="outlined" onClick={handleSubmit}>
					Create New Form
				</Button>
			</div>
		</div>
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
		minHeight: '100vh',
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
	pointer: {
		cursor: 'pointer',
	},
	popupTab: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
	},
}

export default withRouter(withStyles(styles)(Home))
