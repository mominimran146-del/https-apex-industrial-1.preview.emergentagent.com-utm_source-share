import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("category") || "all";
  const { addItem, items } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/services").then((r) => {
      setServices(r.data);
      setLoading(false);
    });
  }, []);

  const categories = ["all", ...Array.from(new Set(services.map((s) => s.category)))];
  const filtered = active === "all" ? services : services.filter((s) => s.category === active);
  const inCart = (slug) => items.some((i) => i.service_slug === slug);

  const handleAdd = (s) => {
    addItem(s);
    toast.success(`${s.title} added to proposal`);
  };

  return (
    <div>
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-signal">Services</span>
          <h1 className="font-heading text-4xl lg:text-6xl font-black tracking-tighter mt-3">
            Digital & Engineering Services
          </h1>
          <p className="text-slate-300 mt-4 max-w-2xl">
            Select the services you need and add them to your proposal. We deliver online & offline
            engineering projects worldwide.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              data-testid={`filter-${c.replace(/\s|&/g, "-").toLowerCase()}`}
              onClick={() => setSearchParams(c === "all" ? {} : { category: c })}
              className={`px-4 py-2 text-sm font-medium border transition-colors ${
                active === c
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-300 hover:border-signal hover:text-signal"
              }`}
            >
              {c === "all" ? "All Services" : c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-signal" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <div key={s.id} className="group bg-white border border-slate-200 flex flex-col" data-testid={`service-card-${i}`}>
                <div className="h-44 overflow-hidden relative">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase font-bold text-slate-700">
                    {s.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading text-lg font-bold tracking-tight text-slate-900">{s.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed flex-1">{s.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {(s.features || []).slice(0, 3).map((f, fi) => (
                      <span key={fi} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1">{f}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-end mt-5 pt-5 border-t border-slate-100">
                    {inCart(s.slug) ? (
                      <Button onClick={() => navigate("/request")} variant="outline" className="rounded-none border-signal text-signal gap-1.5" data-testid={`service-incart-${i}`}>
                        <Check className="h-4 w-4" /> Added
                      </Button>
                    ) : (
                      <Button onClick={() => handleAdd(s)} className="rounded-none bg-slate-900 hover:bg-signal text-white gap-1.5" data-testid={`service-add-${i}`}>
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Button onClick={() => navigate("/request")} className="rounded-none bg-signal hover:bg-signal/90 text-white h-12 px-8 gap-2" data-testid="services-goto-proposal">
            Go to Proposal <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
