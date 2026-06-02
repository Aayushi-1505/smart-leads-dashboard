import type { FilterQuery } from "mongoose";
import type { ILead, LeadSource, LeadStatus } from "../interfaces/ILead";
import { Lead } from "../models/Lead";

interface LeadInput {
  name: string;
  email: string;
  status?: LeadStatus;
  source?: LeadSource;
}

export interface LeadQuery {
  page?: string;
  limit?: string;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: "latest" | "oldest";
}

function buildFilter(query: LeadQuery) {
  const filter: FilterQuery<ILead> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  return filter;
}

export async function createLead(input: LeadInput, userId: string) {
  return Lead.create({ ...input, createdBy: userId });
}

export async function getLeads(query: LeadQuery) {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.max(1, Number(query.limit || 10));
  const sortDirection = query.sort === "oldest" ? 1 : -1;
  const filter = buildFilter(query);
  const totalRecords = await Lead.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const data = await Lead.find(filter)
    .sort({ createdAt: sortDirection })
    .skip((page - 1) * limit)
    .limit(limit);

  return { data, page, totalPages, totalRecords };
}

export async function getLeadById(id: string) {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new Error("Lead not found.");
  }

  return lead;
}

export async function updateLead(id: string, input: Partial<LeadInput>) {
  const lead = await Lead.findByIdAndUpdate(id, input, { new: true, runValidators: true });

  if (!lead) {
    throw new Error("Lead not found.");
  }

  return lead;
}

export async function deleteLead(id: string) {
  const lead = await Lead.findByIdAndDelete(id);

  if (!lead) {
    throw new Error("Lead not found.");
  }

  return lead;
}

export async function buildCsv(query: LeadQuery) {
  const { data } = await getLeads({ ...query, limit: "10000", page: "1" });
  const headers = ["Name", "Email", "Status", "Source", "Created At"];
  const rows = data.map((lead) => [lead.name, lead.email, lead.status, lead.source, lead.createdAt.toISOString()]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}