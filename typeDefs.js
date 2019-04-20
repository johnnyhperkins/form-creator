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
		formFields: [FormField!]!
	}

	type FormField {
		label: String
		labelPosition: LABEL_POSITIONS
		formElement: FORM_ELEMENTS
		inputType: INPUT_TYPES
		attributes: [Attribute!]!
	}

	type Attribute {
		attr: ATTRIBUTES
		value: String
	}

	type Query {
		me: User
		getForms(createdBy: ID!): [Form!]!
		getForm(formId: ID!, createdBy: ID): Form!
	}

	input FormInput {
		title: String!
		action: String
		method: String
	}

	input FormFieldInput {
		label: String
		labelPosition: LABEL_POSITIONS
		formElement: FORM_ELEMENTS
		inputType: INPUT_TYPES
	}

	type Mutation {
		createForm(input: FormInput!): Form
		deleteForm(formId: ID!): Form
		updateForm(_id: ID!, input: FormInput): Form
		addFormField(formId: ID!, input: FormFieldInput): Form
		addFormFieldAttribute(formId: ID!, attr: ATTRIBUTES, value: String): Form
	}

	enum FORM_ELEMENTS {
		INPUT
		SELECT
		TEXT_AREA
		BUTTON
		LABEL
		OPTION
	}

	enum ATTRIBUTES {
		STYLE
		READ_ONLY
		PLACEHOLDER
		VALUE
		NAME
		DISABLED
		SIZE
		MIN
		MAX
		REQUIRED
	}

	enum INPUT_TYPES {
		BUTTON
		CHECKBOX
		COLOR
		DATE
		DATETIME_LOCAL
		EMAIL
		FILE
		HIDDEN
		IMAGE
		MONTH
		NUMBER
		PASSWORD
		RADIO
		RANGE
		RESET
		SEARCH
		SUBMIT
		TEL
		TEXT
		TIME
		URL
		WEEK
	}

	enum LABEL_POSITIONS {
		BOTTOM
		INLINE
		TOP
	}
`
