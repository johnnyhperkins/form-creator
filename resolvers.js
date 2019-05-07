const { AuthenticationError, ApolloError } = require('apollo-server')
const Form = require('./models/Form')
const FormField = require('./models/FormField')
const FormFieldResponse = require('./models/FormFieldResponse')
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

		getResponses: authenticated(async (root, { formId }) => {
			// to do: figure out how to best authenticate if the user requesting the responses is the author of the form
			return FormField.aggregate([
				{ $match: { form: ObjectId(formId) } },
				{
					$lookup: {
						from: 'formfieldresponses',
						localField: '_id',
						foreignField: 'formField',
						as: 'responses',
					},
				},
			]).then(response => response)
		}),

		getForms: authenticated(async (root, args, ctx) => {
			const forms = await Form.find({ createdBy: ctx.currentUser._id })

			return forms
		}),

		getForm: authenticated(async (root, { _id }, ctx) => {
			const form = await Form.findOne({
				_id,
				createdBy: ctx.currentUser._id,
			}).populate('formFields')

			return form
		}),
	},

	Mutation: {
		async submitForm(root, { input }) {
			const responses = input.map(response => ({
				...response,
				form: ObjectId(response.form),
				formField: ObjectId(response.formField),
			}))

			return FormFieldResponse.collection.insertMany(responses).then(result => {
				return result.ops
			})
		},

		createForm: authenticated(async (root, args, ctx) => {
			const newForm = new Form({
				...args.input,
				createdBy: ctx.currentUser._id,
			})
			newForm.url = `/${ctx.currentUser.name.replace(/ /g, '')}/${newForm._id}`

			return await newForm.save()
		}),

		deleteForm: authenticated(async (root, { formId: _id }, ctx) => {
			try {
				await Form.findOneAndDelete({
					_id,
					createdBy: ObjectId(ctx.currentUser._id),
				})
				await FormField.deleteMany({
					form: _id,
				})
				await FormFieldResponse.deleteMany({
					form: _id,
				})
			} catch (err) {
				throw new AuthenticationError(
					'You are not authorized to delete this form',
				)
			}
		}),

		deleteField: authenticated(async (root, { _id, formId }) => {
			await FormField.findByIdAndRemove(_id)
			await FormFieldResponse.deleteMany({
				formField: _id,
			})
			await Form.findOneAndUpdate(
				{ _id: formId },
				{ $pull: { formFields: _id } },
			)
		}),

		addFormField: authenticated(async (root, { formId, input }) => {
			const formField = await new FormField({
				...input,
				form: formId,
			}).save()

			await Form.findOneAndUpdate(
				{
					_id: formId,
				},
				{ $addToSet: { formFields: formField._id } },
				{ new: true },
			)

			return formField
		}),

		updateFormField: authenticated(async (root, { _id, input }, ctx) => {
			await FormField.findOneAndUpdate({ _id }, input)
		}),

		updateForm: authenticated(async (root, { _id, input }, ctx) => {
			await Form.findOneAndUpdate(
				{ _id, createdBy: ctx.currentUser._id },
				input,
			)
		}),
	},
}
