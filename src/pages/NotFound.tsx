import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <section className="max-w-md rounded-3xl border border-white/70 bg-white/85 p-8 text-center shadow-2xl shadow-slate-200/70 animate-slide-up">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">404</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Page not found</h1>
        <p className="mt-3 text-slate-500">This route is not part of the Smart Leads Dashboard.</p>
        <Button className="mt-6" onClick={() => navigate("/dashboard")} variant="secondary">
          Go to dashboard
        </Button>
      </section>
    </main>
  );
}