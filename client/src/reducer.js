export default function reducer(state, { type, payload }) {
	switch (type) {
		case 'LOGIN_USER':
			const { me, isLoggedIn, isGoogle } = payload
			return {
				...state,
				currentUser: me,
				isAuth: isLoggedIn,
				isGoogle,
			}

		case 'IS_LOGGED_IN':
			return {
				...state,
				isAuth: payload,
			}

		case 'SIGNOUT_USER':
			return {
				...state,
				currentUser: null,
				isAuth: false,
				isGoogle: false,
			}

		case 'SNACKBAR':
			return {
				...state,
				ui: {
					...state.ui,
					snackbar: payload,
				},
			}

		case 'TOGGLE_DRAWER':
			return {
				...state,
				ui: {
					...state.ui,
					drawer: payload,
				},
			}

		case 'TOGGLE_WARNING_MODAL':
			return {
				...state,
				warningModal: payload,
			}
		default:
			return state
	}
}
