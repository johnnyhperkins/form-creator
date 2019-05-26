const { AuthenticationError, ApolloError } = require('apollo-server')
const Form = require('./models/Form')
const User = require('./models/User')
const FormField = require('./models/FormField')
const FormFieldResponse = require('./models/FormFieldResponse')
const ObjectId = require('mongoose').Types.ObjectId
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const APP_SECRET = process.env.APP_SECRET

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
			// to do: figure out how to best authenticate if the user requesting the responses is the author of the form (for serverside validation) and if it's even necessary
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

		async getForm(root, { _id }) {
			const form = await Form.findOne({
				_id,
			}).populate('formFields')

			return form
		},
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

		async login(root, args) {
			const user = await User.findOne({ email: args.email }).exec()

			if (!user) {
				throw new AuthenticationError('No such user found')
			}

			const valid = await bcrypt.compare(args.password, user.password)

			if (!valid) {
				throw new AuthenticationError('Invalid password')
			}

			const token = jwt.sign({ userId: user.id }, APP_SECRET)

			return {
				token,
				user,
			}
		},

		async signup(root, args) {
			const userExists = await User.findOne({ email: args.email }).exec()
			if (userExists) {
				// throw error here?
				return {
					token: '',
					user: null,
				}
			}

			const password = await bcrypt.hash(args.password, 8)
			const user = await new User({ ...args, password }).save()
			const token = jwt.sign({ userId: user.id }, APP_SECRET)

			return {
				token,
				user,
			}
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
			const form = await Form.findOneAndDelete({
				_id,
				createdBy: ObjectId(ctx.currentUser._id),
			})
			if (!form) {
				throw new AuthenticationError(
					'You are not authorized to delete this form',
				)
			}
			await FormField.deleteMany({
				form: _id,
			})
			await FormFieldResponse.deleteMany({
				form: _id,
			})
			return form
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

		createFormField: authenticated(async (root, { formId, input }) => {
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
			return await FormField.findOneAndUpdate({ _id }, input, { new: true })
		}),

		updateForm: authenticated(async (root, { _id, input }, ctx) => {
			const form = await Form.findOneAndUpdate(
				{ _id, createdBy: ctx.currentUser._id },
				input,
				{ new: true },
			)
			const formUpdated = await Form.populate(form, 'formFields')

			return formUpdated
		}),
	},
}
