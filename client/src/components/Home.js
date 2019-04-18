import React, { useState, useContext, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Context from '../context'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { CREATE_FORM_MUTATION } from '../graphql/mutations'
import { GET_FORMS_QUERY } from '../graphql/queries'
import { useClient } from '../client'
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

// first want to check if user has forms,
// if so list them otherwise only display the create new forms button
const Home = ({ classes }) => {
	const { state, dispatch } = useContext(Context)
	const [ title, setTitle ] = useState('')
	const client = useClient()

	useEffect(() => {
		
		getForms()
		console.log(state.currentUser)
		console.log(state);
	}, [])

	const handleSubmit = async () => {
		const {createForm} = await client.request(CREATE_FORM_MUTATION, { title })
		dispatch({ type: 'CREATE_FORM', payload: createForm })
		console.log(state);
		setTitle('')
	}

	const getForms = async () => {
		const { getForms } = await client.request(GET_FORMS_QUERY)
		dispatch({ type: 'GET_FORMS', payload: getForms })
	}

	return (
		<div className={classes.root}>
			<form className={classes.form}>
				<Typography>Create A Form</Typography>
				<TextField
					required
					label="Required"
					placeholder="Name your form"
					className={classes.textField}
					margin="normal"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<Button onClick={handleSubmit}>Create New Form</Button>
			</form>
			{state.forms &&
				state.forms.map(form => {
					return (
						<div key={form._id}>
							<p>{form.title}</p>
						</div>
					)
				})}
		</div>
	)
}

const styles = {
	root: {
		height: '100vh',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		alignItems: 'center',
	},
	textField: {
		width: 200,
	},
	form: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
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
	deleteIcon: {
		color: 'red',
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

export default withStyles(styles)(Home)
