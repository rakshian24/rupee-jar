import jwt from "jsonwebtoken";

export const generateToken = async (user: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
          accounts: user.accounts,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "365d",
        }
      );
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });
};
