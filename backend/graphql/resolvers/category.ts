import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Transaction, { TransactionType } from "../../models/Transaction";
import Category, { ICategory } from "../../models/Category";
import mongoose from "mongoose";
import Budget, { IBudget } from "../../models/Budget";
import dayjs from "dayjs";

interface IncomeCategoryInput {
  name: string;
  icon: string;
  description: string;
  color: number;
}

interface ExpenseCategoryInput {
  name: string;
  icon?: string;
  color?: string;
  budgetLimit: number;
  description?: string;
}

const resolvers = {
  Mutation: {
    async createIncomeCategory(
      _: unknown,
      {
        input: { name, icon, color, description },
      }: { input: IncomeCategoryInput },
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
        type: TransactionType.INCOME,
        description,
        userId,
      });

      const res = (await newCategory.save()) as ICategory;
      return res;
    },

    async createExpenseCategory(
      _: unknown,
      { input }: { input: ExpenseCategoryInput },
      ctx: any
    ): Promise<{ category: ICategory; budget: IBudget | null }> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const { name, icon, color, budgetLimit, description } = input;

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
        type: TransactionType.EXPENSE,
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
    async getIncomeCategory(
      _: unknown,
      args: { id: string },
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
        type: TransactionType.INCOME,
      })) as ICategory;

      if (!category) {
        throw new ApolloError("Category not found", "NOT_FOUND");
      }

      return category;
    },

    async getAllIncomeCategories(
      _: unknown,
      args: {},
      ctx: any
    ): Promise<ICategory[] | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const categories = await Category.find({
        userId,
        type: TransactionType.INCOME,
      });

      const categoriesAsObjects = categories.map((category) =>
        category.toObject()
      ) as ICategory[];

      return categoriesAsObjects;
    },

    async getExpenseCategory(
      _: unknown,
      args: { id: string },
      ctx: any
    ): Promise<{ category: ICategory; budget: IBudget | null }> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const category = (await Category.findOne({
        id: args.id,
        userId,
        type: TransactionType.EXPENSE,
      })) as ICategory;

      if (!category) {
        throw new ApolloError("Category not found", "NOT_FOUND");
      }

      const budget = await Budget.findOne({
        userId,
        categoryId: category._id,
      });

      return {
        category,
        budget: budget || null,
      };
    },

    async getAllExpenseCategories(
      _: unknown,
      __: {},
      ctx: any
    ): Promise<
      { category: ICategory; budget: IBudget | null; spent: number }[]
    > {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const [categories, budgets, spendings] = await Promise.all([
        Category.find({ userId, type: TransactionType.EXPENSE }),
        Budget.find({ userId }),
        Transaction.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId),
              type: "EXPENSE",
              date: {
                $gte: dayjs().startOf("month").toDate(),
                $lte: dayjs().endOf("month").toDate(),
              },
            },
          },
          {
            $group: {
              _id: "$categoryId",
              totalSpent: { $sum: "$amount" },
            },
          },
        ]),
      ]);

      const budgetMap = new Map<string, IBudget>();
      budgets.forEach((b) => budgetMap.set(b.categoryId.toString(), b));

      const spendingMap = new Map<string, number>();
      spendings.forEach((s) => spendingMap.set(s._id.toString(), s.totalSpent));

      return categories.map((cat) => {
        const categoryId = cat._id.toString();

        return {
          category: cat,
          budget: budgetMap.get(categoryId) || null,
          spent: spendingMap.get(categoryId) || 0,
        };
      });
    },
  },
};

export default resolvers;
