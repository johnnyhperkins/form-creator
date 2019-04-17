export const ME_QUERY = `query{
  me {
    name
    _id
    email
    picture
  }
}`

// export const GET_PINS_QUERY = `
// {
//   getPins {
//     _id
//     createdAt
//     title
//     image
//     content
//     latitude
//     longitude
//     author {
//       _id
//       name
//       email
//       picture
//     }
//     comments {
//       text
//       createdAt
//       author {
//         _id
//         name
//         picture
//       }
//     }
//   }
// }`
