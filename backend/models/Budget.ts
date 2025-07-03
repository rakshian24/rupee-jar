import mongoose, { Document, Schema, Types } from "mongoose";
import { TransactionType } from "./Transaction";

export interface IBudget extends Document {
  user: Types.ObjectId;
  category: Types.ObjectId;
  month: number;
  year: number;
  limit: number;
}

const budgetSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    limit: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model<IBudget>("Budget", budgetSchema);

export default Budget;
