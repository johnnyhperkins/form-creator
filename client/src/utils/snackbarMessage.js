export const snackbarMessage = (message, dispatch) => {
	dispatch({
		type: 'SNACKBAR',
		payload: { open: true, message },
	})
}
