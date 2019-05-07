import React from 'react'

import Grid from '@material-ui/core/Grid'

import UIAlerts from './UIAlerts'
import WarningModal from './WarningModal'

const Footer = () => {
	return (
		<Grid container>
			<Grid item xs={12}>
				<UIAlerts />
				<WarningModal />
			</Grid>
		</Grid>
	)
}

export default Footer
