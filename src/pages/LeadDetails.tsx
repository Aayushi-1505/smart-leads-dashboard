import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import { clearSelectedLead, fetchLead } from "@/store/leadSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

export default function LeadDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, loading, selectedLead } = useAppSelector((state) => state.leads);

  useEffect(() => {
    if (id) {
      dispatch(fetchLead(id));
    }

    return () => {
      dispatch(clearSelectedLead());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader label="Loading lead details" />
      </div>
    );
  }

  if (error || !selectedLead) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white/85 p-8 text-center shadow-xl shadow-slate-200/70">
        <h1 className="text-2xl font-black text-slate-950">Lead not found</h1>
        <p className="mt-2 text-slate-500">{error ?? "The lead you requested does not exist."}</p>
        <Button className="mt-6" onClick={() => navigate("/dashboard")} variant="secondary">
          Back to dashboard
        </Button>
      </section>
    );
  }

  const details = [
    { label: "Name", value: selectedLead.name },
    { label: "Email", value: selectedLead.email },
    { label: "Status", value: selectedLead.status },
    { label: "Source", value: selectedLead.source },
    { label: "Created", value: new Date(selectedLead.createdAt).toLocaleString() },
    { label: "Updated", value: new Date(selectedLead.updatedAt).toLocaleString() },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-slide-up">
      <Button onClick={() => navigate("/dashboard")} variant="secondary">
        Back to dashboard
      </Button>
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-2xl shadow-slate-200/70">
        <div className="bg-slate-950 p-7 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Lead details</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">{selectedLead.name}</h1>
          <p className="mt-2 text-slate-300">{selectedLead.email}</p>
        </div>
        <dl className="grid gap-px bg-slate-100 sm:grid-cols-2">
          {details.map((item) => (
            <div className="bg-white p-6" key={item.label}>
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{item.label}</dt>
              <dd className="mt-2 text-base font-semibold text-slate-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}