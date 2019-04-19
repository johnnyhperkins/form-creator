const { AuthenticationError } = require('apollo-server')
const Form = require('./models/Form')
const ObjectId = require('mongoose').Types.ObjectId; 

const authenticated = next => (root, args, ctx, info) => {
	if (!ctx.currentUser) {
		throw new AuthenticationError('You must be logged in')
	}
	return next(root, args, ctx, info)
}

module.exports = {
	Query: {
		me: authenticated((root, args, ctx) => ctx.currentUser),
		getForms: async (root, args, ctx) => {
			// in mongoose the empty filter returns all documents
			const forms = await Form.find({createdBy: new ObjectId(args.createdBy)}).populate('createdBy')
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
		deleteForm: authenticated(async (root, args, ctx) => {
			const formDeleted = await Form.findOneAndDelete({ _id: args.formId }).exec()
			return formDeleted
		}),
	},
}
