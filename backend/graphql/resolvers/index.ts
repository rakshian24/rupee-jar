import userResolvers from "./users";
import accountResolvers from "./account";

export default {
  Query: {
    ...userResolvers.Query,
    ...accountResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...accountResolvers.Mutation,
  },
};
