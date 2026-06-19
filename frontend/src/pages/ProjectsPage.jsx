import React from "react";
import { Link } from "react-router-dom";
import { PROJECTS } from "@/data/content";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div>
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-signal">Portfolio</span>
          <h1 className="font-heading text-4xl lg:text-6xl font-black tracking-tighter mt-3">Sample Projects</h1>
          <p className="text-slate-300 mt-4 max-w-2xl">
            A selection of industrial engineering, documentation and automation work delivered across sectors.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {PROJECTS.map((p, i) => (
          <div
            key={i}
            data-testid={`project-${i}`}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="overflow-hidden border border-slate-200">
              <img src={p.image} alt={p.title} className="w-full h-[340px] object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div>
              <span className="font-mono text-sm text-signal">{String(i + 1).padStart(2, "0")} / {p.category}</span>
              <h2 className="font-heading text-2xl lg:text-3xl font-black tracking-tight text-slate-900 mt-3">{p.title}</h2>
              <p className="text-slate-600 mt-4 leading-relaxed">{p.desc}</p>
              <Link to="/request" className="inline-block mt-6">
                <Button variant="outline" className="rounded-none border-slate-300 hover:border-signal hover:text-signal gap-2" data-testid={`project-cta-${i}`}>
                  Request similar work <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-signal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-black tracking-tight">Have a project in mind?</h2>
          <Link to="/request" className="inline-block mt-6">
            <Button className="rounded-none bg-white text-signal hover:bg-slate-900 hover:text-white h-12 px-8 font-semibold" data-testid="projects-cta">
              Start Your Proposal
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
