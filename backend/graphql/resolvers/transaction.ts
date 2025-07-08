import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Transaction, {
  TransactionType,
  ITransaction,
  PaymentMethod,
} from "../../models/Transaction";
import { Types } from "mongoose";
import Category from "../../models/Category";
import Account from "../../models/Account";

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

      const account = await Account.findOne({ _id: accountId, userId });

      if (!account) {
        throw new ApolloError("Account not found", "ACCOUNT_NOT_FOUND");
      }

      // Update balance
      const numericAmount = Number(amount);
      if (type === "INCOME") {
        account.balance += numericAmount;
      } else if (type === "EXPENSE") {
        if (numericAmount > account.balance) {
          throw new ApolloError("Insufficient balance", "INSUFFICIENT_BALANCE");
        }
        account.balance -= numericAmount;
      }

      // Save updated account first
      await account.save();

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

      const savedTransaction = await newTransaction.save();

      const populated = await Transaction.findById(savedTransaction._id)
        .populate("categoryId")
        .populate("accountId")
        .lean();

      return {
        ...populated,
        category: populated?.categoryId,
        account: populated?.accountId,
        categoryId: undefined,
        accountId: undefined,
      } as unknown as ITransaction;
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

      const transaction = await Transaction.findOne({
        _id: args.id,
        userId,
      })
        .populate("categoryId")
        .populate("accountId")
        .lean();

      if (!transaction) {
        throw new ApolloError("Transaction not found", "NOT_FOUND");
      }

      return {
        ...transaction,
        category: transaction.categoryId,
        account: transaction.accountId,
        categoryId: undefined,
        accountId: undefined,
      } as unknown as ITransaction;
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
        .populate("accountId")
        .lean();

      const renamedTransactions = transactions.map((t) => {
        return {
          ...t,
          category: t.categoryId,
          account: t.accountId,
          categoryId: undefined,
          accountId: undefined,
        };
      });

      return renamedTransactions as unknown as ITransaction[];
    },
  },
};

export default resolvers;
