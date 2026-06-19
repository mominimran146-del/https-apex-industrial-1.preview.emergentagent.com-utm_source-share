import React from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Hexagon, LayoutDashboard, FolderKanban, Users, Cog, LogOut, Home } from "lucide-react";

const LINKS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/services", label: "Services", icon: Cog },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-col fixed h-screen">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800">
          <div className="h-8 w-8 bg-signal flex items-center justify-center">
            <Hexagon className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <span className="font-heading font-black tracking-tight">APEX</span>
            <span className="block text-[9px] tracking-[0.2em] uppercase text-slate-500 font-bold">Admin Console</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-testid={`admin-nav-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-signal text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white">
            <Home className="h-4 w-4" /> View Website
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white" data-testid="admin-logout">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-slate-900 text-white h-14 flex items-center justify-between px-4 sticky top-0 z-40">
          <span className="font-heading font-black">APEX Admin</span>
          <Button onClick={handleLogout} variant="ghost" size="icon" className="text-white"><LogOut className="h-4 w-4" /></Button>
        </div>
        <div className="lg:hidden bg-white border-b border-slate-200 flex overflow-x-auto">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `px-4 py-3 text-xs font-semibold whitespace-nowrap ${isActive ? "text-signal border-b-2 border-signal" : "text-slate-500"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
