import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { formatApiError } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Minus, Plus, ShoppingCart, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function RequestProposal() {
  const { items, removeItem, setQuantity, estTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: user?.name || "",
    customer_email: user?.email || "",
    customer_phone: user?.phone || "",
    company: user?.company || "",
    project_type: "online",
    budget: "",
    timeline: "",
    details: "",
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Add at least one service to your proposal");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        items: items.map((i) => ({
          service_slug: i.service_slug,
          title: i.title,
          category: i.category,
          quantity: i.quantity,
        })),
      };
      const { data } = await api.post("/proposals", payload);
      setSubmitted(data.ref);
      clearCart();
      toast.success("Proposal submitted!");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-signal mx-auto" />
        <h1 className="font-heading text-3xl font-black tracking-tight mt-6 text-slate-900">Proposal Submitted</h1>
        <p className="text-slate-600 mt-3">
          Your reference number is <span className="font-mono font-bold text-signal">{submitted}</span>.
          Our team will review and respond shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          {user ? (
            <Button onClick={() => navigate("/dashboard")} className="rounded-none bg-slate-900 text-white" data-testid="proposal-view-dashboard">
              View My Proposals
            </Button>
          ) : (
            <Button onClick={() => navigate("/auth")} className="rounded-none bg-slate-900 text-white" data-testid="proposal-signup">
              Create account to track
            </Button>
          )}
          <Button onClick={() => navigate("/services")} variant="outline" className="rounded-none">Browse more services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs tracking-[0.2em] uppercase font-bold text-signal">Checkout</span>
      <h1 className="font-heading text-3xl lg:text-5xl font-black tracking-tighter text-slate-900 mt-3">Request a Proposal</h1>
      <p className="text-slate-600 mt-3 max-w-2xl">
        Review your selected services and share your project details. We will prepare a tailored
        proposal and quote for you.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        {/* Cart */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-signal" />
              <h2 className="font-heading font-bold text-slate-900">Selected Services ({items.length})</h2>
            </div>
            {items.length === 0 ? (
              <div className="p-10 text-center text-slate-500" data-testid="cart-empty">
                No services selected yet.
                <div className="mt-4">
                  <Link to="/services">
                    <Button variant="outline" className="rounded-none gap-2">Browse Services <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {items.map((it, i) => (
                  <div key={it.service_slug} className="p-5 flex items-center gap-4" data-testid={`cart-item-${i}`}>
                    <div className="flex-1">
                      <div className="text-[10px] tracking-wider uppercase text-slate-400 font-bold">{it.category}</div>
                      <div className="font-medium text-slate-900">{it.title}</div>
                    </div>
                    <div className="flex items-center border border-slate-300">
                      <button type="button" onClick={() => setQuantity(it.service_slug, it.quantity - 1)} className="px-2 py-1.5 hover:bg-slate-100" data-testid={`cart-dec-${i}`}>
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-semibold w-8 text-center">{it.quantity}</span>
                      <button type="button" onClick={() => setQuantity(it.service_slug, it.quantity + 1)} className="px-2 py-1.5 hover:bg-slate-100" data-testid={`cart-inc-${i}`}>
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeItem(it.service_slug)} className="text-slate-400 hover:text-destructive" data-testid={`cart-remove-${i}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-3">* A tailored quote is provided after we review your requirements.</p>
        </div>

        {/* Form */}
        <div className="lg:col-span-5">
          <form onSubmit={submit} className="bg-white border border-slate-200 p-6 space-y-4" data-testid="proposal-form">
            <h2 className="font-heading font-bold text-slate-900 text-lg">Your Details</h2>
            <div>
              <Label className="text-xs uppercase tracking-wider">Full Name</Label>
              <Input required value={form.customer_name} onChange={set("customer_name")} className="rounded-none mt-1.5" data-testid="proposal-name" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Email</Label>
              <Input required type="email" value={form.customer_email} onChange={set("customer_email")} className="rounded-none mt-1.5" data-testid="proposal-email" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider">Phone</Label>
                <Input value={form.customer_phone} onChange={set("customer_phone")} className="rounded-none mt-1.5" data-testid="proposal-phone" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Company</Label>
                <Input value={form.company} onChange={set("company")} className="rounded-none mt-1.5" data-testid="proposal-company" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider">Project Type</Label>
                <Select value={form.project_type} onValueChange={(v) => setForm({ ...form, project_type: v })}>
                  <SelectTrigger className="rounded-none mt-1.5" data-testid="proposal-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline / On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Budget (₹)</Label>
                <Input value={form.budget} onChange={set("budget")} className="rounded-none mt-1.5" placeholder="Optional" data-testid="proposal-budget" />
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Timeline</Label>
              <Input value={form.timeline} onChange={set("timeline")} className="rounded-none mt-1.5" placeholder="e.g. 2 weeks" data-testid="proposal-timeline" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Project Details</Label>
              <Textarea value={form.details} onChange={set("details")} rows={4} className="rounded-none mt-1.5" placeholder="Describe your requirement..." data-testid="proposal-details" />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-none bg-signal hover:bg-signal/90 text-white h-12 gap-2" data-testid="proposal-submit">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit Proposal Request
            </Button>
            {!user && (
              <p className="text-xs text-slate-400 text-center">
                <Link to="/auth" className="text-signal font-semibold">Login</Link> to track your proposals & order history.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
