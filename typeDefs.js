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
		formFields: [FormField!]
	}

	type FormField {
		_id: ID!
		type: String
		label: String
		form: Form
	}

	type Query {
		me: User
		getForms: [Form!]!
		getForm(_id: ID!): Form!
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

	type Mutation {
		createForm(input: FormInput!): Form
		deleteForm(formId: ID!): Form
		updateForm(_id: ID!, input: FormInput): Form
		addFormField(formId: ID!, input: FormFieldInput): FormField
		deleteField(_id: ID!, formId: ID!): FormField
		updateFormFieldOrder(_id: ID!, formFields: [ID!]!): Form
		editFormField(_id: ID!, input: FormFieldInput): FormField
	}
`
