const { ApolloServer } = require('apollo-server')
//passport
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const mongoose = require('mongoose')
require('dotenv').config()
const { findOrCreateUser } = require('./controllers/userController')

if (typeof localStorage === 'undefined' || localStorage === null) {
	const LocalStorage = require('node-localstorage').LocalStorage
	localStorage = new LocalStorage('./scratch')
}

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log('DB CONNECTED!'))
	.catch(err => console.log(err))

const server = new ApolloServer({
	typeDefs,
	resolvers,
	mode: 'cors',
	cors: true,
	debug: true,
	introspection: true,
	playground: true,
	context: async ({ req }) => {
		try {
			const userType = req.headers.usertype
			const authToken = req.headers.authorization
			let currentUser = null

			if (!authToken && userType === 'public') {
				currentUser = { name: 'Anonymous' }
			} else if (authToken && userType) {
				currentUser = await findOrCreateUser(authToken, userType)
			}

			return { currentUser }
		} catch (err) {
			console.error(`Unable to authenticate user with token ${authToken}`)
		}
	},
})

server
	.listen({ port: process.env.PORT || 4000 })
	.then(({ url }) => console.log('Server is running on ' + url))
