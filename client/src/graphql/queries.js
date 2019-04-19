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
