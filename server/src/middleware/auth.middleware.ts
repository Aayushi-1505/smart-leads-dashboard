import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { IUser, UserRole } from "../interfaces/IUser";
import { User } from "../models/User";

interface TokenPayload {
  id: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function protect(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Not authorized, token missing." });
      return;
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "Not authorized, user not found." });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Not authorized, token invalid." });
  }
}