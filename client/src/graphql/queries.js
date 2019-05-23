import gql from 'graphql-tag'

export const ME_QUERY = `query{
  me {
    name
    _id
    email
    picture
  }
}`

export const GET_FORMS_QUERY = gql`
	query {
		getForms {
			_id
			title
		}
	}
`

export const GET_RESPONSES_QUERY = `query($formId: ID!) {
  getResponses(formId: $formId) {
    label
    responses {
      _id
      value
      user
    }
    
  }
}`

export const GET_FORM_QUERY = `
	query($_id: ID!) {
		getForm(_id: $_id) {
			_id
			title
			url
			createdBy {
				_id
			}
			formFields {
				_id
				type
				label
			}
		}
	}
`

export const GET_FORM_DATA = `
	query($_id: ID!) {
		getForm(_id: $_id) {
			title
			formFields {
				_id
				type
				label
			}
		}
	}
`
