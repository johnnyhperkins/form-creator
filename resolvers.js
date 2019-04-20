const { AuthenticationError } = require('apollo-server')
const Form = require('./models/Form')
const ObjectId = require('mongoose').Types.ObjectId

const authenticated = next => (root, args, ctx, info) => {
	if (!ctx.currentUser) {
		throw new AuthenticationError('You must be logged in')
	}
	return next(root, args, ctx, info)
}

module.exports = {
	Query: {
		me: authenticated((root, args, ctx) => ctx.currentUser),
		async getForms(root, { createdBy }) {
			const forms = await Form.find({
				createdBy: new ObjectId(createdBy),
			}).populate('createdBy')
			return forms
		},
		async getForm(root, { formId, createdBy }) {
			const form = await Form.findById(formId).populate('createdBy')

			if (String(form.createdBy._id) !== createdBy) {
				throw new AuthenticationError(
					'You do not have permission to edit this form',
				)
			}
			return form
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
		deleteForm: authenticated(async (root, args) => {
			const formDeleted = await Form.findOneAndDelete({
				_id: args.formId,
			}).exec()
			return formDeleted
		}),
		async updateForm(root, { _id, input }) {
			return await Form.findOneAndUpdate(
				{
					_id,
				},
				input,
				{
					new: true,
				},
			)
		},
		async editFormField(root, { formId, idx, input }) {},
		async addFormFieldAttribute(root, { formId, input }) {},
		async addFormField(root, { formId, input }) {
			const form = await Form.findOneAndUpdate(
				{
					_id: formId,
				},
				{ $push: { formFields: input } },
				{ new: true },
			)
			return form
		},
	},
}
