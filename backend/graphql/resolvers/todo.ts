import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Todo, { ITodo } from "../../models/Todo";
import User from "../../models/User";
import { Types } from "mongoose";

interface TodoInput {
  title: string;
  description: string;
  isCompleted: boolean;
}

const resolvers = {
  Mutation: {
    async createTodo(
      _: unknown,
      {
        todoInput: { title, description, isCompleted },
      }: { todoInput: TodoInput },
      ctx: any
    ): Promise<ITodo> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const newTodo = new Todo({
        title,
        description,
        isCompleted,
        createdBy: userId,
      });

      const res = (await newTodo.save()).toObject() as ITodo;

      return res;
    },
  },
  Query: {
    async myTodos(_: unknown, args: {}, ctx: any): Promise<ITodo[] | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const myTodos = await Todo.find({ postedBy: userId });

      const todosAsObjects = myTodos.map((todo) => todo.toObject()) as ITodo[];

      return todosAsObjects;
    },
    async getAllTodos(_: unknown, args: {}, ctx: any): Promise<ITodo[]> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError(
          "User not authenticated or invalid user ID",
          "NOT_AUTHENTICATED"
        );
      }

      const query: any = {};

      const todos = await Todo.find(query).populate("createdBy");

      const userObjectId = new Types.ObjectId(userId);

      return [];
    },
  },
};

export default resolvers;
