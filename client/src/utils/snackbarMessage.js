export const snackbarMessage = (message, dispatch) => {
	dispatch({
		type: 'SNACKBAR',
		payload: { snackBarOpen: true, message },
	})
}
