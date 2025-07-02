import mongoose, { Types } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description: string;
  createdBy: Types.ObjectId;
  isCompleted?: boolean;
}

const Schema = mongoose.Schema;

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Todo title is required!"],
      maxLength: [500, "Todo title is exceeding max limit(500)"],
    },
    description: {
      type: String,
      required: [true, "Todo description is required!"],
      maxLength: [16000, "Todo description is exceeding max limit(16000)"],
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model("Todo", TodoSchema);

export default Todo;
