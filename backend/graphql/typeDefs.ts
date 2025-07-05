import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  scalar IntOrString

  enum TransactionType {
    INCOME
    EXPENSE
  }

  enum PaymentMethod {
    UPI
    CASH
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
    description: String
    budgetLimit: Float!
  }

  type CategoryWithBudget {
    category: Category!
    budget: Budget!
  }

  type Budget {
    _id: ID!
    userId: ID!
    categoryId: ID!
    limit: Float!
  }

  type Transaction {
    _id: ID!
    userId: ID!
    type: TransactionType!
    paymentMethod: PaymentMethod!
    amount: Float!
    categoryId: ID!
    accountId: ID!
    description: String!
    receiptImageUrl: String!
    date: DateTime!
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
    balance: String!
    userId: ID!
  }

  input CategoryInput {
    name: String!
    icon: String
    color: String
    type: TransactionType!
    description: String
  }

  input BudgetInput {
    categoryId: ID!
    limit: Float!
  }

  input CategoryWithBudgetInput {
    name: String!
    icon: String
    color: String
    type: TransactionType!
    budgetLimit: Float!
    description: String
  }

  input TransactionInput {
    type: TransactionType!
    paymentMethod: PaymentMethod!
    amount: Float!
    categoryId: ID!
    accountId: ID!
    description: String!
    receiptImageUrl: String
    date: String!
  }

  type Query {
    me: User

    getAccount(id: ID!): Account
    getAllAccounts: [Account]

    getCategoryByType(id: ID!, type: TransactionType!): Category
    getAllCategoriesByType(type: TransactionType!): [Category]
    getAllCategoriesByTypeWithBudgetDetails(type: TransactionType!): [Category]

    getTransaction(id: ID!): Transaction
    getAllTransactions: [Transaction]

    getBudgetByCategoryId(categoryId: ID!): Budget
  }

  type Mutation {
    registerUser(input: RegisterInput): AuthResponse
    loginUser(input: LoginInput): AuthResponse

    createAccount(input: AccountInput): Account

    createCategory(input: CategoryInput): Category

    createCategoryWithBudget(
      input: CategoryWithBudgetInput!
    ): CategoryWithBudget!

    createBudget(input: BudgetInput): Budget

    createTransaction(input: TransactionInput): Transaction
  }
`;
