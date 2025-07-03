import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAccount extends Document {
  userId: Types.ObjectId;
  accountNumber: string;
  bankName: string;
  balance: number;
}

const accountSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    accountNumber: {
      type: String,
      required: [true, "Account number is required!"],
    },
    bankName: {
      type: String,
      required: [true, "Bank name is required!"],
    },
    balance: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Make accountNumber unique per user
accountSchema.index({ userId: 1, accountNumber: 1 }, { unique: true });

const Account = mongoose.model<IAccount>("Account", accountSchema);

export default Account;
