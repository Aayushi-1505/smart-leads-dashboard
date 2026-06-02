import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import type { Lead, LeadInput } from "@/types/lead.types";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/utils/constants";

interface LeadFormProps {
  initialLead?: Lead | null;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (input: LeadInput) => void | Promise<void>;
}

const emptyLead: LeadInput = {
  name: "",
  email: "",
  status: "New",
  source: "Website",
};

export default function LeadForm({ initialLead, loading = false, onCancel, onSubmit }: LeadFormProps) {
  const [form, setForm] = useState<LeadInput>(emptyLead);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialLead) {
      setForm({
        name: initialLead.name,
        email: initialLead.email,
        status: initialLead.status,
        source: initialLead.source,
      });
      return;
    }

    setForm(emptyLead);
  }, [initialLead]);

  const updateField = (field: keyof LeadInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }) as LeadInput);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    await onSubmit(form);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error ? <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Lead name" name="name" onChange={(event) => updateField("name", event.target.value)} value={form.name} />
        <Input
          label="Email"
          name="email"
          onChange={(event) => updateField("email", event.target.value)}
          type="email"
          value={form.email}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">Status</span>
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
            onChange={(event) => updateField("status", event.target.value)}
            value={form.status}
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">Source</span>
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
            onChange={(event) => updateField("source", event.target.value)}
            value={form.source}
          >
            {LEAD_SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button isLoading={loading} type="submit">
          {initialLead ? "Update lead" : "Create lead"}
        </Button>
      </div>
    </form>
  );
}