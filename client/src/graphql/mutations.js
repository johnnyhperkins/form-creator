import gql from 'graphql-tag'

export const CREATE_FORM_MUTATION = gql`
	mutation($title: String!) {
		createForm(input: { title: $title }) {
			_id
			title
			createdBy {
				_id
				name
			}
		}
	}
`

export const UPDATE_FORM_MUTATION = `
	mutation($_id: ID!, $title: String, $formFields: [ID!]) {
		updateForm(_id: $_id, input: { title: $title, formFields: $formFields }) {
			_id
			title
			url
			formFields {
				_id
				type
				label
			}
			createdBy {
				_id
				name
			}
		}
	}
`

export const DELETE_FORM_MUTATION = gql`
	mutation($formId: ID!) {
		deleteForm(formId: $formId) {
			_id
		}
	}
`

export const DELETE_FIELD_MUTATION = `
	mutation($_id: ID!, $formId: ID!) {
		deleteField(_id: $_id, formId: $formId) {
			_id
		}
	}
`

export const CREATE_FIELD_MUTATION = gql`
	mutation($formId: ID!, $type: String, $label: String) {
		createFormField(formId: $formId, input: { type: $type, label: $label }) {
			_id
			type
			label
			form {
				_id
			}
		}
	}
`

export const UPDATE_FIELD_MUTATION = `
	mutation($_id: ID!, $type: String, $label: String) {
		updateFormField(_id: $_id, input: { type: $type, label: $label }) {
			type
			label
		}
	}
`

export const SUBMIT_FORM_MUTATION = `
	mutation($input: [FormFieldResponseInput]) {
		submitForm(input: $input) {
			_id
			value
		}
	}
`
