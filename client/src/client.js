import { GraphQLClient } from 'graphql-request'

export const BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://border-box.herokuapp.com/graphql'
		: 'http://localhost:4000/graphql'

export const useClient = () => {
	try {
		let headers = {
			headers: {
				authorization: '',
				usertype: '',
			},
		}
		const jwtToken = localStorage.getItem('bbToken')

		if (jwtToken) {
			headers.headers = {
				authorization: jwtToken,
				usertype: 'email',
			}
		} else if (window.gapi) {
			const googleToken = window.gapi.auth2
				.getAuthInstance()
				.currentUser.get()
				.getAuthResponse().id_token

			if (googleToken) {
				headers.headers = {
					authorization: googleToken,
					usertype: 'google',
				}
			}
		} else {
			headers.headers.usertype = 'public'
		}

		return new GraphQLClient(BASE_URL, headers)
	} catch (err) {
		console.log('client error', err)
		window.location = '/'
	}
}
