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

export const EDIT_FIELD_MUTATION = `
  mutation($formId: ID!, $idx: Int,
    $type: FIELD_TYPES,
    $label: String, 
    $labelPosition: LABEL_POSITIONS, 
    $formElement: FORM_ELEMENTS, 
    $inputType: INPUT_TYPES) {
    editFormField(formId: $formId, idx: $idx, input: {
      type: $type,
      label: $label,
      labelPosition: $labelPosition,
      formElement: $formElement,
      inputType: $inputType
    }) {
      formFields {
        type
        label
        labelPosition
        formElement
        inputType
      }
    }
  }`

export const ADD_FIELD_MUTATION = `
  mutation($formId: ID!, 
    $type: FIELD_TYPES,
    $label: String, 
    $labelPosition: LABEL_POSITIONS, 
    $formElement: FORM_ELEMENTS, 
    $inputType: INPUT_TYPES) {
    addFormField(formId: $formId, input: {
      type: $type,
      label: $label,
      labelPosition: $labelPosition,
      formElement: $formElement,
      inputType: $inputType
    }) {
      formFields {
        type
        label
        labelPosition
        formElement
        inputType
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

// export const CREATE_COMMENT_MUTATION = `
// mutation($pinId: ID!, $text: String!) {
//   createComment(pinId: $pinId, text: $text) {
//     _id
//     createdAt
//     title
//     content
//     image
//     latitude
//     longitude
//     author {
//       _id
//       name
//     }
//     comments {
//       text
//       createdAt
//       author {
//         name
//         picture
//       }
//     }

//   }
// }`
