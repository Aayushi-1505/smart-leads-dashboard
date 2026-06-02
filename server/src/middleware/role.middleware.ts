import type { NextFunction, Response } from "express";
import type { UserRole } from "../interfaces/IUser";
import type { AuthRequest } from "./auth.middleware";

export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "You do not have permission to perform this action." });
      return;
    }

    next();
  };
}