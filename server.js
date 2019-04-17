const { ApolloServer } = require('apollo-server')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const mongoose = require('mongoose')
require('dotenv').config()
const { findOrCreateUser } = require('./controllers/userController')

mongoose
	.connect(process.env.MONGO_URI, { useNewUrlParser: true })
	.then(() => console.log('DB CONNECTED!'))
	.catch(err => console.log(err))

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		// Context executes on every request
		// this context function (can also be an object) allows us access to any parameters that we're sending to the backend, i.e.
		// the authorization token in the Login component
		let authToken = null
		let currentUser = null
		try {
			authToken = req.headers.authorization
			if (authToken) {
				// ..continued from Login.js:
				// now we intercept the request that's being made, grab that authorization header
				// we set in Login.js and send it off to the findOrCreateUser function in userController.js
				// (continue to userController.js)
				currentUser = await findOrCreateUser(authToken)
			}
		} catch (err) {
			console.error(`Unable to authenticate user with token ${authToken}`)
		}
		// (continued from userController.js): we return the currentUser, then... (continue to resolvers.js)
		return { currentUser }
	},
})

server.listen().then(({ url }) => console.log('Server is running on ' + url))
