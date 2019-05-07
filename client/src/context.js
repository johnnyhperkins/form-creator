import { createContext } from 'react'

const Context = createContext({
	currentUser: null,
	isAuth: false,
	ui: { snackBarOpen: false, message: '' },
	warningModal: { modalOpen: false, title: '', message: '', action: null },
	forms: [],
	currentForm: null,
	currentFormFields: [],
})

export default Context
