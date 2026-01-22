Family Fun HK — 1-Page MVP Scope
Summary
Project Type: Web SaaS (Mobile Responsive)
Timeline: ≤ 8 weeks
Goal: Build a commercial-ready MVP for family activity discovery with merchant self-service and
subscription payment

1. Core MVP Objectives
   ●
   ●
   ●
   ●
   ●
   Public users can easily browse & filter family activities
   Merchants can self-submit events
   Admin has full control & approval
   Platform supports subscription payments for merchants
   AI assists in importing event data from URLs
2. User Roles
   Public User (No Login)
   ●
   ●
   ●
   ●
   ●
   Browse events
   Filter by date, time, district, age, price, SEN-friendly
   View event details
   Share event links
   Switch language (TC / EN)
   Merchant (Login Required)
   ●
   Register & log in
   ●
   Submit events manually or via URL
   ●
   View event approval status
   ●
   Subscribe & pay after free trial
   Admin (Login Required)
   ●
   Full event CRUD
   ●
   Approve / reject merchant submissions
   ●
   Manage merchants
   ●
   View analytics
   ●
   Override subscription status if needed
3. Key Features in MVP
   Public Website
   ●
   Homepage with featured events, SEN-friendly, free/subsidized, tourist mode
   ●
   Event listing with filters:
   ○
   Date
   ○
   Time slot (Morning / Afternoon / Evening)
   ○
   District
   ○
   Age group
   ○
   Price (Free / Paid)
   ○
   SEN-friendly
   ●
   Event detail page with map, image, and sharing
   Merchant Portal (MVP Level)
   ●
   Email/password login
   ●
   Dashboard showing:
   ○
   Submitted events
   ○
   Event status (Draft / Submitted / Approved / Rejected)
   ○
   Subscription status
   ●
   Submit event (manual form)
   ●
   AI-assisted URL import:
   ○
   Auto-extract title, image, date, location, description
   ○
   Merchant edits → submit → admin approves
   ●
   Merchants cannot publish directly
   Admin Backend
   ●
   Secure admin login
   ●
   Event CRUD
   ●
   Approval workflow (mandatory)
   ●
   CSV bulk import
   ●
   Basic analytics:
   ○
   Total events
   ○
   ○
   Total page views
   Top 5 events
4. Merchant Subscription & Payment (Core MVP)
   ●
   First 2 months: Free trial
   ●
   From Month 3 onward: Paid monthly subscription required
   ●
   Single plan only (e.g. HKD 180/month, configurable)
   ●
   Monthly recurring billing
   ●
   Payment via Stripe or PayPal
   ●
   Receipt generated (email or PDF)
   Enforcement rules:
   ●
   If not subscribed:
   ○
   Can create drafts
   ○
   Cannot submit or publish events
5. AI URL Import (MVP Scope)
   ●
   Paste public event URL
   ●
   System extracts:
   ○
   Title
   ○
   Image
   ○
   Date
   ○
   Location
   ○
   Short description
   ●
   Rule-based extraction first, AI fallback
   ●
   Human approval required (no auto-publish)
6. Tech Stack (Flexible)
   ●
   Frontend: React / Next.js
   ●
   Backend: Supabase / Firebase
   ●
   Database: PostgreSQL
   ●
   Hosting: Vercel
   ●
   Maps: Google Maps API
   ●
   Payments: Stripe / PayPal
   ●
   AI: Server-side LLM
   Developers may suggest alternatives with justification.
7. Explicitly Out of Scope
   ●
   Native iOS / Android apps
   ●
   Ticketing / booking
   ●
   Public user accounts
   ●
   Reviews / ratings
   ●
   Community chat
   ●
   Push notifications
   ●
   AI recommendations
   ●
   Coupons / refunds
8. Deliverables
   ●
   Live deployed MVP
   ●
   Admin & Merchant portals
   ●
   Subscription payment working
   ●
   No blank pages or critical bugs
   ●
   All source code owned by client
