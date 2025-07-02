import express from "express";
import { createYoga, createSchema } from "graphql-yoga";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { connectDB } from "./db";
import { typeDefs } from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

const app = express();
const { SERVER_PORT } = process.env;

connectDB();

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
});

app.use("/graphql", yoga);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "./build")));

// Handle React routing, return all requests to the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port: ${SERVER_PORT}`);
});
