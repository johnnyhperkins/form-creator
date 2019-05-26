const processSignIn = ({ me, isLoggedIn, isGoogle }, dispatch) => {
	dispatch({
		type: 'LOGIN_USER',
		payload: { me, isGoogle, isLoggedIn },
	})
}

export default processSignIn
