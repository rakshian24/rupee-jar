import mongoose, { Document, Schema, Types } from "mongoose";
import { TransactionType } from "./Transaction";

export interface ICategory extends Document {
  userId: Types.ObjectId;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  type: TransactionType;
}

const categorySchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: [true, "Category name is required!"],
      maxLength: [16000, "Category name is exceeding max limit(16000)"],
      trim: true,
    },
    icon: { type: String, default: "" },
    color: { type: String, default: "" },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    description: {
      type: String,
      default: "",
      maxLength: [
        16000,
        "Transaction description is exceeding max limit(16000)",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Enforce unique category name per user and type
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
