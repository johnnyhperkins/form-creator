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
		title: String!
		createdBy: User!
		formFields: [FormField!]!
		action: String
		method: String
	}

	type FormField {
		_id: ID!
		label: String
		labelPosition: LABEL_POSITIONS
		formElement: FORM_ELEMENTS
		inputType: INPUT_TYPES
		form: Form!
		attributes: [Attribute!]!
	}

	type Attribute {
		_id: ID!
		formField: FormField!
		attr: ATTRIBUTES
		value: String
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

	type Query {
		me: User
		getForms(createdBy: ID!): [Form!]!
	}

	input CreateFormInput {
		title: String!
	}

	type Mutation {
		createForm(input: CreateFormInput!): Form
		deleteForm(formId: ID!): Form
	}
`
