import mongoose, { Document, Schema, Types } from "mongoose";
import { TransactionType } from "./Transaction";

export interface ICategory extends Document {
  user: Types.ObjectId;
  name: string;
  icon?: string;
  color?: string;
  type: TransactionType;
}

const categorySchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: [true, "Category name is required!"],
      maxLength: [16000, "Category name is exceeding max limit(16000)"],
    },
    icon: { type: String, default: "" },
    color: { type: String, default: "" },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
