const handleError = (errors, dispatch) => {
	let code
	let message

	if (errors.graphQLErrors) {
		message = errors.graphQLErrors[0].message
	} else if (errors.networkError) {
		message = errors.networkError[0].message
	} else if (typeof errors === 'object') {
		code = 'ERROR_OBJECT'
	} else {
		code = errors[0].extensions.code
	}

	if (!message) {
		switch (code) {
			case 'INTERNAL_SERVER_ERROR':
				message = 'Internal server error. Please try again later'
				break
			case 'UNAUTHENTICATED':
				message = "You're not authorized to perform this action"
				break
			case 'ERROR_OBJECT':
				message = 'Clientside Error thrown. Please try again later'
				break
			default:
				message = 'Unknown Error'
				break
		}
	}

	console.error(errors)
	return dispatch({
		type: 'SNACKBAR',
		payload: { open: true, message },
	})
}

export default handleError
