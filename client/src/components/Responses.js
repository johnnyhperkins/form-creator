import React, { useState, useEffect } from 'react'
import FieldResponse from './FieldResponse'
import { GET_RESPONSES_QUERY } from '../graphql/queries'
import handleError from '../utils/handleError'

const Responses = ({ classes, formId, client, dispatch }) => {
	const [ formResponses, setFormResponses ] = useState([])

	useEffect(() => {
		getResponses()
	})

	const getResponses = async () => {
		try {
			const { getResponses } = await client.request(GET_RESPONSES_QUERY, {
				formId,
			})

			if (getResponses.length) {
				setFormResponses(getResponses)
			}
		} catch (err) {
			handleError(err, dispatch)
		}
	}

	return (
		formResponses && (
			<div>
				{formResponses.map((field, idx) => (
					<FieldResponse classes={classes} field={field} key={idx} />
				))}
			</div>
		)
	)
}

export default Responses
