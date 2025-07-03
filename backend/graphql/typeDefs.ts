import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  scalar IntOrString

  enum TransactionType {
    INCOME
    EXPENSE
  }

  type User {
    _id: ID!
    username: String
    email: String
  }

  type AuthResponse {
    user: User
    token: String
  }

  type Account {
    accountNumber: Int!
    bankName: String!
    balance: Float!
    user: User!
  }

  type Category {
    name: String!
    icon: String
    color: String
    type: TransactionType!
    user: User!
  }

  type Budget {
    user: User!
    category: Category!
    month: Int!
    year: Int!
    limit: Float!
  }

  type Transaction {
    user: User!
    type: TransactionType!
    amount: Float!
    category: Category!
    account: Account!
    description: String!
    receiptImageUrl: String!
    date: String!
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

  input AccountInput {
    user: ID!
    accountNumber: Int!
    bankName: String!
    balance: Float!
  }

  input CategoryInput {
    user: ID!
    name: String!
    icon: String
    color: String
    type: TransactionType!
  }

  input BudgetInput {
    user: ID!
    category: ID!
    month: Int!
    year: Int!
    limit: Float!
  }

  input TransactionInput {
    user: ID!
    type: TransactionType!
    amount: Float!
    category: ID!
    account: ID!
    description: String!
    receiptImageUrl: String
    date: String!
  }

  type Query {
    me: User

    getAccount(id: ID!): Account
    getAccounts(ids: [ID!]!): [Account]

    getTransaction(id: ID!): Transaction
    getTransactions(ids: [ID!]!): [Transaction]

    getCategory(id: ID!): Category
    getCategories(ids: [ID!]!): [Category]

    getBudget(id: ID!): Budget
    getBudgets(ids: [ID!]!): [Budget]
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): AuthResponse
    loginUser(loginInput: LoginInput): AuthResponse
    createAccount(input: AccountInput): Account
    createCategory(input: CategoryInput): Category
    createBudget(input: BudgetInput): Budget
    createTransaction(input: TransactionInput): Transaction
  }
`;
