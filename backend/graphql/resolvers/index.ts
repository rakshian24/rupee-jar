import userResolvers from "./users";
import todoResolvers from "./todo";

export default {
  Query: {
    ...userResolvers.Query,
    ...todoResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...todoResolvers.Mutation,
  },
};
