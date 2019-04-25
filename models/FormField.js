const mongoose = require('mongoose')
const _ = require('lodash')

const FormFieldSchema = new mongoose.Schema(
	{
		type: String,
		label: String,
		labelPosition: String,
		form: { type: mongoose.Schema.ObjectId, ref: 'Form' },
	},
	{ timestamps: true },
)

module.exports = mongoose.model('FormField', FormFieldSchema)
