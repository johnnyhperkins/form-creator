import React from 'react'

import Grid from '@material-ui/core/Grid'

import UIAlerts from './UIAlerts'

const Footer = () => {
	return (
		<Grid container>
			<Grid item xs={12}>
				<UIAlerts />
			</Grid>
		</Grid>
	)
}

export default Footer
