export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";
export type LeadSort = "latest" | "oldest";

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadInput {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface LeadQuery {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: LeadSort;
}

export interface LeadsResponse {
  data: Lead[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface LeadState {
  leads: Lead[];
  selectedLead: Lead | null;
  totalPages: number;
  currentPage: number;
  totalRecords: number;
  loading: boolean;
  error: string | null;
}