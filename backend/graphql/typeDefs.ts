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
    accounts: [Account]
  }

  type AuthResponse {
    user: User
    token: String
  }

  type Account {
    _id: ID!
    accountNumber: String!
    bankName: String!
    balance: Float!
    userId: ID!
  }

  type Category {
    _id: ID!
    name: String!
    icon: String
    color: String
    type: TransactionType!
    userId: ID!
  }

  type Budget {
    _id: ID!
    userId: ID!
    categoryId: ID!
    month: Int!
    year: Int!
    limit: Float!
  }

  type Transaction {
    _id: ID!
    userId: ID!
    type: TransactionType!
    amount: Float!
    categoryId: ID!
    accountId: ID!
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
    accountNumber: String!
    bankName: String!
    balance: Float!
  }

  input CategoryInput {
    name: String!
    icon: String
    color: String
    type: TransactionType!
  }

  input BudgetInput {
    category: ID!
    month: Int!
    year: Int!
    limit: Float!
  }

  input TransactionInput {
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
    getAllAccounts: [Account]

    getTransaction(id: ID!): Transaction
    getTransactions(ids: [ID!]!): [Transaction]

    getCategory(id: ID!): Category
    getCategories(ids: [ID!]!): [Category]

    getBudget(id: ID!): Budget
    getBudgets(ids: [ID!]!): [Budget]
  }

  type Mutation {
    registerUser(input: RegisterInput): AuthResponse
    loginUser(input: LoginInput): AuthResponse
    createAccount(input: AccountInput): Account
    createCategory(input: CategoryInput): Category
    createBudget(input: BudgetInput): Budget
    createTransaction(input: TransactionInput): Transaction
  }
`;
