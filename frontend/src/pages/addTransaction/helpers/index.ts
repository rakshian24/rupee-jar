import { PaymentMethod, TransactionType } from "../../../types";

export interface IAddTransactionFormValueTypes {
  type: TransactionType;
  paymentMethod: PaymentMethod;
  amount: number;
  categoryId: string;
  accountId: string;
  description: string;
  receiptImageUrl?: string;
  date: string;
}

export const InitialAddTrasactionFormValues: IAddTransactionFormValueTypes = {
  type: TransactionType.EXPENSE,
  paymentMethod: PaymentMethod.UPI,
  amount: 0,
  categoryId: "",
  accountId: "",
  description: "",
  receiptImageUrl: "",
  date: "",
};
