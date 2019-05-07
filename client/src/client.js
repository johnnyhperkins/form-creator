import { GraphQLClient } from 'graphql-request'

export const BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://border-box.herokuapp.com/graphql'
		: 'http://localhost:4000/graphql'

export const useClient = () => {
	const idToken = window.gapi.auth2
		.getAuthInstance()
		.currentUser.get()
		.getAuthResponse().id_token

	return new GraphQLClient(BASE_URL, {
		headers: { authorization: idToken },
	})
}
