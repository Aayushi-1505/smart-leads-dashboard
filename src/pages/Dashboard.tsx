import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportLeadsCsv } from "@/api/leadApi";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import Modal from "@/components/common/Modal";
import FilterBar from "@/components/leads/FilterBar";
import LeadCard from "@/components/leads/LeadCard";
import LeadForm from "@/components/leads/LeadForm";
import LeadTable from "@/components/leads/LeadTable";
import { useDebounce } from "@/hooks/useDebounce";
import { addLead, editLead, fetchLeads, removeLead } from "@/store/leadSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import type { Lead, LeadInput, LeadQuery, LeadSort, LeadSource, LeadStatus } from "@/types/lead.types";
import { PAGE_SIZE } from "@/utils/constants";
import { downloadCsvBlob, downloadLeadsCsv } from "@/utils/exportCSV";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentPage, error, leads, loading, totalPages, totalRecords } = useAppSelector((state) => state.leads);
  const user = useAppSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [source, setSource] = useState<LeadSource | "">("");
  const [sort, setSort] = useState<LeadSort>("latest");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const debouncedSearch = useDebounce(search, 350);
  const canDelete = user?.role === "admin";

  const activeQuery = useMemo<LeadQuery>(
    () => ({
      limit: PAGE_SIZE,
      page,
      search: debouncedSearch || undefined,
      sort,
      source: source || undefined,
      status: status || undefined,
    }),
    [debouncedSearch, page, sort, source, status],
  );

  useEffect(() => {
    dispatch(fetchLeads(activeQuery));
  }, [activeQuery, dispatch]);

  const resetToFirstPage = () => setPage(1);

  const openCreateModal = () => {
    setEditingLead(null);
    setModalOpen(true);
  };

  const handleSubmit = async (input: LeadInput) => {
    setSaving(true);

    try {
      if (editingLead) {
        await dispatch(editLead({ id: editingLead._id, input })).unwrap();
      } else {
        await dispatch(addLead(input)).unwrap();
      }

      setModalOpen(false);
      setEditingLead(null);
      await dispatch(fetchLeads(activeQuery)).unwrap();
    } catch {
      return;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this lead? Admin access is required for this action.")) {
      return;
    }

    try {
      await dispatch(removeLead(id)).unwrap();
      await dispatch(fetchLeads(activeQuery)).unwrap();
    } catch {
      return;
    }
  };

  const handleExport = async () => {
    setExporting(true);

    try {
      const exported = await exportLeadsCsv({ ...activeQuery, limit: Math.max(totalRecords, 1), page: 1 });

      if (exported instanceof Blob) {
        downloadCsvBlob(exported);
      } else {
        downloadLeadsCsv(exported);
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-7 animate-fade-in">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/70 sm:p-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-cyan-400/20 to-transparent" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Lead workspace</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Manage every lead from first touch to close.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Search, filter, paginate, edit, and export your pipeline. Admin users can delete records while sales users stay focused on updates.
          </p>
        </div>
      </section>

      <FilterBar
        exporting={exporting}
        loading={loading}
        onAdd={openCreateModal}
        onExport={handleExport}
        onSearchChange={(value) => {
          setSearch(value);
          resetToFirstPage();
        }}
        onSortChange={(value) => {
          setSort(value);
          resetToFirstPage();
        }}
        onSourceChange={(value) => {
          setSource(value);
          resetToFirstPage();
        }}
        onStatusChange={(value) => {
          setStatus(value);
          resetToFirstPage();
        }}
        search={search}
        sort={sort}
        source={source}
        status={status}
      />

      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">
          Showing <span className="font-bold text-slate-900">{leads.length}</span> of{" "}
          <span className="font-bold text-slate-900">{totalRecords}</span> matching leads
        </p>
        <p className="text-sm font-medium text-slate-500">
          Logged in as <span className="font-bold capitalize text-slate-900">{user?.role}</span>
        </p>
      </div>

      <LeadTable
        canDelete={canDelete}
        leads={leads}
        loading={loading}
        onDelete={handleDelete}
        onEdit={(lead) => {
          setEditingLead(lead);
          setModalOpen(true);
        }}
        onView={(id) => navigate(`/leads/${id}`)}
      />

      <div className="grid gap-4 lg:hidden">
        {loading ? <Loader className="justify-center rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60" label="Loading leads" /> : null}
        {!loading && leads.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No leads match your filters.</div>
        ) : null}
        {!loading
          ? leads.map((lead) => <LeadCard key={lead._id} lead={lead} onEdit={(item) => { setEditingLead(item); setModalOpen(true); }} onView={(id) => navigate(`/leads/${id}`)} />)
          : null}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg shadow-slate-200/60 sm:flex-row">
        <Button disabled={currentPage <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} variant="secondary">
          Previous
        </Button>
        <span className="text-sm font-bold text-slate-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button disabled={currentPage >= totalPages || loading} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} variant="secondary">
          Next
        </Button>
      </div>

      <Modal
        description="Capture the basics used by the API schema: name, email, status, and source."
        onClose={() => {
          setModalOpen(false);
          setEditingLead(null);
        }}
        open={modalOpen}
        title={editingLead ? "Edit lead" : "Add lead"}
      >
        <LeadForm
          initialLead={editingLead}
          loading={saving}
          onCancel={() => {
            setModalOpen(false);
            setEditingLead(null);
          }}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}