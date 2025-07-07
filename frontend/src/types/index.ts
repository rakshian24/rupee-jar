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
