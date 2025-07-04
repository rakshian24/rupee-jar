import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBudget extends Document {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  limit: number;
}

const budgetSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    limit: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model<IBudget>("Budget", budgetSchema);

export default Budget;
