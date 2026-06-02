import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import type { LeadSort, LeadSource, LeadStatus } from "@/types/lead.types";
import { LEAD_SOURCES, LEAD_STATUSES, SORT_OPTIONS } from "@/utils/constants";

interface FilterBarProps {
  exporting?: boolean;
  loading?: boolean;
  onAdd: () => void;
  onExport: () => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: LeadSort) => void;
  onSourceChange: (value: LeadSource | "") => void;
  onStatusChange: (value: LeadStatus | "") => void;
  search: string;
  sort: LeadSort;
  source: LeadSource | "";
  status: LeadStatus | "";
}

export default function FilterBar({
  exporting = false,
  loading = false,
  onAdd,
  onExport,
  onSearchChange,
  onSortChange,
  onSourceChange,
  onStatusChange,
  search,
  sort,
  source,
  status,
}: FilterBarProps) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/50 backdrop-blur">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_auto_auto]">
        <Input
          aria-label="Search leads"
          name="search"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name or email"
          value={search}
        />
        <select
          aria-label="Filter by status"
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
          onChange={(event) => onStatusChange(event.target.value as LeadStatus | "")}
          value={status}
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by source"
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
          onChange={(event) => onSourceChange(event.target.value as LeadSource | "")}
          value={source}
        >
          <option value="">All sources</option>
          {LEAD_SOURCES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort leads"
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
          onChange={(event) => onSortChange(event.target.value as LeadSort)}
          value={sort}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button isLoading={exporting} onClick={onExport} variant="secondary">
          Export CSV
        </Button>
        <Button disabled={loading} onClick={onAdd}>
          Add Lead
        </Button>
      </div>
    </div>
  );
}