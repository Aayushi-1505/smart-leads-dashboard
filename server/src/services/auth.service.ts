import type { IUser, UserRole } from "../interfaces/IUser";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

function serializeUser(user: IUser) {
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function registerUser(input: RegisterInput) {
  const exists = await User.findOne({ email: input.email.toLowerCase() });

  if (exists) {
    throw new Error("User already exists.");
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
    role: input.role ?? "sales",
  });

  return { token: generateToken(user), user: serializeUser(user) };
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({ email: input.email.toLowerCase() });

  if (!user || !(await user.comparePassword(input.password))) {
    throw new Error("Invalid email or password.");
  }

  return { token: generateToken(user), user: serializeUser(user) };
}