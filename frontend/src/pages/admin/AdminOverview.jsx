import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { IndianRupee, FolderKanban, Users, Clock, Loader2, TrendingUp } from "lucide-react";

const COLORS = ["#FF4F00", "#0A369D", "#0F172A", "#EAB308", "#22C55E"];

function Stat({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white border border-slate-200 p-5" data-testid={`admin-stat-${label.replace(/\s/g, "-").toLowerCase()}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-[0.12em] uppercase text-slate-500 font-bold">{label}</span>
        <div className={`h-9 w-9 flex items-center justify-center ${accent}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="font-heading text-3xl font-black text-slate-900 mt-3">{value}</div>
    </div>
  );
}

export default function AdminOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics").then((r) => setData(r.data));
  }, []);

  if (!data) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-signal" /></div>;
  }

  const statusData = Object.entries(data.status_counts || {}).map(([k, v]) => ({ name: k, value: v }));

  return (
    <div>
      <span className="text-xs tracking-[0.2em] uppercase font-bold text-signal">Dashboard</span>
      <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 mt-2 mb-8">Analytics Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={IndianRupee} label="Total Revenue" value={`₹${(data.total_revenue || 0).toLocaleString("en-IN")}`} accent="bg-signal" />
        <Stat icon={FolderKanban} label="Total Projects" value={data.total_projects} accent="bg-apex" />
        <Stat icon={Users} label="Customers" value={data.total_customers} accent="bg-slate-900" />
        <Stat icon={Clock} label="Pending" value={data.pending_projects} accent="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6">
          <h3 className="font-heading font-bold text-slate-900 flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-signal" /> Monthly Performance
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <Tooltip />
              <Line type="monotone" dataKey="projects" stroke="#FF4F00" strokeWidth={2} name="Projects" />
              <Line type="monotone" dataKey="revenue" stroke="#0A369D" strokeWidth={2} name="Revenue (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <h3 className="font-heading font-bold text-slate-900 mb-4">Project Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {statusData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6">
          <h3 className="font-heading font-bold text-slate-900 mb-4">Top Requested Services</h3>
          {data.top_services?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.top_services} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <Tooltip />
                <Bar dataKey="count" fill="#FF4F00" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 py-12 text-center">No data yet.</p>
          )}
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <h3 className="font-heading font-bold text-slate-900 mb-4">Customer Retention</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50">
              <span className="text-sm text-slate-600">Repeat Customers</span>
              <span className="font-heading text-2xl font-black text-signal">{data.repeat_customers}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50">
              <span className="text-sm text-slate-600">New Customers</span>
              <span className="font-heading text-2xl font-black text-apex">{data.new_customers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
