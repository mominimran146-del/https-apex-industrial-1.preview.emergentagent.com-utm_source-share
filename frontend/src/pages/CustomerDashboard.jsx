import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ArrowRight } from "lucide-react";

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-700",
  "in-progress": "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-slate-200 text-slate-600",
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/my/proposals").then((r) => {
      setProposals(r.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-signal">My Account</span>
          <h1 className="font-heading text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mt-2">
            Hello, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">{user?.email}</p>
        </div>
        <Link to="/services">
          <Button className="rounded-none bg-signal hover:bg-signal/90 text-white gap-2" data-testid="dashboard-new-proposal">
            New Proposal <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Proposals", value: proposals.length },
          { label: "In Progress", value: proposals.filter((p) => p.status === "in-progress").length },
          { label: "Delivered", value: proposals.filter((p) => p.status === "delivered").length },
          { label: "Loyalty Points", value: user?.loyalty_points || 0 },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5" data-testid={`cust-stat-${i}`}>
            <div className="font-heading text-3xl font-black text-slate-900">{s.value}</div>
            <div className="text-xs tracking-[0.12em] uppercase text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900 mb-4">Order History</h2>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-signal" /></div>
      ) : proposals.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center" data-testid="cust-no-proposals">
          <Package className="h-12 w-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 mt-4">No proposals yet.</p>
          <Link to="/services" className="inline-block mt-4">
            <Button variant="outline" className="rounded-none">Browse Services</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((p, i) => (
            <div key={p.id} className="bg-white border border-slate-200 p-5" data-testid={`cust-proposal-${i}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-signal">{p.ref}</span>
                    <Badge className={`rounded-none capitalize ${STATUS_STYLE[p.status] || ""}`}>{p.status}</Badge>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{new Date(p.created_at).toLocaleDateString()} • {p.project_type}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider text-slate-400">Quote</div>
                  <div className="font-heading font-black text-slate-900">{p.amount ? `₹${p.amount.toLocaleString("en-IN")}` : "Pending"}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                {p.items?.map((it, ii) => (
                  <span key={ii} className="text-xs bg-slate-100 text-slate-600 px-2 py-1">{it.title} ×{it.quantity}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
