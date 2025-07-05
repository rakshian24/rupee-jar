import gql from "graphql-tag";

export const REGISTER_USER_MUTATION = gql`
  mutation Mutation($input: RegisterInput) {
    registerUser(input: $input) {
      token
      user {
        _id
        username
        email
        accounts {
          _id
          accountNumber
          bankName
          balance
          userId
        }
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
        accounts {
          _id
          accountNumber
          bankName
          balance
          userId
        }
      }
    }
  }
`;

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation Mutation($input: AccountInput) {
    createAccount(input: $input) {
      _id
      accountNumber
      bankName
      balance
      userId
    }
  }
`;
