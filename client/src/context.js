import { createContext } from 'react'

const Context = createContext({
	currentUser: null,
	isAuth: false,
	ui: { snackBarOpen: false, message: '' },
	forms: [],
	currentForm: null,
	currentFormFields: [],
})

export default Context
