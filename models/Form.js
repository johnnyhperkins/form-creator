const mongoose = require('mongoose')
const _ = require('lodash')
const {
	ATTRIBUTES,
	FORM_ELEMENTS,
	INPUT_TYPES,
	LABEL_POSITIONS,
} = require('../client/src/constants')

const FormSchema = new mongoose.Schema(
	{
		title: String,
		createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
		formFields: [
			{
				label: String,
				labelPosition: { type: String, enum: _.values(LABEL_POSITIONS) },
				formElement: { type: String, enum: _.values(FORM_ELEMENTS) },
				inputType: { type: String, enum: _.values(INPUT_TYPES) },
				attributes: [
					{
						attr: { type: String, enum: _.values(ATTRIBUTES) },
						value: String,
					},
				],
			},
		],
		action: String,
		createdAt: { type: Date, default: Date.now },
		method: String,
	},
	{ timestamps: true },
)

module.exports = mongoose.model('Form', FormSchema)
