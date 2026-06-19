import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "@/pages/Home";
import ServicesPage from "@/pages/ServicesPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ContactPage from "@/pages/ContactPage";
import RequestProposal from "@/pages/RequestProposal";
import AuthPage from "@/pages/AuthPage";
import CustomerDashboard from "@/pages/CustomerDashboard";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminServices from "@/pages/admin/AdminServices";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
              <Route path="/services" element={<SiteLayout><ServicesPage /></SiteLayout>} />
              <Route path="/projects" element={<SiteLayout><ProjectsPage /></SiteLayout>} />
              <Route path="/contact" element={<SiteLayout><ContactPage /></SiteLayout>} />
              <Route path="/request" element={<SiteLayout><RequestProposal /></SiteLayout>} />
              <Route path="/auth" element={<SiteLayout><AuthPage /></SiteLayout>} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <SiteLayout><CustomerDashboard /></SiteLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="services" element={<AdminServices />} />
              </Route>
            </Routes>
            <Toaster position="top-right" richColors />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
