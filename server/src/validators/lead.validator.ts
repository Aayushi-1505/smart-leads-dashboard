import type { NextFunction, Request, Response } from "express";

const statuses = ["New", "Contacted", "Qualified", "Lost"];
const sources = ["Website", "Instagram", "Referral"];

export function validateLead(req: Request, res: Response, next: NextFunction) {
  const { email, name, source, status } = req.body;

  if (!name || !email) {
    res.status(400).json({ message: "Lead name and email are required." });
    return;
  }

  if (status && !statuses.includes(status)) {
    res.status(400).json({ message: "Invalid lead status." });
    return;
  }

  if (source && !sources.includes(source)) {
    res.status(400).json({ message: "Invalid lead source." });
    return;
  }

  next();
}