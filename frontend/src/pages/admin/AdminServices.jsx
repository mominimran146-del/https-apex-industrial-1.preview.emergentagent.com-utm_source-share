import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Mechanical Design & Drafting",
  "Engineering Documentation",
  "Industrial Automation & Reporting",
  "Digital Technical Services",
];

const EMPTY = { title: "", category: CATEGORIES[0], description: "", image: "", price_from: 0, unit: "project", features: [], active: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [featuresStr, setFeaturesStr] = useState("");

  const load = () => {
    api.get("/admin/services").then((r) => {
      setServices(r.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setFeaturesStr("");
    setOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ ...s });
    setFeaturesStr((s.features || []).join(", "));
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      price_from: parseFloat(form.price_from) || 0,
      features: featuresStr.split(",").map((f) => f.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await api.put(`/admin/services/${editing.id}`, payload);
        toast.success("Service updated");
      } else {
        await api.post("/admin/services", payload);
        toast.success("Service added");
      }
      setOpen(false);
      load();
    } catch {
      toast.error("Save failed");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await api.delete(`/admin/services/${id}`);
    toast.success("Deleted");
    load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-signal">Catalog</span>
          <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 mt-1">Services</h1>
        </div>
        <Button onClick={openNew} className="rounded-none bg-signal hover:bg-signal/90 text-white gap-2" data-testid="add-service-btn">
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-signal" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <div key={s.id} className="bg-white border border-slate-200" data-testid={`admin-service-${i}`}>
              <div className="h-32 overflow-hidden">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading font-bold text-slate-900 leading-tight">{s.title}</h3>
                  {!s.active && <Badge variant="secondary" className="rounded-none text-[10px]">Hidden</Badge>}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">{s.category}</div>
                <div className="font-mono text-sm text-signal mt-2">₹{s.price_from?.toLocaleString("en-IN")}</div>
                <div className="flex gap-2 mt-3">
                  <Button onClick={() => openEdit(s)} variant="outline" size="sm" className="rounded-none flex-1 gap-1" data-testid={`service-edit-${i}`}>
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button onClick={() => remove(s.id)} variant="outline" size="sm" className="rounded-none text-destructive" data-testid={`service-delete-${i}`}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs uppercase tracking-wider">Title</Label>
              <Input value={form.title} onChange={set("title")} className="rounded-none mt-1.5" data-testid="svc-title" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="rounded-none mt-1.5" data-testid="svc-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Description</Label>
              <Textarea value={form.description} onChange={set("description")} rows={2} className="rounded-none mt-1.5" data-testid="svc-desc" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Image URL</Label>
              <Input value={form.image} onChange={set("image")} className="rounded-none mt-1.5" data-testid="svc-image" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider">Price From (₹)</Label>
                <Input type="number" value={form.price_from} onChange={set("price_from")} className="rounded-none mt-1.5" data-testid="svc-price" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Active</Label>
                <Select value={String(form.active)} onValueChange={(v) => setForm({ ...form, active: v === "true" })}>
                  <SelectTrigger className="rounded-none mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Visible</SelectItem>
                    <SelectItem value="false">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Features (comma separated)</Label>
              <Input value={featuresStr} onChange={(e) => setFeaturesStr(e.target.value)} className="rounded-none mt-1.5" data-testid="svc-features" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-none">Cancel</Button>
            <Button onClick={save} className="rounded-none bg-signal hover:bg-signal/90 text-white" data-testid="svc-save">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
