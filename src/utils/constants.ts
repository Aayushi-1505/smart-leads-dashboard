import type { LeadSort, LeadSource, LeadStatus } from "@/types/lead.types";

export const APP_NAME = "Smart Leads Dashboard";
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCKS !== "false";

export const LEAD_STATUSES: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
export const LEAD_SOURCES: LeadSource[] = ["Website", "Instagram", "Referral"];

export const SORT_OPTIONS: { label: string; value: LeadSort }[] = [
  { label: "Latest first", value: "latest" },
  { label: "Oldest first", value: "oldest" },
];

export const PAGE_SIZE = 8;