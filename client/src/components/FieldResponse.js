import React from 'react'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import moment from 'moment'
const ObjectId = require('mongoose').Types.ObjectId

const FieldResponse = ({ classes, field }) => {
	const renderDate = id => {
		return moment(ObjectId(id).getTimestamp()).format('MMMM Do YYYY, h:mm a')
	}

	return (
		<div>
			<Typography variant="h5">{field.label}</Typography>
			<List>
				{field.responses.map((res, idx) => {
					return (
						<ListItem key={idx}>
							<ListItemText
								primary={res.value}
								secondary={`${res.user} at ${renderDate(res._id)}`}
							/>
						</ListItem>
					)
				})}
			</List>
			<Divider className={classes.divider} />
		</div>
	)
}

export default FieldResponse
