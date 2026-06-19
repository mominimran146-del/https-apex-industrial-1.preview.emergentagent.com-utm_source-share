import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Loader2, Search, Users } from "lucide-react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/admin/customers").then((r) => {
      setCustomers(r.data);
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <span className="text-xs tracking-[0.2em] uppercase font-bold text-signal">Database</span>
        <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 mt-1">Customers</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 p-4">
          <div className="font-heading text-2xl font-black text-slate-900">{customers.length}</div>
          <div className="text-xs uppercase tracking-wider text-slate-500">Total</div>
        </div>
        <div className="bg-white border border-slate-200 p-4">
          <div className="font-heading text-2xl font-black text-signal">{customers.filter((c) => c.type === "repeat").length}</div>
          <div className="text-xs uppercase tracking-wider text-slate-500">Repeat</div>
        </div>
        <div className="bg-white border border-slate-200 p-4">
          <div className="font-heading text-2xl font-black text-apex">{customers.filter((c) => c.type === "new").length}</div>
          <div className="text-xs uppercase tracking-wider text-slate-500">New</div>
        </div>
      </div>

      <div className="relative mb-5 max-w-md">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="rounded-none pl-9" data-testid="customer-search" />
      </div>

      <div className="bg-white border border-slate-200 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-signal" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400" data-testid="no-customers">
            <Users className="h-10 w-10 mx-auto mb-3 text-slate-300" /> No customers found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c, i) => (
                <TableRow key={c.id} data-testid={`customer-row-${i}`}>
                  <TableCell className="font-medium text-slate-900">{c.name}</TableCell>
                  <TableCell className="text-sm text-slate-600">{c.email}</TableCell>
                  <TableCell className="text-sm text-slate-600">{c.phone || "—"}</TableCell>
                  <TableCell className="text-sm text-slate-600">{c.company || "—"}</TableCell>
                  <TableCell className="text-center">{c.order_count}</TableCell>
                  <TableCell className="text-right font-medium">₹{(c.total_spent || 0).toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge className={`rounded-none capitalize ${c.type === "repeat" ? "bg-signal/10 text-signal" : "bg-slate-100 text-slate-600"}`}>
                      {c.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
