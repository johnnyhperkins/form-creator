const mongoose = require('mongoose')

const FormSchema = new mongoose.Schema(
	{
		title: String,
		createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
		formFields: [ { type: mongoose.Schema.ObjectId, ref: 'FormField' } ],
		url: String,
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true },
)

module.exports = mongoose.model('Form', FormSchema)
