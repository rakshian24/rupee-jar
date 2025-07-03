import mongoose, { Document, Schema, Types } from "mongoose";

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export interface ITransaction extends Document {
  user: Types.ObjectId;
  type: TransactionType;
  amount: string;
  category: Types.ObjectId;
  account: Types.ObjectId;
  description: string;
  receiptImageUrl?: string;
  date?: Date;
}

const transactionSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: { type: Number, required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    account: { type: Types.ObjectId, ref: "Account", required: true },
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
