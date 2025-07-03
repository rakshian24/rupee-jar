import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Account, { IAccount } from "../../models/Account";

interface AccountInput {
  accountNumber: string;
  bankName: string;
  balance: number;
}

const resolvers = {
  Mutation: {
    async createAccount(
      _: unknown,
      { input: { accountNumber, bankName, balance } }: { input: AccountInput },
      ctx: any
    ): Promise<IAccount> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const accountExists = await Account.findOne({ accountNumber, userId });

      if (accountExists) {
        throw new ApolloError(
          `You already have an account with account number ${accountNumber}`,
          "ACCOUNT_ALREADY_EXISTS"
        );
      }

      const newAccount = new Account({
        accountNumber,
        bankName,
        balance,
        userId,
      });

      const res = (await newAccount.save()) as IAccount;
      return res;
    },
  },
  Query: {
    async getAccount(
      _: unknown,
      args: { id: string },
      ctx: any
    ): Promise<IAccount | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const account = (await Account.findOne({
        id: args.id,
        userId,
      })) as IAccount;

      if (!account) {
        throw new ApolloError("Account not found", "NOT_FOUND");
      }

      return account;
    },

    async getAllAccounts(
      _: unknown,
      args: {},
      ctx: any
    ): Promise<IAccount[] | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const accounts = await Account.find({ userId });

      const accountsAsObjects = accounts.map((account) =>
        account.toObject()
      ) as IAccount[];

      return accountsAsObjects;
    },
  },
};

export default resolvers;
