# PRD — Apex Industrial Engineering Solutions

## Original Problem Statement
Modern, mobile-friendly portfolio + business website for "Apex Industrial Engineering Solutions" — an
AI-enabled industrial engineering & automation consultancy in Ulwe, Navi Mumbai, India
(email: apex.engg146@gmail.com). Goals: attract global customers, take online/offline projects,
build a customer database, and provide an internal admin dashboard (projects, revenue, analytics).
Includes service catalog with categories, cart/checkout via proposal flow, contact with map, customer
accounts, and Excel export of all online project details for accounting.

## User Choices
- Payments: DEFERRED for v1 — using Request Proposal / Quote flow ("do not connect for now").
- Auth: Google SSO DEFERRED — JWT email/password auth implemented now.
- Map: embedded Google Maps iframe (no API key).
- Branding: agent-decided modern industrial Swiss/high-contrast design (Cabinet Grotesk + IBM Plex Sans, Slate + Signal Orange).

## Architecture
- Frontend: React 19 (CRA/craco), react-router v7, Tailwind, shadcn/ui, framer-motion, recharts, sonner.
- Backend: FastAPI (/api prefix), Motor/MongoDB, JWT (PyJWT) + bcrypt, openpyxl for Excel export.
- Auth: JWT token in localStorage (Bearer) + httpOnly cookie. Roles: admin, customer. Admin seeded on startup.

## Core Requirements (static)
- Marketing site: Home, Services (categories, real images, add-to-cart), Projects, Contact (map).
- Service selection cart → Request Proposal (checkout) → reference number, online/offline project type.
- Customer accounts: signup/login, dashboard with order/proposal history & loyalty points field.
- Admin dashboard: analytics (revenue, projects, top services, monthly, retention), projects management
  (status tracking pending/in-progress/delivered/cancelled, filters, edit quote, delete), customer
  database (new/repeat, spend), services CRUD, Export ALL projects to Excel (.xlsx download).
- SEO: branded title/description/keywords for local search.

## Implemented (2026-06)
- Full marketing site + cart + proposal flow + contact with embedded map.
- JWT auth (admin seeded: apex.engg146@gmail.com), customer signup/login, customer dashboard.
- Admin: overview charts, projects management with filters & edit/delete, customers, services CRUD, Excel export.
- 21 seeded services across 4 categories with images.
- Tested: 20/20 backend pytest pass; all critical frontend e2e flows pass (iteration_1.json).

## Backlog (prioritized)
- P0 (when user is ready to "connect"): Google SSO (Emergent-managed), live payments (Razorpay UPI/cards).
- P1: Phone OTP (Twilio), saved addresses UI, email notifications (Resend/SendGrid) on new proposals.
- P1: AI project-scope assistant (Emergent LLM key) to auto-draft scope from client input.
- P2: Customer profile edit UI, loyalty points logic, admin contacts inbox UI, PDF proposal generation,
  customer CSV export, aggregation pipeline for admin_customers (remove N+1).

## Next Tasks
- Confirm with user whether to connect payments + Google SSO next, then implement P0 items.
