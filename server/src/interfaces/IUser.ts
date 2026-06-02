import type { Document } from "mongoose";

export type UserRole = "admin" | "sales";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}