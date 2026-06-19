import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Hexagon, LayoutDashboard, LogOut, User } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
            <div className="h-9 w-9 bg-slate-900 flex items-center justify-center">
              <Hexagon className="h-5 w-5 text-signal" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <span className="font-heading font-black text-lg tracking-tight text-slate-900">APEX</span>
              <span className="block text-[9px] tracking-[0.25em] uppercase text-slate-500 font-bold">
                Industrial Engg.
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                data-testid={`nav-link-${n.label.toLowerCase()}`}
                className={`text-sm font-medium transition-colors hover:text-signal ${
                  location.pathname === n.to ? "text-signal" : "text-slate-600"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/request" className="relative" data-testid="nav-cart">
              <Button variant="outline" size="icon" className="rounded-none border-slate-300">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-signal text-white text-[10px] h-5 w-5 flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link to={user.role === "admin" ? "/admin" : "/dashboard"} data-testid="nav-dashboard">
                  <Button variant="ghost" className="rounded-none gap-2 text-slate-700">
                    <LayoutDashboard className="h-4 w-4" />
                    {user.role === "admin" ? "Admin" : "Dashboard"}
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="icon" className="rounded-none" data-testid="nav-logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth" data-testid="nav-login">
                <Button variant="ghost" className="rounded-none gap-2 text-slate-700">
                  <User className="h-4 w-4" /> Login
                </Button>
              </Link>
            )}
            <Link to="/request" data-testid="nav-request-proposal">
              <Button className="rounded-none bg-signal hover:bg-signal/90 text-white font-semibold tracking-wide">
                Request for Proposal
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            data-testid="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              data-testid={`nav-mobile-${n.label.toLowerCase()}`}
              className="block py-2 text-slate-700 font-medium"
            >
              {n.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link to={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full rounded-none">
                    {user.role === "admin" ? "Admin Panel" : "My Dashboard"}
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="w-full rounded-none">Logout</Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full rounded-none">Login / Sign up</Button>
              </Link>
            )}
            <Link to="/request" onClick={() => setOpen(false)}>
              <Button className="w-full rounded-none bg-signal hover:bg-signal/90 text-white">Request for Proposal</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
