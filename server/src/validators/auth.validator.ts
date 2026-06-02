import type { NextFunction, Request, Response } from "express";

export function validateRegister(req: Request, res: Response, next: NextFunction) {
  const { email, name, password } = req.body;

  if (!name || !email || !password || password.length < 6) {
    res.status(400).json({ message: "Name, email, and a 6 character password are required." });
    return;
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  next();
}