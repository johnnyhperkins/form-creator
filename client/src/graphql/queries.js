export const ME_QUERY = `query{
  me {
    name
    _id
    email
    picture
  }
}`

export const GET_FORMS_QUERY = `query {
  getForms {
    _id
    title
    createdBy {
      _id
      name
    }
  }
}`

export const GET_RESPONSES_QUERY = `query($formId: ID!) {
  getResponses(formId: $formId) {
    label
    responses {
      _id
      value
    }
    
  }
}`

export const GET_FORM_QUERY = `query($_id: ID!) {
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
}`
