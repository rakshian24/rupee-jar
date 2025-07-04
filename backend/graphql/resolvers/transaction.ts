import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Transaction, {
  TransactionType,
  ITransaction,
  PaymentMethod,
} from "../../models/Transaction";
import { Types } from "mongoose";
import Category from "../../models/Category";

interface TransactionInput {
  type: TransactionType;
  paymentMethod: PaymentMethod;
  amount: number;
  categoryId: Types.ObjectId;
  accountId: Types.ObjectId;
  description: string;
  receiptImageUrl?: string;
  date: string;
}

const resolvers = {
  Mutation: {
    async createTransaction(
      _: unknown,
      {
        input: {
          type,
          amount,
          categoryId,
          accountId,
          description,
          receiptImageUrl,
          date,
          paymentMethod,
        },
      }: { input: TransactionInput },
      ctx: any
    ): Promise<ITransaction> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const category = await Category.findOne({ _id: categoryId, userId });

      if (!category) {
        throw new ApolloError("Category not found", "CATEGORY_NOT_FOUND");
      }

      if (category.type !== type) {
        throw new ApolloError(
          `Category type mismatch. Expected: ${type}, Found: ${category.type}`,
          "CATEGORY_TYPE_MISMATCH"
        );
      }

      const newTransaction = new Transaction({
        type,
        amount,
        categoryId,
        accountId,
        description,
        receiptImageUrl,
        date,
        paymentMethod,
        userId,
      });

      const res = (await newTransaction.save()) as ITransaction;
      return res;
    },
  },
  Query: {
    async getTransaction(
      _: unknown,
      args: { id: string },
      ctx: any
    ): Promise<ITransaction | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const transaction = (await Transaction.findOne({
        id: args.id,
        userId,
      })) as ITransaction;

      if (!transaction) {
        throw new ApolloError("Account not found", "NOT_FOUND");
      }

      return transaction;
    },

    async getAllTransactions(
      _: unknown,
      args: {},
      ctx: any
    ): Promise<ITransaction[] | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const transactions = await Transaction.find({ userId })
        .sort({ date: -1 })
        .populate("categoryId")
        .populate("accountId");

      const transactionsAsObjects = transactions.map((transaction) =>
        transaction.toObject()
      ) as ITransaction[];

      return transactionsAsObjects;
    },
  },
};

export default resolvers;
