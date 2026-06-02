import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import type { Lead, LeadStatus } from "@/types/lead.types";
import { cn } from "@/utils/cn";

interface LeadTableProps {
  canDelete: boolean;
  leads: Lead[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onEdit: (lead: Lead) => void;
  onView: (id: string) => void;
}

const statusClasses: Record<LeadStatus, string> = {
  New: "bg-sky-50 text-sky-700 ring-sky-100",
  Contacted: "bg-amber-50 text-amber-700 ring-amber-100",
  Qualified: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Lost: "bg-rose-50 text-rose-700 ring-rose-100",
};

export default function LeadTable({ canDelete, leads, loading = false, onDelete, onEdit, onView }: LeadTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 lg:block">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
          <tr>
            <th className="px-6 py-4 font-bold">Lead</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 font-bold">Source</th>
            <th className="px-6 py-4 font-bold">Created</th>
            <th className="px-6 py-4 text-right font-bold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <tr>
              <td className="px-6 py-10 text-center" colSpan={5}>
                <Loader className="justify-center" label="Loading leads" />
              </td>
            </tr>
          ) : null}

          {!loading && leads.length === 0 ? (
            <tr>
              <td className="px-6 py-12 text-center text-slate-500" colSpan={5}>
                No leads match your filters.
              </td>
            </tr>
          ) : null}

          {!loading
            ? leads.map((lead) => (
                <tr className="transition hover:bg-slate-50/70" key={lead._id}>
                  <td className="px-6 py-4">
                    <button className="text-left" onClick={() => onView(lead._id)} type="button">
                      <span className="block font-semibold text-slate-950">{lead.name}</span>
                      <span className="text-slate-500">{lead.email}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-bold ring-1", statusClasses[lead.status])}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{lead.source}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button className="h-9 px-3" onClick={() => onView(lead._id)} variant="ghost">
                        View
                      </Button>
                      <Button className="h-9 px-3" onClick={() => onEdit(lead)} variant="secondary">
                        Edit
                      </Button>
                      {canDelete ? (
                        <Button className="h-9 px-3" onClick={() => onDelete(lead._id)} variant="danger">
                          Delete
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}