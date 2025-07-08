import gql from "graphql-tag";

export const GET_ME = gql`
  query {
    me {
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
`;

export const GET_MY_TODOS = gql`
  query {
    myTodos {
      _id
      title
      description
      isCompleted
      createdAt
    }
  }
`;

export const GET_ALL_TODOS = gql`
  query getAllTodos {
    _id
    title
    description
    isCompleted
    createdAt
    createdBy {
      _id
      username
    }
  }
`;

export const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      _id
      username
      email
    }
  }
`;

export const GET_ALL_INCOME_CATEGORIES = gql`
  query GetAllIncomeCategories {
    getAllIncomeCategories {
      _id
      name
      icon
      color
      type
      userId
      description
    }
  }
`;

export const GET_ALL_EXPENSE_CATEGORIES = gql`
  query GetAllExpenseCategories {
    getAllExpenseCategories {
      budget {
        _id
        userId
        categoryId
        limit
      }
      category {
        _id
        name
        icon
        color
        type
        userId
        description
      }
      spent
    }
  }
`;

export const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions {
    getAllTransactions {
      _id
      userId
      type
      paymentMethod
      amount
      description
      receiptImageUrl
      date
      category {
        _id
        name
        icon
        color
        type
        userId
        description
      }
      account {
        _id
        accountNumber
        bankName
        balance
        userId
      }
    }
  }
`;
