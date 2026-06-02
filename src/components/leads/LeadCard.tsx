import Button from "@/components/common/Button";
import type { Lead } from "@/types/lead.types";

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onView: (id: string) => void;
}

export default function LeadCard({ lead, onEdit, onView }: LeadCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-950">{lead.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{lead.email}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{lead.status}</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-400">Source</dt>
          <dd className="font-semibold text-slate-700">{lead.source}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Created</dt>
          <dd className="font-semibold text-slate-700">{new Date(lead.createdAt).toLocaleDateString()}</dd>
        </div>
      </dl>
      <div className="mt-5 flex gap-2">
        <Button className="h-10 flex-1" onClick={() => onView(lead._id)} variant="secondary">
          View
        </Button>
        <Button className="h-10 flex-1" onClick={() => onEdit(lead)}>
          Edit
        </Button>
      </div>
    </article>
  );
}