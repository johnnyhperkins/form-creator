const { AuthenticationError } = require('apollo-server')
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
			const forms = await Form.find(
				{
					createdBy: ctx.currentUser._id,
				},
				err => {
					if (err) console.log('getform error:', err)
				},
			).populate('createdBy')

			return forms
		}),

		getForm: authenticated(async (root, { _id }, ctx) => {
			const form = await Form.findOne(
				{ _id, createdBy: ctx.currentUser._id },
				err => {
					if (err) console.log('getform error:', err)
				},
			).populate('formFields')

			return form
		}),
	},

	Mutation: {
		async submitForm(root, { formId, input }) {
			const responses = input.map(response => ({
				...response,
				form: ObjectId(response.form),
				formField: ObjectId(response.formField),
			}))
			return FormFieldResponse.collection
				.insertMany(responses)
				.then(result => {
					return result.ops
				})
				.catch(err => console.error(`Failed to insert documents ${err}`))
		},
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
			await FormFieldResponse.deleteMany({
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
				err => {
					if (err) console.log('getform error:', err)
				},
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
				{ $push: { formFields: formField._id } },
				{ new: true },
			)

			return formField
		}),
		editFormField: authenticated(async (root, { _id, input }, ctx) => {
			await FormField.findOneAndUpdate({ _id }, input, err => {
				if (err) console.log('getform error:', err)
			})
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
					err => {
						if (err) console.log('getform error:', err)
					},
				)
			},
		),
	},
}
