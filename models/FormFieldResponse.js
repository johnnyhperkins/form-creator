const mongoose = require('mongoose')

const FormFieldResponseSchema = new mongoose.Schema(
	{
		form: { type: mongoose.Schema.ObjectId, ref: 'Form' },
		formField: { type: mongoose.Schema.ObjectId, ref: 'FormField' },
		user: String,
		value: String,
	},
	{ timestamps: true },
)

module.exports = mongoose.model('FormFieldResponse', FormFieldResponseSchema)
