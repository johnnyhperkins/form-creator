const { AuthenticationError } = require('apollo-server')
const Form = require('./models/Form')

const authenticated = next => (root, args, ctx, info) => {
	if (!ctx.currentUser) {
		throw new AuthenticationError('You must be logged in')
	}
	return next(root, args, ctx, info)
}

module.exports = {
	Query: {
		me: authenticated((root, args, ctx, info) => ctx.currentUser),
		getForms: async (root, args, ctx) => {
			// in mongoose the empty filter returns all documents
			const forms = await Form.find({}).populate('createdBy')
			return forms
		},
	},
	Mutation: {
		createForm: authenticated(async (root, args, ctx) => {
			const newForm = await new Form({
				...args.input,
				createdBy: ctx.currentUser._id,
			}).save()
			const formAdded = await Form.populate(newForm, 'createdBy')
			return formAdded
		}),
	},
}
