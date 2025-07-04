import { ApolloError } from "apollo-server-errors";
import User, { IUser } from "../../models/User";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import { generateToken } from "../../utils";
import Account, { IAccount } from "../../models/Account";
import { Document } from "mongoose";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface IUserWithAccounts extends Omit<IUser, keyof Document> {
  accounts: IAccount[];
}

interface LoginInput {
  email: string;
  password: string;
}

const resolvers = {
  Mutation: {
    async registerUser(
      _: unknown,
      {
        input: { username, email, password, confirmPassword },
      }: { input: RegisterInput },
      ctx: any
    ): Promise<{ user: IUserWithAccounts; token: string }> {
      const userExists = await User.findOne({ email });

      if (userExists) {
        throw new ApolloError(
          `A user is already registered with the email ${email}`,
          "USER_ALREADY_EXISTS"
        );
      }

      const newUser = new User({
        username,
        email,
        password,
        confirmPassword,
      });

      const token = await generateToken(newUser);
      const savedUser = (await newUser.save()) as IUser;

      // Get associated accounts
      const accounts = await Account.find({ userId: savedUser._id });

      const userWithAccountDetails: IUserWithAccounts = {
        ...(savedUser.toObject() as IUser),
        accounts,
      };

      const response = {
        user: userWithAccountDetails,
        token,
      };

      return response;
    },

    async loginUser(
      _: unknown,
      { input: { email, password } }: { input: LoginInput },
      ctx: any
    ): Promise<{ user: IUserWithAccounts; token: string }> {
      const user = (await User.findOne({ email })) as IUser;

      if (!user || !(await user.matchPassword(password))) {
        throw new ApolloError(
          "Invalid email or password",
          "INVALID_CREDENTIALS"
        );
      }

      const token = await generateToken(user);

      // Get associated accounts
      const accounts = await Account.find({ userId: user._id });

      const userWithAccountDetails: IUserWithAccounts = {
        ...(user.toObject() as IUser),
        accounts,
      };

      const response = {
        user: userWithAccountDetails,
        token,
      };

      return response;
    },
  },
  Query: {
    async me(_: unknown, args: {}, ctx: any): Promise<IUser | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const user = (await User.findById(userId)) as IUser;

      return user;
    },
  },
};

export default resolvers;
