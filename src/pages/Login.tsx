import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { login } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { APP_NAME } from "@/utils/constants";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, loading, token } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("admin@smartleads.dev");
  const [password, setPassword] = useState("123456");

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/dashboard", { replace: true });
    } catch {
      return;
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("123456");
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute left-[-10rem] top-[-10rem] h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl" />
          <div className="absolute bottom-[-12rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute inset-x-0 top-1/2 h-px overflow-hidden bg-white/10">
            <span className="block h-px w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-sweep" />
          </div>
        </div>
        <div className="relative z-10">
          <div className="mb-16 inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950">SL</span>
            <span className="text-xl font-black tracking-tight">{APP_NAME}</span>
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight">
            Turn scattered enquiries into a clear sales pipeline.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Secure login, lead CRUD, role-based controls, filters, pagination, and CSV export are wired into this dashboard.
          </p>
        </div>
        <p className="relative z-10 text-sm text-slate-400">Demo admin: admin@smartleads.dev / 123456</p>
      </section>

      <section className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">SL</span>
              <span className="text-lg font-black tracking-tight text-slate-950">{APP_NAME}</span>
            </div>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur sm:p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">Login</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Access your protected lead management workspace.</p>
            </div>

            {error ? <div className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div> : null}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input label="Email" name="email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
              <Input
                label="Password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
              <Button fullWidth isLoading={loading} type="submit">
                Login
              </Button>
            </form>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button onClick={() => fillDemo("admin@smartleads.dev")} variant="secondary">
                Use admin demo
              </Button>
              <Button onClick={() => fillDemo("sales@smartleads.dev")} variant="secondary">
                Use sales demo
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              New to the dashboard?{" "}
              <Link className="font-bold text-slate-950 underline underline-offset-4" to="/register">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}