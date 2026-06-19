import React from "react";
import { Link } from "react-router-dom";
import { COMPANY } from "@/data/content";
import { Hexagon, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-9 w-9 bg-signal flex items-center justify-center">
              <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-black text-xl text-white tracking-tight">
              APEX INDUSTRIAL
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            {COMPANY.tagline}. {COMPANY.experience}+ years delivering industrial design,
            documentation and automation — remotely, worldwide.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 hover:text-signal transition-colors">
              <Mail className="h-4 w-4" /> {COMPANY.email}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {COMPANY.location}
            </span>
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-xs tracking-[0.2em] uppercase font-bold text-white mb-4">Navigate</h4>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/services", label: "Services" },
              { to: "/projects", label: "Projects" },
              { to: "/request", label: "Request Proposal" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-signal transition-colors flex items-center gap-1 group">
                  {l.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-xs tracking-[0.2em] uppercase font-bold text-white mb-4">Capabilities</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Mechanical Design & Drafting</li>
            <li>Engineering Documentation</li>
            <li>Industrial Automation & Reporting</li>
            <li>Digital Technical Services</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</span>
          <span className="font-mono">Best Engineering Consultant — Navi Mumbai • India • Worldwide</span>
        </div>
      </div>
    </footer>
  );
}
