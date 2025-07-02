import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  scalar IntOrString

  type User {
    _id: ID!
    username: String
    email: String
  }

  type AuthResponse {
    user: User
    token: String
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Todo {
    _id: ID!
    title: String!
    description: String!
    isCompleted: Boolean!
    createdBy: User!
    createdAt: DateTime
  }

  input TodoInput {
    title: String!
    description: String!
  }

  type Query {
    me: User
    myTodos: [Todo]
    getAllTodos: [Todo]
    user(id: ID!): User
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): AuthResponse
    loginUser(loginInput: LoginInput): AuthResponse
    createTodo(todoInput: TodoInput): Todo
  }
`;
