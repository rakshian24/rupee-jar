import { ApolloError } from "apollo-server-errors";
import moment from "moment";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import { TransactionType } from "../../models/Transaction";
import Category, { ICategory } from "../../models/Category";
import mongoose from "mongoose";
import Budget, { IBudget } from "../../models/Budget";

interface CategoryInput {
  name: string;
  icon: string;
  description: string;
  color: number;
  type: TransactionType;
}

interface CategoryWithBudgetInput {
  name: string;
  icon?: string;
  color?: string;
  type: string;
  budgetLimit: number;
  description?: string;
}

const resolvers = {
  Mutation: {
    async createCategory(
      _: unknown,
      {
        input: { name, icon, color, type, description },
      }: { input: CategoryInput },
      ctx: any
    ): Promise<ICategory> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const categoryExists = await Category.findOne({ name, userId });

      if (categoryExists) {
        throw new ApolloError(
          `You already have a category by name - ${name}`,
          "CATEGORY_ALREADY_EXISTS"
        );
      }

      const newCategory = new Category({
        name,
        icon,
        color,
        type,
        description,
        userId,
      });

      const res = (await newCategory.save()) as ICategory;
      return res;
    },

    async createCategoryWithBudget(
      _: unknown,
      { input }: { input: CategoryWithBudgetInput },
      ctx: any
    ): Promise<{ category: ICategory; budget: IBudget | null }> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const { name, icon, color, type, budgetLimit, description } = input;

      const categoryExists = await Category.findOne({ name, userId });

      if (categoryExists) {
        throw new ApolloError(
          `You already have a category by name - ${name}`,
          "CATEGORY_ALREADY_EXISTS"
        );
      }

      const newCategory = new Category({
        userId,
        name,
        icon,
        color,
        type,
        description: description
          ? description
          : `Created the ${name} category with a budget of ₹${budgetLimit}.`,
      });

      const savedCategory = await newCategory.save();

      let savedBudget: IBudget | null = null;
      if (budgetLimit && budgetLimit > 0) {
        const budget = new Budget({
          userId,
          categoryId: savedCategory._id,
          limit: budgetLimit,
        });
        savedBudget = await budget.save();
      }

      return {
        category: savedCategory,
        budget: savedBudget,
      };
    },
  },
  Query: {
    async getCategoryByType(
      _: unknown,
      args: { id: string; type: TransactionType },
      ctx: any
    ): Promise<ICategory | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const category = (await Category.findOne({
        id: args.id,
        userId,
        type: args.type,
      })) as ICategory;

      if (!category) {
        throw new ApolloError("Category not found", "NOT_FOUND");
      }

      return category;
    },

    async getAllCategoriesByType(
      _: unknown,
      args: { type: TransactionType },
      ctx: any
    ): Promise<ICategory[] | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const categories = await Category.find({ userId, type: args.type });

      const categoriesAsObjects = categories.map((category) =>
        category.toObject()
      ) as ICategory[];

      return categoriesAsObjects;
    },

    async getAllCategoriesByTypeWithBudgetDetails(
      _: unknown,
      args: { type: TransactionType },
      ctx: any
    ): Promise<ICategory[] | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const categoriesWithBudgets = await Category.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            type: args.type,
          },
        },
        {
          $lookup: {
            from: "budgets", // name of the Budget collection (auto-pluralized)
            localField: "_id",
            foreignField: "categoryId",
            as: "budget",
          },
        },
        {
          $unwind: {
            path: "$budget",
            preserveNullAndEmptyArrays: true, // keeps categories even if no budget
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            icon: 1,
            color: 1,
            type: 1,
            userId: 1,
            createdAt: 1,
            updatedAt: 1,
            budgetLimit: "$budget.limit", // flatten
          },
        },
      ]);

      console.log("categoriesWithBudgets. = ", categoriesWithBudgets);

      return categoriesWithBudgets;
    },
  },
};

export default resolvers;
