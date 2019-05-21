const handleError = (errors, dispatch) => {
	const code = errors[0].extensions.code
	let message

	switch (code) {
		case 'INTERNAL_SERVER_ERROR':
			message = 'Internal server error. Please try again later'
			break

		case 'UNAUTHENTICATED':
			message = "You're not authorized to perform this action"
			break
		default:
			message = 'Unknown Error'
			break
	}

	return dispatch({
		type: 'SNACKBAR',
		payload: { snackBarOpen: true, message },
	})
}

export default handleError
