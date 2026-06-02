import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { register } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import type { UserRole } from "@/types/auth.types";
import { APP_NAME } from "@/utils/constants";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, loading, token } = useAppSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("sales");

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await dispatch(register({ name, email, password, role })).unwrap();
      navigate("/dashboard", { replace: true });
    } catch {
      return;
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <section className="w-full max-w-lg animate-slide-up">
        <div className="mb-7 text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">SL</span>
            <span className="text-xl font-black tracking-tight text-slate-950">{APP_NAME}</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Register as sales or admin and start managing leads.</p>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur sm:p-8">
          {error ? <div className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div> : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input label="Name" name="name" onChange={(event) => setName(event.target.value)} required value={name} />
            <Input label="Email" name="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
            <Input
              label="Password"
              minLength={6}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Role</span>
              <select
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/60"
                onChange={(event) => setRole(event.target.value as UserRole)}
                value={role}
              >
                <option value="sales">Sales</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <Button fullWidth isLoading={loading} type="submit">
              Register
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-bold text-slate-950 underline underline-offset-4" to="/login">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}