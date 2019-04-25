export default function reducer(state, { type, payload }) {
	// console.log('before state:', state)
	// console.log('payload:', payload)
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
			const filteredForms = state.forms.filter(
				form => form._id !== deletedFormId,
			)
			return {
				...state,
				forms: filteredForms,
			}
		case 'DELETE_FIELD':
			const deletedFieldId = payload
			const updatedFormFields = state.currentFormFields.filter(
				field => field._id !== deletedFieldId,
			)
			return {
				...state,
				currentForm: {
					...state.currentForm,
					formFields: [ updatedFormFields ],
				},
			}
		case 'GET_FORM':
			const { _id, createdBy, title, formFields } = payload
			return {
				...state,
				currentForm: {
					_id,
					createdBy,
					title,
				},
				currentFormFields: formFields,
			}

		case 'UPDATE_FORM':
			// for now the only form updates that can be done are changing the title
			return {
				...state,
				currentForm: {
					...state.currentForm,
					title: payload.title,
				},
			}
		case 'ADD_FORM_FIELD':
			// debugger
			return {
				...state,
				currentForm: {
					...state.currentForm,
					formFields: [ ...state.currentFormFields, payload ],
				},
			}
		case 'UPDATE_FORM_FIELD':
			return state
		// To Do: Implement update
		// return {
		// 	...state,
		// 	currentFormFields: {
		// 		...state.currentForm,
		// 		...payload,
		// 	},
		// }
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
