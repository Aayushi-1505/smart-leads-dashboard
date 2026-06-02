import apiClient from "@/api/axios";
import type { Lead, LeadInput, LeadQuery, LeadsResponse } from "@/types/lead.types";
import type { User } from "@/types/auth.types";
import { USE_MOCK_API } from "@/utils/constants";

const LEADS_KEY = "smart_leads_records";

const seedLeads: Lead[] = [
  {
    _id: "lead-1",
    name: "Rahul Mehta",
    email: "rahul@acme.in",
    status: "Qualified",
    source: "Instagram",
    createdBy: "admin-1",
    createdAt: "2026-01-08T10:30:00.000Z",
    updatedAt: "2026-01-09T09:15:00.000Z",
  },
  {
    _id: "lead-2",
    name: "Maya Kapoor",
    email: "maya@northstar.io",
    status: "Contacted",
    source: "Website",
    createdBy: "sales-1",
    createdAt: "2026-01-07T12:10:00.000Z",
    updatedAt: "2026-01-08T11:00:00.000Z",
  },
  {
    _id: "lead-3",
    name: "Dev Patel",
    email: "dev@launchlane.com",
    status: "New",
    source: "Referral",
    createdBy: "admin-1",
    createdAt: "2026-01-06T15:45:00.000Z",
    updatedAt: "2026-01-06T15:45:00.000Z",
  },
  {
    _id: "lead-4",
    name: "Sara Thomas",
    email: "sara@brightcrm.com",
    status: "Lost",
    source: "Website",
    createdBy: "sales-1",
    createdAt: "2026-01-05T08:25:00.000Z",
    updatedAt: "2026-01-07T14:20:00.000Z",
  },
  {
    _id: "lead-5",
    name: "Kabir Sinha",
    email: "kabir@growthgrid.co",
    status: "Qualified",
    source: "Referral",
    createdBy: "admin-1",
    createdAt: "2026-01-04T16:30:00.000Z",
    updatedAt: "2026-01-08T16:30:00.000Z",
  },
  {
    _id: "lead-6",
    name: "Anika Rao",
    email: "anika@studioflux.com",
    status: "New",
    source: "Instagram",
    createdBy: "sales-1",
    createdAt: "2026-01-03T13:00:00.000Z",
    updatedAt: "2026-01-03T13:00:00.000Z",
  },
];

const wait = () => new Promise((resolve) => setTimeout(resolve, 300));

function readLeads(): Lead[] {
  if (typeof window === "undefined") {
    return seedLeads;
  }

  const saved = localStorage.getItem(LEADS_KEY);

  if (!saved) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(seedLeads));
    return seedLeads;
  }

  try {
    return JSON.parse(saved) as Lead[];
  } catch {
    localStorage.setItem(LEADS_KEY, JSON.stringify(seedLeads));
    return seedLeads;
  }
}

function writeLeads(leads: Lead[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}`;
}

function getCurrentUserId() {
  if (typeof window === "undefined") {
    return "local-user";
  }

  const saved = localStorage.getItem("smart_leads_user");

  if (!saved) {
    return "local-user";
  }

  try {
    return (JSON.parse(saved) as User)._id;
  } catch {
    return "local-user";
  }
}

function filterLeads(leads: Lead[], query: LeadQuery) {
  const search = query.search?.trim().toLowerCase();

  return leads
    .filter((lead) => (query.status ? lead.status === query.status : true))
    .filter((lead) => (query.source ? lead.source === query.source : true))
    .filter((lead) => {
      if (!search) {
        return true;
      }

      return `${lead.name} ${lead.email}`.toLowerCase().includes(search);
    })
    .sort((first, second) => {
      const diff = new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
      return query.sort === "oldest" ? -diff : diff;
    });
}

export async function getLeads(query: LeadQuery = {}): Promise<LeadsResponse> {
  if (!USE_MOCK_API) {
    const { data } = await apiClient.get<LeadsResponse>("/leads", { params: query });
    return data;
  }

  await wait();

  const pageSize = Number(query.limit ?? 10);
  const requestedPage = Math.max(1, Number(query.page ?? 1));
  const filtered = filterLeads(readLeads(), query);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * pageSize;

  return {
    data: filtered.slice(start, start + pageSize),
    page,
    totalPages,
    totalRecords: filtered.length,
  };
}

export async function getLead(id: string): Promise<Lead> {
  if (!USE_MOCK_API) {
    const { data } = await apiClient.get<Lead>(`/leads/${id}`);
    return data;
  }

  await wait();

  const lead = readLeads().find((item) => item._id === id);

  if (!lead) {
    throw new Error("Lead not found.");
  }

  return lead;
}

export async function createLead(input: LeadInput): Promise<Lead> {
  if (!USE_MOCK_API) {
    const { data } = await apiClient.post<Lead>("/leads", input);
    return data;
  }

  await wait();

  const now = new Date().toISOString();
  const lead: Lead = {
    _id: createId(),
    ...input,
    createdBy: getCurrentUserId(),
    createdAt: now,
    updatedAt: now,
  };

  writeLeads([lead, ...readLeads()]);
  return lead;
}

export async function updateLead(id: string, input: Partial<LeadInput>): Promise<Lead> {
  if (!USE_MOCK_API) {
    const { data } = await apiClient.put<Lead>(`/leads/${id}`, input);
    return data;
  }

  await wait();

  const leads = readLeads();
  const lead = leads.find((item) => item._id === id);

  if (!lead) {
    throw new Error("Lead not found.");
  }

  const updatedLead: Lead = { ...lead, ...input, updatedAt: new Date().toISOString() };
  writeLeads(leads.map((item) => (item._id === id ? updatedLead : item)));
  return updatedLead;
}

export async function deleteLead(id: string): Promise<{ id: string }> {
  if (!USE_MOCK_API) {
    await apiClient.delete(`/leads/${id}`);
    return { id };
  }

  await wait();

  const leads = readLeads();
  const exists = leads.some((lead) => lead._id === id);

  if (!exists) {
    throw new Error("Lead not found.");
  }

  writeLeads(leads.filter((lead) => lead._id !== id));
  return { id };
}

export async function exportLeadsCsv(query: LeadQuery = {}): Promise<Blob | Lead[]> {
  if (!USE_MOCK_API) {
    const { data } = await apiClient.get<Blob>("/leads/export/csv", { params: query, responseType: "blob" });
    return data;
  }

  const response = await getLeads({ ...query, page: 1, limit: 10000 });
  return response.data;
}