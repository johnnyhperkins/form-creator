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
		url: String
		formFields: [FormField!]
	}

	type FormFieldResponse {
		_id: ID!
		form: Form
		user: String
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
		title: String
		formFields: [ID!]
	}

	input FormFieldInput {
		type: String
		label: String
	}

	input FormFieldResponseInput {
		form: ID!
		formField: ID!
		user: String
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
		updateForm(_id: ID!, input: FormInput): Form
		# signup(username: String!, email: String!, password: String!): String
		# login(email: String!, password: String!): String
		deleteForm(formId: ID!): Form
		createFormField(formId: ID!, input: FormFieldInput): FormField
		updateFormField(_id: ID!, input: FormFieldInput): FormField
		deleteField(_id: ID!, formId: ID!): FormField
		submitForm(input: [FormFieldResponseInput]): [FormFieldResponse!]!
	}
`
