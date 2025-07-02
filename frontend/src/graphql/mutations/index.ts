import gql from "graphql-tag";

export const REGISTER_USER_MUTATION = gql`
  mutation Mutation($registerInput: RegisterInput) {
    registerUser(registerInput: $registerInput) {
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
  mutation Mutation($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      token
      user {
        _id
        email
        username
      }
    }
  }
`;

export const CREATE_TODO = gql`
  mutation Mutation($todoInput: TodoInput) {
    createTodo(todoInput: $todoInput) {
      _id
      title
      description
      isCompleted
    }
  }
`;
