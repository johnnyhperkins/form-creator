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

export const GET_FORM_QUERY = `query($_id: ID!) {
  getForm(_id: $_id) {
    _id
    title
    formFields {
      _id
      type
      label
    }
  }
}`
