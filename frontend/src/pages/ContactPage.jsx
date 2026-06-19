import React, { useState } from "react";
import api, { formatApiError } from "@/lib/api";
import { COMPANY } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/contact", form);
      toast.success(data.message);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-signal">Get in touch</span>
          <h1 className="font-heading text-4xl lg:text-6xl font-black tracking-tighter mt-3">Contact Apex</h1>
          <p className="text-slate-300 mt-4 max-w-2xl">
            Based in Ulwe, Navi Mumbai — serving clients across India and worldwide. Reach out for a
            quote, proposal or consultation.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          {[
            { icon: Mail, label: "Email", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
            { icon: MapPin, label: "Location", value: COMPANY.location },
            { icon: Phone, label: "Availability", value: "Remote-first • Worldwide" },
          ].map((c, i) => (
            <div key={i} className="flex items-start gap-4 border border-slate-200 p-5 bg-white" data-testid={`contact-info-${i}`}>
              <div className="h-11 w-11 bg-slate-900 flex items-center justify-center shrink-0">
                <c.icon className="h-5 w-5 text-signal" />
              </div>
              <div>
                <div className="text-xs tracking-[0.15em] uppercase font-bold text-slate-400">{c.label}</div>
                {c.href ? (
                  <a href={c.href} className="text-slate-900 font-medium hover:text-signal">{c.value}</a>
                ) : (
                  <div className="text-slate-900 font-medium">{c.value}</div>
                )}
              </div>
            </div>
          ))}

          <div className="border border-slate-200 overflow-hidden">
            <iframe
              title="Apex Location - Ulwe, Navi Mumbai"
              src="https://www.google.com/maps?q=Ulwe,+Navi+Mumbai,+Maharashtra&output=embed"
              width="100%"
              height="280"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              data-testid="contact-map"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={submit} className="bg-white border border-slate-200 p-8" data-testid="contact-form">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">Send a Message</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
              <div>
                <Label className="text-xs uppercase tracking-wider">Name</Label>
                <Input required value={form.name} onChange={set("name")} className="rounded-none mt-1.5" data-testid="contact-name" placeholder="Your name" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Email</Label>
                <Input required type="email" value={form.email} onChange={set("email")} className="rounded-none mt-1.5" data-testid="contact-email" placeholder="you@company.com" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Phone</Label>
                <Input value={form.phone} onChange={set("phone")} className="rounded-none mt-1.5" data-testid="contact-phone" placeholder="+91 ..." />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Subject</Label>
                <Input value={form.subject} onChange={set("subject")} className="rounded-none mt-1.5" data-testid="contact-subject" placeholder="Project enquiry" />
              </div>
            </div>
            <div className="mt-5">
              <Label className="text-xs uppercase tracking-wider">Message</Label>
              <Textarea required value={form.message} onChange={set("message")} rows={5} className="rounded-none mt-1.5" data-testid="contact-message" placeholder="Tell us about your requirement..." />
            </div>
            <Button type="submit" disabled={loading} className="rounded-none bg-signal hover:bg-signal/90 text-white h-12 px-8 mt-6 gap-2" data-testid="contact-submit">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
