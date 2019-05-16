import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

export default props => {
	const MyLink = styled(RouterLink)`
		color: ${props.color ? props.color : '#2196f3'};
		text-decoration: none;
		font-size: 1rem;
		font-family: "Roboto", "Helvetica", "Arial", sans-serif;
		font-weight: 400;
		line-height: 1.5;
		letter-spacing: 0.00938em;
		${props.small &&
			`font-size: 14px; 
			margin-top: 10px; 
			margin-right: 10px; 
			color: #777; 
			display: inline-block; 
			text-decoration: underline;`}
	`

	return <MyLink {...props} />
}
