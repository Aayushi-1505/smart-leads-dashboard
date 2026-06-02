import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import * as leadService from "../services/lead.service";
import type { LeadQuery } from "../services/lead.service";

export async function createLead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized." });
      return;
    }

    const lead = await leadService.createLead(req.body, String(req.user._id));
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
}

export async function getAllLeads(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await leadService.getLeads(req.query as unknown as LeadQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getSingleLead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    res.json(lead);
  } catch (error) {
    next(error);
  }
}

export async function updateLead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body);
    res.json(lead);
  } catch (error) {
    next(error);
  }
}

export async function deleteLead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await leadService.deleteLead(req.params.id);
    res.json({ message: "Lead deleted." });
  } catch (error) {
    next(error);
  }
}

export async function exportCsv(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const csv = await leadService.buildCsv(req.query as unknown as LeadQuery);
    res.header("Content-Type", "text/csv");
    res.attachment("smart-leads.csv");
    res.send(csv);
  } catch (error) {
    next(error);
  }
}