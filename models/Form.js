const mongoose = require('mongoose')
const _ = require('lodash')

const FormSchema = new mongoose.Schema(
	{
		title: String,
		createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
		formFields: [ { type: mongoose.Schema.ObjectId, ref: 'FormField' } ],
		action: String,
		url: String,
		createdAt: { type: Date, default: Date.now },
		method: String,
	},
	{ timestamps: true },
)

module.exports = mongoose.model('Form', FormSchema)
