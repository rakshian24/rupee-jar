import userResolvers from "./users";
import accountResolvers from "./account";
import categoryResolvers from "./category";
import budgetResolvers from "./budget";
import transactionResolvers from "./transaction";

export default {
  Query: {
    ...userResolvers.Query,
    ...accountResolvers.Query,
    ...categoryResolvers.Query,
    ...budgetResolvers.Query,
    ...transactionResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...accountResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...budgetResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
};
