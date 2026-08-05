import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { generateToken } from "../utils/jwt";

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    },
  });

  const token = generateToken(user.id);

return {
  token,
  user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  },
};
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};