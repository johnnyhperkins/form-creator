export const snackbarMessage = (dispatch, message) => {
	dispatch({
		type: 'SNACKBAR',
		payload: { snackBarOpen: true, message },
	})
}
