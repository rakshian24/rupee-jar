import { AuthenticationError } from "apollo-server-errors";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  userId: string;
  email: string;
  username: string;
}

const getLoggedInUserId = (context: any): DecodedToken => {
  const authHeader: string = context.req.headers.authorization || "";

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (token) {
    try {
      const user = jwt.verify(
        token,
        process.env.JWT_SECRET || ""
      ) as DecodedToken;

      return user;
    } catch (error) {
      throw new AuthenticationError("Invalid/Expired token.");
    }
  }
  throw new AuthenticationError(
    "Authentication token is missing in the header."
  );
};

export default getLoggedInUserId;
