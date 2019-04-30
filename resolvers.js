const { AuthenticationError } = require('apollo-server')
const Form = require('./models/Form')
const FormField = require('./models/FormField')
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
		getForms: authenticated(async (root, args, ctx) => {
			const forms = await Form.find(
				{
					createdBy: ctx.currentUser._id,
				},
				err => {
					console.log('getForms Error: ', err)
				},
			).populate('createdBy')

			return forms
		}),

		getForm: authenticated(async (root, { _id }, ctx) => {
			const form = await Form.findOne(
				{ _id, createdBy: ctx.currentUser._id },
				err => {
					console.log('getform error:', err)
				},
			).populate('formFields')

			return form
		}),
	},
	Mutation: {
		createForm: authenticated(async (root, args, ctx) => {
			const newForm = new Form({
				...args.input,
				createdBy: ctx.currentUser._id,
			})
			newForm.url = `/${ctx.currentUser.name.replace(/ /g, '')}/${newForm._id}`
			await newForm.save()
			const formAdded = await Form.populate(newForm, 'createdBy')

			return formAdded
		}),
		deleteForm: authenticated(async (root, { formId }, ctx) => {
			const formDeleted = await Form.findOneAndDelete({
				_id: formId,
			}).exec()
			await FormField.deleteMany({
				form: formId,
			})
			return formDeleted
		}),
		updateForm: authenticated(async (root, { _id, input }, ctx) => {
			return await Form.findOneAndUpdate(
				{
					_id,
				},
				input,
				{
					new: true,
				},
			)
		}),
		deleteField: authenticated(async (root, { _id, formId }, ctx) => {
			await FormField.findByIdAndRemove(_id, err => console.log(err))
			await Form.findOneAndUpdate(
				{ _id: formId },
				{ $pull: { formFields: _id } },
				{ new: true },
				err => console.log(err),
			)
		}),
		addFormField: authenticated(async (root, { formId, input }) => {
			const formField = await new FormField({
				...input,
				form: new ObjectId(formId),
			}).save()

			await Form.findOneAndUpdate(
				{
					_id: formId,
				},
				{ $push: { formFields: formField._id } },
				{ new: true },
			)

			return formField
		}),
		editFormField: authenticated(async (root, { _id, input }, ctx) => {
			await FormField.findOneAndUpdate({ _id }, input, err => console.log(err))
		}),
		updateFormFieldOrder: authenticated(
			async (root, { _id, formFields }, ctx) => {
				await Form.findOneAndUpdate(
					{
						_id,
					},
					{
						formFields,
					},
					err => console.log(err),
				)
			},
		),
	},
}
