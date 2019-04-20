export const ME_QUERY = `query{
  me {
    name
    _id
    email
    picture
  }
}`

export const GET_FORMS_QUERY = `query($createdBy: ID!) {
  getForms(createdBy: $createdBy) {
    _id
    title
    createdBy {
      _id
      name
    }
  }
}`

export const GET_FORM_QUERY = `query($formId: ID!, $createdBy: ID) {
  getForm(formId: $formId, createdBy: $createdBy) {
    _id
    title
    action
    method
    formFields {
      label
      labelPosition
      formElement
      inputType
      attributes {
        attr
        value
      }
    }
    createdBy {
      _id
      name
    }
  }
}`
