import jwt from "jsonwebtoken";
import type { IUser } from "../interfaces/IUser";
import { env } from "../config/env";

export function generateToken(user: IUser) {
  return jwt.sign({ id: String(user._id), role: user.role }, env.jwtSecret, { expiresIn: "7d" });
}