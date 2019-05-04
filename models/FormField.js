const mongoose = require('mongoose')

const FormFieldSchema = new mongoose.Schema(
	{
		type: String,
		label: String,
		form: { type: mongoose.Schema.ObjectId, ref: 'Form' },
	},
	{ timestamps: true },
)

module.exports = mongoose.model('FormField', FormFieldSchema)
