const User = require('../models/User')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)
const jwt = require('jsonwebtoken')
require('dotenv').config()

const APP_SECRET = process.env.APP_SECRET

exports.findOrCreateUser = async (token, userType) => {
	const user = await verifyAuthToken(token, userType)

	return user
}

const verifyAuthToken = async (token, userType) => {
	try {
		// For now this function only supports email signed up & google auth users.
		// More auth methods could be added here in the future.

		if (userType === 'email') {
			const { userId } = jwt.verify(token, APP_SECRET)

			return await User.findById(userId)
		} else if (userType === 'google') {
			const ticket = await client.verifyIdToken({
				idToken: token,
				audience: process.env.OAUTH_CLIENT_ID,
			})
			const googleUser = ticket.getPayload()
			const existingUser = await checkIfUserExists(googleUser.email)

			return existingUser ? existingUser : createNewUser(googleUser)
		}
	} catch (error) {
		console.error(`Unable to verify auth token: ${error}`)
	}
}

const checkIfUserExists = async email => await User.findOne({ email }).exec()
const createNewUser = user => {
	const { name, email, picture, password = '' } = user
	const newUser = { name, email, picture, password }
	return new User(newUser).save()
}
