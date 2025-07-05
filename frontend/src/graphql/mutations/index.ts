import gql from "graphql-tag";

export const REGISTER_USER_MUTATION = gql`
  mutation Mutation($input: RegisterInput) {
    registerUser(input: $input) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Mutation($input: LoginInput) {
    loginUser(input: $input) {
      token
      user {
        _id
        email
        username
      }
    }
  }
`;
