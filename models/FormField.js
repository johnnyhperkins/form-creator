const mongoose = require('mongoose')
const _ = require('lodash')
import { FORM_ELEMENTS, INPUT_TYPES, LABEL_POSITIONS } from '../constants'

const FormFieldSchema = new mongoose.Schema(
	{
		label: String,
		labelPosition: { type: String, enum: _.values(LABEL_POSITIONS) },
		formElement: { type: String, enum: _.values(FORM_ELEMENTS) },
		inputType: { type: String, enum: _.values(INPUT_TYPES) },
		form: { type: mongoose.Schema.ObjectId, ref: 'Form' },
		attributes: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Attribute',
			},
		],
	},
	{ timestamps: true },
)

module.exports = mongoose.model('FormField', FormFieldSchema)
