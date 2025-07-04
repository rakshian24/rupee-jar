import mongoose, { Document, Schema, Types } from "mongoose";

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum PaymentMethod {
  UPI = "UPI",
  CASH = "CASH",
}

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  amount: string;
  categoryId: Types.ObjectId;
  accountId: Types.ObjectId;
  description: string;
  receiptImageUrl?: string;
  date?: string;
}

const transactionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    amount: { type: Number, required: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    accountId: { type: Types.ObjectId, ref: "Account", required: true },
    description: {
      type: String,
      required: [true, "Transaction description is required!"],
      maxLength: [
        16000,
        "Transaction description is exceeding max limit(16000)",
      ],
    },
    receiptImageUrl: {
      type: String,
      default: "",
    },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transaction;
