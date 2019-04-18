export const CREATE_FORM_MUTATION = `
  mutation($title: String!) {
    createForm(input: {
      title: $title,
    }) {
      _id
      title
      createdBy {
        _id
        name
        email
        picture
      }
    }
  }
`

// export const DELETE_PIN_MUTATION = `
// mutation($pinId: ID!) {
//   deletePin(pinId: $pinId) {
//     _id
//   }
// }`

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
