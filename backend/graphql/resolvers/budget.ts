import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Budget, { IBudget } from "../../models/Budget";
import { Types } from "mongoose";

interface BudgetInput {
  categoryId: Types.ObjectId;
  limit: number;
}

const resolvers = {
  Mutation: {
    async createBudget(
      _: unknown,
      { input: { categoryId, limit } }: { input: BudgetInput },
      ctx: any
    ): Promise<IBudget> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const newBudget = new Budget({
        categoryId,
        limit,
      });

      const res = (await newBudget.save()) as IBudget;
      return res;
    },
  },
  Query: {
    async getBudgetByCategoryId(
      _: unknown,
      args: { categoryId: string },
      ctx: any
    ): Promise<IBudget | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const budget = (await Budget.findOne({
        categoryId: args.categoryId,
        userId,
      })) as IBudget;

      if (!budget) {
        throw new ApolloError("Budget not found", "NOT_FOUND");
      }

      return budget;
    },
  },
};

export default resolvers;
