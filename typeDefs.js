const { gql } = require('apollo-server')

module.exports = gql`
	type User {
		_id: ID
		name: String
		email: String
		picture: String
	}

	type Form {
		_id: ID!
		createdBy: User!
		title: String!
		action: String
		method: String
		url: String
		formFields: [FormField!]
	}

	type FormFieldResponse {
		_id: ID!
		form: Form
		formField: FormField
		value: String
	}

	type FormField {
		_id: ID!
		type: String
		label: String
		form: Form
		responses: [FormFieldResponse]!
	}

	input FormInput {
		title: String!
		action: String
		method: String
	}

	input FormFieldInput {
		type: String
		label: String
	}

	input FormFieldResponseInput {
		form: ID!
		formField: ID!
		value: String
	}

	type Query {
		me: User
		getForms: [Form!]!
		getForm(_id: ID!): Form!
		getResponses(formId: ID!): [FormField!]!
	}

	type Mutation {
		createForm(input: FormInput!): Form
		deleteForm(formId: ID!): Form
		updateForm(_id: ID!, input: FormInput): Form
		addFormField(formId: ID!, input: FormFieldInput): FormField
		deleteField(_id: ID!, formId: ID!): FormField
		updateFormFieldOrder(_id: ID!, formFields: [ID!]!): Form
		editFormField(_id: ID!, input: FormFieldInput): FormField
		submitForm(
			formId: ID!
			input: [FormFieldResponseInput]
		): [FormFieldResponse!]!
	}
`
