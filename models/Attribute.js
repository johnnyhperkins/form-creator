const mongoose = require('mongoose')
const _ = require('lodash')
import { ATTRIBUTES } from '../constants'

const AttributeSchema = new mongoose.Schema(
	{
		formField: { type: mongoose.Schema.ObjectId, ref: 'FormField' },
		attr: { type: String, enum: _.values(ATTRIBUTES) },
		value: String,
	},
	{ timestamps: true },
)

module.exports = mongoose.model('Attribute', AttributeSchema)
