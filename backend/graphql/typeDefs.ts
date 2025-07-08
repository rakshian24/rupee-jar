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

  type IncomeCategory {
    _id: ID!
    name: String!
    icon: String
    color: String
    type: TransactionType!
    userId: ID!
    description: String
  }

  type ExpenseCategory {
    category: IncomeCategory!
    budget: Budget!
    spent: Float!
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
    category: IncomeCategory
    account: Account
    description: String!
    receiptImageUrl: String
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

  input IncomeCategoryInput {
    name: String!
    icon: String
    color: String
    description: String
  }

  input ExpenseCategoryInput {
    name: String!
    icon: String
    color: String
    description: String
    budgetLimit: String
  }

  input BudgetInput {
    categoryId: ID!
    limit: Float!
  }

  input TransactionInput {
    type: TransactionType!
    paymentMethod: PaymentMethod!
    amount: String!
    categoryId: ID!
    accountId: ID!
    description: String!
    receiptImageUrl: String
    date: String!
    userId: ID!
  }

  type Query {
    me: User

    getAccount(id: ID!): Account
    getAllAccounts: [Account]

    getIncomeCategory(id: ID!): IncomeCategory
    getAllIncomeCategories: [IncomeCategory]

    getExpenseCategory(id: ID!): ExpenseCategory
    getAllExpenseCategories: [ExpenseCategory]

    getTransaction(id: ID!): Transaction
    getAllTransactions: [Transaction]

    getBudgetByCategoryId(categoryId: ID!): Budget
  }

  type Mutation {
    registerUser(input: RegisterInput): AuthResponse
    loginUser(input: LoginInput): AuthResponse

    createAccount(input: AccountInput): Account

    createIncomeCategory(input: IncomeCategoryInput): IncomeCategory
    createExpenseCategory(input: ExpenseCategoryInput): ExpenseCategory

    createBudget(input: BudgetInput): Budget

    createTransaction(input: TransactionInput): Transaction
  }
`;
