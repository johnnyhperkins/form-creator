const User = require('../models/User')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)

exports.findOrCreateUser = async token => {
	// (continued from server.js):
	// we verify the auth token is valid
	const googleUser = await verifyAuthToken(token)
	// check if user exists using the helper method below and the mongo function findOne
	const user = await checkIfUserExists(googleUser.email)
	// if user exists, return them; otherwise create new user in DB (continue to server.js above 'return currentUser')
	return user ? user : createNewUser(googleUser)
}

const verifyAuthToken = async token => {
	try {
		// verifyIdToken is a built in method on OAuth2Client
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.OAUTH_CLIENT_ID,
		})

		// getPayload is a method available on the returned promise object

		return ticket.getPayload()
	} catch (error) {
		console.error(`Unable to verify auth token: ${error}`)
	}
}

const checkIfUserExists = async email => await User.findOne({ email }).exec()
const createNewUser = googleUser => {
	const { name, email, picture } = googleUser
	const user = { name, email, picture }
	return new User(user).save()
}
