import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/secrets";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: "7d",
  });
};
