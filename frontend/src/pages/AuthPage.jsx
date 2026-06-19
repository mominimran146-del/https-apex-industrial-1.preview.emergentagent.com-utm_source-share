import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hexagon, Loader2 } from "lucide-react";
import { HERO_IMG } from "@/data/content";

export default function AuthPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", company: "" });

  useEffect(() => {
    if (user) navigate(user.role === "admin" ? "/admin" : "/dashboard");
  }, [user, navigate]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res =
      mode === "login"
        ? await login(form.email, form.password)
        : await register(form);
    setLoading(false);
    if (res.ok) {
      navigate(res.user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
      <div className="hidden lg:block relative bg-slate-900">
        <img src={HERO_IMG} alt="Industrial" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 grid-blueprint opacity-40" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-signal flex items-center justify-center">
              <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-black text-xl tracking-tight">APEX INDUSTRIAL</span>
          </div>
          <div>
            <h2 className="font-heading text-4xl font-black tracking-tighter leading-tight">
              Engineering, Documentation & Automation — Delivered Remotely.
            </h2>
            <p className="text-slate-300 mt-4 max-w-md">
              Create an account to request proposals, track your projects and manage order history.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="flex border border-slate-300 mb-8">
            <button
              onClick={() => setMode("login")}
              data-testid="auth-tab-login"
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "login" ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              data-testid="auth-tab-register"
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "register" ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}
            >
              Sign Up
            </button>
          </div>

          <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {mode === "login" ? "Login to access your dashboard." : "Join Apex to track projects & proposals."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4" data-testid="auth-form">
            {mode === "register" && (
              <div>
                <Label className="text-xs uppercase tracking-wider">Full Name</Label>
                <Input required value={form.name} onChange={set("name")} className="rounded-none mt-1.5 bg-white" data-testid="auth-name" />
              </div>
            )}
            <div>
              <Label className="text-xs uppercase tracking-wider">Email</Label>
              <Input required type="email" value={form.email} onChange={set("email")} className="rounded-none mt-1.5 bg-white" data-testid="auth-email" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Password</Label>
              <Input required type="password" value={form.password} onChange={set("password")} className="rounded-none mt-1.5 bg-white" data-testid="auth-password" />
            </div>
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs uppercase tracking-wider">Phone</Label>
                  <Input value={form.phone} onChange={set("phone")} className="rounded-none mt-1.5 bg-white" data-testid="auth-phone" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider">Company</Label>
                  <Input value={form.company} onChange={set("company")} className="rounded-none mt-1.5 bg-white" data-testid="auth-company" />
                </div>
              </div>
            )}
            {error && <p className="text-sm text-destructive" data-testid="auth-error">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full rounded-none bg-signal hover:bg-signal/90 text-white h-12 gap-2" data-testid="auth-submit">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "login" ? "Login" : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
