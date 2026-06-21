A complete authentication system featuring user signup, login, password update, forgot password, OTP verification, and secure logout. 
The application is built using Django for the backend and Next.js 14 for the frontend, with PostgreSQL as the database. 
It implements a secure authentication flow using both access and refresh tokens.



# The Heritage Village — Hotel & Event Management System

> القرية الشعبية -١٩٩٨- | *Est. 1998*

A bilingual (English/Arabic, RTL-aware) back-office system for managing a heritage hotel & event venue: halls, event bookings, customers, staff, and role-based access — built with a gold-on-ivory luxury aesthetic.

---

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Backend  | Django + Django REST Framework |
| Frontend | Next.js 14 (App Router) |
| Database | PostgreSQL |
| Auth     | JWT (access + refresh tokens), role-based permissions |

---

## Design Language

- **Palette**: gold `#C6A43F` accent on an ivory/cream base (`#F6F3EC` / `#FBF9F4`), near-black ink text (`#26231D`), soft card shadows, no harsh borders.
- **Typography**: `Cormorant Garamond` (serif) for headings and display numbers, `DM Sans` for body text and UI labels.
- **Layout**: fixed dark sidebar (`#000000` with gold accents) on the left, grouped into **Main** (Dashboard, Halls & Venues, Event Bookings) and **Management** (Customers, Employees, Roles, Reports & Analytics) sections.
- **Components**: rounded cards (16–22px radius), pill-shaped status badges, soft gold-tinted hover states, consistent table/card patterns across every management screen.
- **Bilingual**: full English ↔ Arabic toggle with RTL layout mirroring (sidebar flips, nav borders flip side).

---

## Domain Model

### `user` app — identity, staff, and access control

- **User** — the auth-bearing account (`AbstractBaseUser`). Holds `username` (used as login + email), name, mobile, profile image, and a `type` of `EMPLOYEE` or `CUSTOMER`. Supports invite-by-email account activation, OTP-based password reset, login-attempt lockout, and soft blocking.
- **Employee** — a thin staff wrapper around `User` (one-to-one), tracking onboarding `status`: `INVITED → ACTIVE`, or `DEACTIVATED`. Created via an admin-triggered invitation flow; the invitee sets their own password through an emailed activation link.
- **Role** — a named, reusable permission bundle (e.g. "Event Manager") assigned to employees via FK.
- **Permission** — a granular, module-scoped capability (e.g. `CREATE_HALL`, `DELETE_CUSTOMER`), grouped by `module_label` for UI presentation. Roles hold a many-to-many set of permissions.

### `hotel` app — operations

- **Customer** — a staff-managed guest contact record (no login). Tracks `bookings_count` and `total_spent`, denormalized and recalculated from their booking history.
- **Hall** — a bookable venue (English/Arabic name, capacity, badge, photo, occupancy status, booking count).
- **Booking** — links a `Hall` and `Customer` to an event (type, date, time slot: morning/afternoon/night, status: confirmed/pending/cancelled, total). Auto-generates a human-readable booking code (`B1001`, `B1002`, …) on creation.
- **ActivityLog** — a lightweight feed of system events for the dashboard's "Recent Activity" panel, populated via signals on create/update/delete across the core models.
- **Reports** — Revenue Report and Customer Report are not separate tables; both are computed on demand by filtering `Booking` over a date range and exporting to CSV.

---

## Application Modules (Sidebar)

**Main**
- 📊 **Dashboard** — stat cards, hall utilization, upcoming events, popular halls, recent activity feed.
- 🏛️ **Halls & Venues** — table/card toggle view, create/edit/delete halls, occupancy status, image upload.
- 📅 **Event Bookings** — calendar/list of bookings per hall and customer, status management.

**Management**
- 👥 **Customers** — guest directory, contact info, lifetime bookings & spend, CSV export.
- 👤 **Employees** — staff directory, invite-by-email onboarding, role assignment, activate/deactivate, CSV export.
- 🛡️ **Roles** — permission-bundle management, grouped permission picker by module, CSV export.
- 📈 **Reports & Analytics** — date-ranged revenue and customer activity reports, CSV export.

---

## Core Conventions

- All primary models use soft-delete (`deleted` flag) rather than hard deletion, except where a relationship makes hard deletion intentional (e.g. removing an Employee also removes their linked User account).
- Destructive actions are guarded server-side where real data depends on them — a Hall with active bookings, a Customer with bookings, or a Role with assigned users cannot be deleted, and the API returns a descriptive error instead of failing silently.
- List endpoints are paginated (`limit`/`offset`) and return a consistent envelope: `{ message, count, data }`.
- Every create/update/delete action on staff-facing records triggers a contextual transactional email (invitation, deactivation, deletion, password change).
- The frontend never assumes write endpoints exist that the backend doesn't implement — read-only modules stay read-only until the corresponding API method is added.

---

## Getting Started

> _Add local setup, environment variables, and migration instructions here once finalized._