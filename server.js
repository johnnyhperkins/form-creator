const { ApolloServer } = require('apollo-server')
//passport
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
	mode: 'cors',
	introspection: true,
	playground: true,
	context: async ({ req }) => {
		let authToken = null
		let currentUser = null
		let publicUser = null

		try {
			authToken = req.headers.authorization
			if (authToken) {
				currentUser = await findOrCreateUser(authToken)
			} else {
				publicUser = { name: 'Anonymous' }
			}
		} catch (err) {
			console.error(`Unable to authenticate user with token ${authToken}`)
		}
		return { currentUser, publicUser }
	},
})

server
	.listen({ port: process.env.PORT || 4000 })
	.then(({ url }) => console.log('Server is running on ' + url))
