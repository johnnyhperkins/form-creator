const mongoose = require('mongoose')
const _ = require('lodash')
import { METHODS } from '../constants'

const FormSchema = new mongoose.Schema(
	{
		title: String,
		createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
		formFields: [ { type: mongoose.Schema.ObjectId, ref: 'FormField' } ],
		action: String,
		createdAt: { type: Date, default: Date.now },
		method: { type: String, enum: _.values(METHODS) },
	},
	{ timestamps: true },
)

module.exports = mongoose.model('Form', FormSchema)
