export const CREATE_FORM_MUTATION = `
  mutation($title: String!, $action: String, $method: String) {
    createForm(input: {
      title: $title,
      action: $action,
      method: $method,
    }) {
      _id
      title
      action
      method
      createdBy {
        _id
        name
      }
    }
  }
`

export const DELETE_FIELD_MUTATION = `
  mutation($_id: ID!, $formId: ID!) {
    deleteField(_id: $_id, formId: $formId) {
      _id
    }
  }`

export const UPDATE_FORM_MUTATION = `
  mutation($_id: ID!, $title: String!, $action: String, $method: String) {
    updateForm(_id: $_id, input: {
      title: $title,
      action: $action,
      method: $method,
    }) {
      _id
      title
      action
      method
      createdBy {
        _id
        name
      }
    }
  }
`

export const UPDATE_FORMFIELD_ORDER = `
  mutation($_id: ID!, $formFields: [ID!]!) {
    updateFormFieldOrder(_id: $_id, formFields: $formFields) {
      _id
    }
  }
`

export const EDIT_FIELD_MUTATION = `
  mutation($_id: ID!,
    $type: String,
    $label: String) {
    editFormField(_id: $_id, input: {
      type: $type,
      label: $label
    }) {
      type
      label
    }
  }`

export const ADD_FIELD_MUTATION = `
  mutation($formId: ID!, 
    $type: String,
    $label: String) {
    addFormField(formId: $formId, input: {
      type: $type,
      label: $label
    }) {
      _id
      type
      label
      form {
        _id
      }
    }
  }
`

export const DELETE_FORM_MUTATION = `
mutation($formId: ID!) {
  deleteForm(formId: $formId) {
    _id
  }
}`
