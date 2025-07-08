export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum PaymentMethod {
  UPI = "UPI",
  CASH = "CASH",
}

export interface Account {
  _id: string;
  userId: string;
  accountNumber: string;
  bankName: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeCategory {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  userId: string;
  description: string;
}

export interface Budget {
  _id: string;
  userId: string;
  categoryId: string;
  limit: number;
}

export interface ExpenseCategory {
  category: IncomeCategory;
  budget: Budget;
  spent: number;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  amount: number;
  category: IncomeCategory;
  account: Account;
  description: string;
  receiptImageUrl: string;
  date: string;
}
