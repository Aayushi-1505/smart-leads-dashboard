import type { Lead } from "@/types/lead.types";

function escapeCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildLeadsCsv(leads: Lead[]) {
  const headers = ["Name", "Email", "Status", "Source", "Created Date", "Updated Date"];
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    new Date(lead.createdAt).toLocaleDateString(),
    new Date(lead.updatedAt).toLocaleDateString(),
  ]);

  return [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");
}

export function downloadLeadsCsv(leads: Lead[], fileName = "smart-leads.csv") {
  if (typeof document === "undefined") {
    return;
  }

  const blob = new Blob([buildLeadsCsv(leads)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCsvBlob(blob: Blob, fileName = "smart-leads.csv") {
  if (typeof document === "undefined") {
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}