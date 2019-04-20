export default function reducer(state, { type, payload }) {
	switch (type) {
		case 'LOGIN_USER':
			return {
				...state,
				currentUser: payload,
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
			}

		case 'DELETE_FORM':
			const deletedFormId = payload
			const filteredForms = state.forms.filter(pin => pin._id !== deletedFormId)
			return {
				...state,
				forms: filteredForms,
			}

		case 'GET_FORM':
			return {
				...state,
				currentForm: payload,
			}

		case 'UPDATE_FORM_FIELD':
			return {
				...state,
				currentForm: {
					...state.currentForm,
					...payload,
				},
			}
		case 'CREATE_FORM':
			const newForm = payload
			const prevForms = state.forms.filter(form => form._id !== newForm._id)
			return {
				...state,
				forms: [ ...prevForms, newForm ],
			}
		case 'DELETE_DRAFT':
			return { ...state, draft: null }
		case 'GET_FORMS':
			return { ...state, forms: payload }
		default:
			return state
	}
}
