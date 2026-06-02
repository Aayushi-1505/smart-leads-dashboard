import bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";
import type { IUser } from "../interfaces/IUser";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "sales"], default: "sales" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(this: IUser, password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>("User", userSchema);