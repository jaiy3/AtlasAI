import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { verifyMessage } from "viem";

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

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
};

export const createWalletNonce = async (userId: string) => {
  const nonce = randomBytes(16).toString("hex");

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      walletNonce: nonce,
    },
  });

  const message = `AtlasAI wallet verification\n\nNonce: ${nonce}`;

  return {
    message,
  };
};

export const verifyWallet = async (
  userId: string,
  walletAddress: string,
  signature: `0x${string}`
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.walletNonce) {
    throw new Error("No wallet verification request found");
  }

  const message = `AtlasAI wallet verification\n\nNonce: ${user.walletNonce}`;

  const valid = await verifyMessage({
    address: walletAddress as `0x${string}`,
    message,
    signature,
  });

  if (!valid) {
    throw new Error("Invalid wallet signature");
  }

  const normalizedAddress = walletAddress.toLowerCase();

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      walletAddress: normalizedAddress,
      walletNonce: null,
    },
  });

  return {
    id: updatedUser.id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    walletAddress: updatedUser.walletAddress,
  };
};