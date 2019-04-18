import { createContext } from 'react'

const Context = createContext({
	currentUser: null,
	isAuth: false,
	forms: [],
	currentForm: null,
})

export default Context
