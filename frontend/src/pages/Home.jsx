import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  HERO_IMG, FOUNDER_IMG, STATS, EXPERTISE, CATEGORY_META, PROJECTS, WHY, AVAILABLE_FOR, COMPANY,
} from "@/data/content";
import {
  ArrowRight, ArrowUpRight, Check, Cog, FileText, Gauge, MonitorSmartphone, CircleDot,
} from "lucide-react";

const CAT_ICONS = {
  "Mechanical Design & Drafting": Cog,
  "Engineering Documentation": FileText,
  "Industrial Automation & Reporting": Gauge,
  "Digital Technical Services": MonitorSmartphone,
};

function Overline({ children }) {
  return (
    <span className="text-xs tracking-[0.2em] uppercase font-bold text-signal">{children}</span>
  );
}

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Industrial robotic automation" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/40" />
          <div className="absolute inset-0 grid-blueprint opacity-40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 border border-slate-700 px-3 py-1.5 mb-7">
              <CircleDot className="h-3.5 w-3.5 text-signal" />
              <span className="text-xs tracking-[0.2em] uppercase font-bold text-slate-300">
                {COMPANY.experience}+ Years • Ulwe, Navi Mumbai
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-none">
              Industrial Engineering,
              <span className="block text-signal">Designed & Automated.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              AI-enabled mechanical design, engineering documentation, hydro testing and workflow
              automation — delivered remotely to industries worldwide.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link to="/request" data-testid="hero-request-proposal">
                <Button className="rounded-none bg-signal hover:bg-signal/90 text-white font-semibold h-12 px-8 text-base gap-2 w-full sm:w-auto">
                  Request for Proposal <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/services" data-testid="hero-explore-services">
                <Button variant="outline" className="rounded-none border-slate-600 bg-transparent text-white hover:bg-white hover:text-slate-900 h-12 px-8 text-base w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Stats strip */}
        <div className="relative border-t border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={i} className="px-6 py-8 border-r border-slate-800 last:border-r-0">
                <div className="font-heading text-3xl lg:text-4xl font-black text-white tracking-tight">{s.value}</div>
                <div className="text-xs tracking-[0.15em] uppercase text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <Overline>What We Do</Overline>
            <h2 className="font-heading text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mt-3">
              Engineering Services Built<br /> for Industry.
            </h2>
          </div>
          <Link to="/services" className="text-sm font-semibold text-signal flex items-center gap-1 hover:gap-2 transition-all" data-testid="services-view-all">
            View all services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-slate-200">
          {Object.entries(CATEGORY_META).map(([cat, meta], i) => {
            const Icon = CAT_ICONS[cat] || Cog;
            return (
              <Link
                key={cat}
                to={`/services?category=${encodeURIComponent(cat)}`}
                data-testid={`home-category-${i}`}
                className="group relative border-r border-b border-slate-200 p-8 hover:bg-slate-900 transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 bg-slate-900 group-hover:bg-signal flex items-center justify-center transition-colors">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-mono text-xs text-slate-300 group-hover:text-slate-500">0{i + 1}</span>
                </div>
                <h3 className="font-heading text-xl font-bold tracking-tight mt-6 text-slate-900 group-hover:text-white transition-colors">
                  {cat}
                </h3>
                <p className="text-sm text-slate-600 group-hover:text-slate-300 mt-2 leading-relaxed transition-colors">
                  {meta.blurb}
                </p>
                <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-signal opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* EXPERTISE + FOUNDER */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="relative">
              <img src={FOUNDER_IMG} alt="Mechanical engineer" className="w-full h-[420px] object-cover" />
              <div className="absolute -bottom-6 -right-2 sm:right-6 bg-signal text-white p-6 max-w-[220px]">
                <div className="font-heading text-4xl font-black leading-none">17</div>
                <div className="text-xs tracking-[0.15em] uppercase mt-2 font-bold">Years in Industrial Engineering</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 lg:pl-8">
            <Overline>Core Expertise</Overline>
            <h2 className="font-heading text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mt-3">
              Mechanical Engineering Depth, AI-Powered Delivery.
            </h2>
            <p className="text-slate-600 mt-4 leading-relaxed max-w-xl">
              A mechanical engineer with deep experience in design, project management, equipment
              selection and testing — now building an AI-enabled consultancy for remote engineering
              support, documentation and automation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-8">
              {EXPERTISE.map((e, i) => (
                <div key={i} className="flex items-start gap-3" data-testid={`expertise-${i}`}>
                  <Check className="h-5 w-5 text-signal shrink-0 mt-0.5" strokeWidth={3} />
                  <span className="text-sm text-slate-700">{e}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <Overline>Sample Projects</Overline>
            <h2 className="font-heading text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mt-3">
              Selected Engineering Work.
            </h2>
          </div>
          <Link to="/projects" className="text-sm font-semibold text-signal flex items-center gap-1 hover:gap-2 transition-all" data-testid="projects-view-all">
            All projects <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROJECTS.slice(0, 3).map((p, i) => (
            <div key={i} className="group bg-white border border-slate-200" data-testid={`home-project-${i}`}>
              <div className="overflow-hidden h-52">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <span className="text-xs tracking-[0.15em] uppercase font-bold text-signal">{p.category}</span>
                <h3 className="font-heading text-lg font-bold tracking-tight text-slate-900 mt-2">{p.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY WORK WITH ME */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Overline>Why Work With Apex</Overline>
          <h2 className="font-heading text-3xl lg:text-4xl font-black tracking-tight mt-3 max-w-2xl">
            Technical knowledge, combined with modern automation.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 border-l border-t border-slate-800 mt-12">
            {WHY.map((w, i) => (
              <div key={i} className="border-r border-b border-slate-800 p-8" data-testid={`why-${i}`}>
                <span className="font-mono text-xs text-signal">0{i + 1}</span>
                <h3 className="font-heading text-lg font-bold tracking-tight mt-4">{w.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVAILABLE FOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4">
            <Overline>Engagements</Overline>
            <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 mt-3">Available For</h2>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
              Flexible engagement models — from one-off deliverables to long-term consulting.
            </p>
          </div>
          <div className="lg:col-span-8 flex flex-wrap gap-3">
            {AVAILABLE_FOR.map((a, i) => (
              <span key={i} data-testid={`available-${i}`} className="border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-signal hover:text-signal transition-colors">
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-signal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-heading text-3xl lg:text-5xl font-black tracking-tighter leading-none">
              Ready to start your<br /> engineering project?
            </h2>
            <p className="mt-4 text-white/90 max-w-lg">
              Request a proposal today. Online or offline projects — fast, reliable, remote-first delivery.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/request" data-testid="cta-order-now">
              <Button className="rounded-none bg-white text-signal hover:bg-slate-900 hover:text-white h-12 px-8 font-semibold text-base w-full">
                Request Proposal
              </Button>
            </Link>
            <Link to="/contact" data-testid="cta-contact">
              <Button variant="outline" className="rounded-none border-white bg-transparent text-white hover:bg-white hover:text-signal h-12 px-8 text-base w-full">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
