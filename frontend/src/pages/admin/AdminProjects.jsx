import React, { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download, Search, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["pending", "in-progress", "delivered", "cancelled"];
const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-700",
  "in-progress": "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-slate-200 text-slate-600",
};

export default function AdminProjects() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (statusFilter !== "all") params.status = statusFilter;
    if (search) params.search = search;
    const { data } = await api.get("/admin/proposals", { params });
    setProposals(data);
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const saveEdit = async () => {
    try {
      await api.put(`/admin/proposals/${editing.id}`, {
        status: editing.status,
        amount: parseFloat(editing.amount) || 0,
        admin_notes: editing.admin_notes || "",
      });
      toast.success("Project updated");
      setEditing(null);
      load();
    } catch {
      toast.error("Update failed");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await api.delete(`/admin/proposals/${id}`);
    toast.success("Deleted");
    load();
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      const res = await api.get("/admin/export/proposals", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `apex_projects_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Excel exported");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-signal">Management</span>
          <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 mt-1">Projects</h1>
        </div>
        <Button onClick={exportExcel} disabled={exporting} className="rounded-none bg-emerald-600 hover:bg-emerald-700 text-white gap-2" data-testid="admin-export-excel">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export to Excel
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ref, customer, company..." className="rounded-none pl-9" data-testid="admin-search" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="rounded-none w-full sm:w-48" data-testid="admin-status-filter"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-slate-200 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-signal" /></div>
        ) : proposals.length === 0 ? (
          <p className="text-center text-slate-400 py-16" data-testid="admin-no-projects">No projects found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Ref</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((p, i) => (
                <TableRow key={p.id} data-testid={`admin-project-row-${i}`}>
                  <TableCell className="font-mono text-xs font-bold text-signal">{p.ref}</TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">{p.customer_name}</div>
                    <div className="text-xs text-slate-500">{p.customer_email}</div>
                    {p.company && <div className="text-xs text-slate-400">{p.company}</div>}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {p.items?.slice(0, 2).map((it, ii) => (
                        <span key={ii} className="text-[10px] bg-slate-100 px-1.5 py-0.5">{it.title}</span>
                      ))}
                      {p.items?.length > 2 && <span className="text-[10px] text-slate-400">+{p.items.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-sm">{p.project_type}</TableCell>
                  <TableCell className="text-sm text-slate-500">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={`rounded-none capitalize ${STATUS_STYLE[p.status]}`}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{p.amount ? `₹${p.amount.toLocaleString("en-IN")}` : "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button onClick={() => setEditing({ ...p })} variant="ghost" size="icon" className="h-8 w-8" data-testid={`admin-edit-${i}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => remove(p.id)} variant="ghost" size="icon" className="h-8 w-8 text-destructive" data-testid={`admin-delete-${i}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle className="font-heading">Update Project {editing?.ref}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wider">Status</Label>
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                  <SelectTrigger className="rounded-none mt-1.5" data-testid="edit-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Quote Amount (₹)</Label>
                <Input type="number" value={editing.amount || ""} onChange={(e) => setEditing({ ...editing, amount: e.target.value })} className="rounded-none mt-1.5" data-testid="edit-amount" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Admin Notes</Label>
                <Textarea value={editing.admin_notes || ""} onChange={(e) => setEditing({ ...editing, admin_notes: e.target.value })} className="rounded-none mt-1.5" rows={3} data-testid="edit-notes" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} className="rounded-none">Cancel</Button>
            <Button onClick={saveEdit} className="rounded-none bg-signal hover:bg-signal/90 text-white" data-testid="edit-save">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
