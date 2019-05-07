import { GraphQLClient } from 'graphql-request'
// import handleError from './utils/handleError'

export const BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://border-box.herokuapp.com/graphql'
		: 'http://localhost:4000/graphql'

export const useClient = () => {
	try {
		// if (window.gapi) {
		const idToken = window.gapi.auth2
			.getAuthInstance()
			.currentUser.get()
			.getAuthResponse().id_token

		return new GraphQLClient(BASE_URL, {
			headers: { authorization: idToken },
		})
	} catch (err) {
		console.log(err)
		window.location = '/'
		// handleError(err)
	}
}
