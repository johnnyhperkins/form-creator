import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import EditIcon from '@material-ui/icons/Edit'
import DehazeIcon from '@material-ui/icons/Dehaze'
import styled from 'styled-components'

import Context from '../context'

const Field = styled.div``

const FormField = ({ classes, field, provided, setIdToDelete }) => {
	const { dispatch } = useContext(Context)

	const startUpdateField = field => {
		const { type, label, _id } = field
		dispatch({
			type: 'TOGGLE_DRAWER',
			payload: {
				open: true,
				label,
				type,
				_id,
			},
		})
	}
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
						rows={3}
						variant="outlined"
						label={field.label}
					/>
				)
			default:
				return null
		}
	}

	return (
		<Field
			className={classes.formFieldContainer}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			ref={provided.innerRef}>
			<div className={classes.formFieldWrapper}>
				<div className={classes.centerFlex}>
					<DehazeIcon className={classes.grabIcon} /> {renderField(field)}
				</div>
				<div>
					<EditIcon
						onClick={() => startUpdateField(field)}
						className={classes.editIcon}
					/>{' '}
					<DeleteIcon
						onClick={() => setIdToDelete(field._id)}
						className={classes.deleteIcon}
					/>
				</div>
			</div>
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
	grabIcon: {
		color: '#ccc',
		cursor: 'grab',
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
