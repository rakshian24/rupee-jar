import { ApolloError } from "apollo-server-errors";
import User, { IUser } from "../../models/User";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import { generateToken } from "../../utils";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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
        registerInput: { username, email, password, confirmPassword },
      }: { registerInput: RegisterInput },
      ctx: any
    ): Promise<{ user: IUser; token: string }> {
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
      const res = (await newUser.save()) as IUser;
      const response = { user: res, token };

      return response;
    },

    async loginUser(
      _: unknown,
      { loginInput: { email, password } }: { loginInput: LoginInput },
      ctx: any
    ): Promise<{ user: IUser; token: string }> {
      const user = (await User.findOne({ email })) as IUser;

      if (user && (await user.matchPassword(password))) {
        const token = await generateToken(user);
        const response = { user, token };

        return response;
      } else {
        throw new ApolloError(
          `Invalid email or password`,
          "INVALID_EMAIL_OR_PASSWORD"
        );
      }
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

    async user(
      _: unknown,
      { id }: { id: string },
      ctx: any
    ): Promise<IUser | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const user = (await User.findById(id)) as IUser;

      return user;
    },
  },
};

export default resolvers;
