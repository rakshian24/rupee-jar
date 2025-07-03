import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAccount extends Document {
  user: Types.ObjectId;
  accountNumber: string;
  bankName: string;
  balance?: number;
}

const accountSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    accountNumber: {
      type: String,
      required: [true, "Account number is required!"],
    },
    bankName: {
      type: String,
      required: [true, "Bank name is required!"],
    },
    balance: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model<IAccount>("Account", accountSchema);

export default Account;
