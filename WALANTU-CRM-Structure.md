# WALANTU CRM — Complete Structure & Implementation Guide

> **What is this document?**
> This is the full blueprint for building a CRM (Customer Relationship Management) system for the WALANTU Trade Services web app. It covers every database table, every page/screen, every feature, and step-by-step instructions on how to connect it to your existing site and host it — all written so a beginner can follow along.

---

## Table of Contents

1. [What the CRM Does (Plain English)](#1-what-the-crm-does)
2. [Tech Stack](#2-tech-stack)
3. [Database Schema (All Tables)](#3-database-schema)
4. [CRM Pages & Features](#4-crm-pages--features)
5. [Spreadsheet Export System](#5-spreadsheet-export-system)
6. [Connecting the CRM to the WALANTU Web App](#6-connecting-the-crm-to-the-walantu-web-app)
7. [Hosting Options (Step by Step)](#7-hosting-options)
8. [Build Order (What to Code First)](#8-build-order)
9. [Cursor + Claude Code Workflow](#9-cursor--claude-code-workflow)
10. [Security Checklist](#10-security-checklist)

---

## 1. What the CRM Does

Think of the CRM as the **brain behind the WALANTU business**. While the main website is what customers see (booking a plumber, paying for a job), the CRM is what your staff and admins use behind the scenes to:

- See every customer and their full history
- Track every job from the moment it's booked until the guarantee expires
- Manage tradespeople (electricians, plumbers, etc.) — who's available, their skills, ratings, pay
- Handle payments, refunds, escrow releases
- Manage parts, materials and inventory
- Log every message, call, and email
- Generate reports and export data to spreadsheets
- Handle complaints, disputes, and insurance claims
- Track the 3-month workmanship guarantee and any extensions

**The existing `admin.html` page in your project will become the entry point to this CRM.** Everything below expands on that page.

---

## 2. Tech Stack

Since your existing site uses plain HTML/CSS/JS, the CRM will be built as a **separate Next.js application** that shares the same Supabase database. This keeps things modern and manageable.

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (React) + Tailwind CSS | Fast to build, great for dashboards |
| Backend / API | Next.js API Routes | No separate server needed |
| Database | Supabase (PostgreSQL) | You already use it — same database |
| Authentication | Supabase Auth (role-based) | Admins, managers, dispatchers, accounts |
| File Storage | Supabase Storage | Inspection photos, documents, receipts |
| Real-time | Supabase Realtime | Live job updates, new booking alerts |
| Export | SheetJS (xlsx) library | Generate Excel/CSV files in the browser |
| Hosting | Vercel (CRM frontend) | Free tier, instant deploys |

---

## 3. Database Schema

Below is every table you need. Each table shows its columns, what type of data they hold, and what they connect to.

> **How to read this:** `id (UUID, PK)` means the column is called `id`, it stores a UUID (a long unique code), and it's the Primary Key (the unique identifier for each row).
> `→ customers.id` means this column links to the `id` column in the `customers` table.

---

### 3.1 — People

#### `customers`
Stores every person who books a service.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | Auto-generated unique ID |
| first_name | TEXT | Required |
| last_name | TEXT | Required |
| email | TEXT, UNIQUE | Login email |
| phone | TEXT | +233 format |
| ghana_post_gps | TEXT | e.g. GA-144-8765 |
| neighbourhood | TEXT | e.g. East Legon, Labone |
| address_line | TEXT | Street/house description |
| city | TEXT | Default: Accra |
| profile_photo_url | TEXT | Link to Supabase Storage |
| preferred_payment | TEXT | 'card', 'mtn_momo', 'vodafone_cash', 'airteltigo' |
| momo_number | TEXT | Mobile money number if applicable |
| notes | TEXT | Internal admin notes about this customer |
| is_active | BOOLEAN | Soft-delete flag (TRUE = active) |
| created_at | TIMESTAMPTZ | Auto-set on creation |
| updated_at | TIMESTAMPTZ | Auto-set on update |

#### `tradespeople`
Every professional on the platform.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| first_name | TEXT | |
| last_name | TEXT | |
| email | TEXT, UNIQUE | |
| phone | TEXT | +233 format |
| photo_url | TEXT | Profile photo |
| services | TEXT[] | Array: ['electrician', 'plumber'] |
| primary_service | TEXT | Main skill |
| ghana_post_gps | TEXT | Their base location |
| neighbourhood | TEXT | Area they cover |
| coverage_radius_km | INTEGER | How far they'll travel |
| id_type | TEXT | 'ghana_card', 'passport', 'voter_id' |
| id_number | TEXT | Encrypted |
| id_verified | BOOLEAN | Background check passed |
| license_number | TEXT | Trade license if applicable |
| license_expiry | DATE | |
| avg_rating | DECIMAL(3,2) | Calculated from reviews, 0.00–5.00 |
| total_jobs_completed | INTEGER | Running count |
| availability_status | TEXT | 'available', 'on_job', 'off_duty', 'suspended' |
| pay_rate_type | TEXT | 'hourly', 'per_job', 'commission' |
| pay_rate_amount | DECIMAL(10,2) | In GH₵ |
| bank_name | TEXT | For payouts |
| bank_account | TEXT | Encrypted |
| momo_provider | TEXT | MTN, Vodafone, AirtelTigo |
| momo_number | TEXT | For payouts |
| emergency_contact_name | TEXT | |
| emergency_contact_phone | TEXT | |
| notes | TEXT | Internal notes |
| is_active | BOOLEAN | |
| joined_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

#### `admin_users`
Staff who log into the CRM.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| email | TEXT, UNIQUE | |
| full_name | TEXT | |
| role | TEXT | 'super_admin', 'manager', 'dispatcher', 'accountant', 'support' |
| permissions | JSONB | Granular access: { can_refund: true, can_delete: false, … } |
| is_active | BOOLEAN | |
| last_login | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

---

### 3.2 — Jobs & Bookings

#### `jobs`
The core table — every service request lives here.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| job_number | TEXT, UNIQUE | Human-readable: WAL-2025-00001 |
| customer_id | UUID, FK | → customers.id |
| tradesperson_id | UUID, FK | → tradespeople.id (NULL until assigned) |
| assigned_by | UUID, FK | → admin_users.id |
| service_type | TEXT | 'electrician', 'plumber', etc. |
| title | TEXT | Short description: "Fix kitchen tap" |
| description | TEXT | Full details from customer |
| priority | TEXT | 'low', 'normal', 'high', 'emergency' |
| status | TEXT | See status list below |
| ghana_post_gps | TEXT | Job location |
| neighbourhood | TEXT | |
| address_line | TEXT | |
| preferred_date | DATE | Customer's requested date |
| preferred_time_slot | TEXT | 'morning', 'afternoon', 'evening' |
| scheduled_date | DATE | Confirmed date |
| scheduled_time | TIME | Confirmed time |
| started_at | TIMESTAMPTZ | When tradesperson began |
| completed_at | TIMESTAMPTZ | When marked complete |
| customer_approved_at | TIMESTAMPTZ | When customer signed off |
| estimated_duration_hrs | DECIMAL(4,1) | |
| actual_duration_hrs | DECIMAL(4,1) | |
| quoted_amount | DECIMAL(10,2) | Initial quote in GH₵ |
| final_amount | DECIMAL(10,2) | After adjustments |
| parts_cost | DECIMAL(10,2) | Total materials cost |
| labour_cost | DECIMAL(10,2) | |
| discount_amount | DECIMAL(10,2) | |
| discount_reason | TEXT | |
| cancellation_reason | TEXT | |
| cancelled_by | TEXT | 'customer', 'tradesperson', 'admin' |
| cancelled_at | TIMESTAMPTZ | |
| guarantee_start | DATE | Usually = completed_at date |
| guarantee_end | DATE | Usually = guarantee_start + 3 months |
| guarantee_extended | BOOLEAN | |
| guarantee_extension_months | INTEGER | |
| insurance_opted_in | BOOLEAN | |
| insurance_policy_id | TEXT | |
| source | TEXT | 'website', 'phone', 'walk_in', 'referral' |
| referral_code | TEXT | |
| internal_notes | TEXT | Staff-only notes |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**Job Status Flow:**

```
booking_received → confirmed → tradesperson_assigned → en_route →
in_progress → pending_parts → work_resumed → completed →
pending_approval → approved → guarantee_active → guarantee_expired

At any point: → cancelled, → on_hold, → disputed
```

#### `job_status_history`
Every status change is logged — full audit trail.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| job_id | UUID, FK | → jobs.id |
| old_status | TEXT | |
| new_status | TEXT | |
| changed_by | UUID | → admin_users.id or customers.id |
| changed_by_type | TEXT | 'admin', 'customer', 'tradesperson', 'system' |
| reason | TEXT | Optional note about why |
| created_at | TIMESTAMPTZ | |

#### `job_assignments`
Tracks who was assigned to a job (including re-assignments).

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| job_id | UUID, FK | → jobs.id |
| tradesperson_id | UUID, FK | → tradespeople.id |
| assigned_by | UUID, FK | → admin_users.id |
| assignment_type | TEXT | 'initial', 'reassignment', 'backup' |
| reason | TEXT | Why assigned or reassigned |
| accepted | BOOLEAN | Did tradesperson accept? |
| accepted_at | TIMESTAMPTZ | |
| declined_reason | TEXT | If they declined |
| is_current | BOOLEAN | TRUE = currently active assignment |
| created_at | TIMESTAMPTZ | |

---

### 3.3 — Payments & Finance

#### `payments`
Every financial transaction.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| job_id | UUID, FK | → jobs.id |
| customer_id | UUID, FK | → customers.id |
| payment_number | TEXT, UNIQUE | PAY-2025-00001 |
| amount | DECIMAL(10,2) | In GH₵ |
| currency | TEXT | Default: 'GHS' |
| payment_method | TEXT | 'stripe_card', 'mtn_momo', 'vodafone_cash', 'airteltigo', 'cash', 'bank_transfer' |
| payment_type | TEXT | 'deposit', 'full_payment', 'final_balance', 'refund', 'penalty' |
| status | TEXT | 'pending', 'processing', 'held_in_escrow', 'released', 'completed', 'failed', 'refunded', 'partially_refunded' |
| stripe_payment_id | TEXT | Stripe transaction reference |
| momo_transaction_id | TEXT | Mobile money reference |
| momo_phone | TEXT | Phone used for MoMo payment |
| escrow_held_at | TIMESTAMPTZ | When funds were held |
| escrow_released_at | TIMESTAMPTZ | When released to tradesperson |
| escrow_released_by | UUID, FK | → admin_users.id |
| refund_amount | DECIMAL(10,2) | |
| refund_reason | TEXT | |
| refunded_by | UUID, FK | → admin_users.id |
| refunded_at | TIMESTAMPTZ | |
| receipt_url | TEXT | Link to generated receipt |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

#### `tradesperson_payouts`
Paying tradespeople for completed work.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| tradesperson_id | UUID, FK | → tradespeople.id |
| job_id | UUID, FK | → jobs.id (NULL for batch payouts) |
| amount | DECIMAL(10,2) | |
| payout_method | TEXT | 'bank_transfer', 'momo' |
| status | TEXT | 'pending', 'processing', 'completed', 'failed' |
| reference | TEXT | Bank or MoMo transaction reference |
| processed_by | UUID, FK | → admin_users.id |
| processed_at | TIMESTAMPTZ | |
| period_start | DATE | Pay period start |
| period_end | DATE | Pay period end |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | |

#### `invoices`
Generated invoices for customers.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| invoice_number | TEXT, UNIQUE | INV-2025-00001 |
| job_id | UUID, FK | → jobs.id |
| customer_id | UUID, FK | → customers.id |
| subtotal | DECIMAL(10,2) | |
| tax_amount | DECIMAL(10,2) | VAT/NHIL if applicable |
| discount_amount | DECIMAL(10,2) | |
| total | DECIMAL(10,2) | |
| status | TEXT | 'draft', 'sent', 'paid', 'overdue', 'cancelled', 'void' |
| due_date | DATE | |
| sent_at | TIMESTAMPTZ | |
| paid_at | TIMESTAMPTZ | |
| pdf_url | TEXT | Link to stored PDF |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

#### `invoice_line_items`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| invoice_id | UUID, FK | → invoices.id |
| description | TEXT | "Labour — 3 hours electrician" |
| quantity | DECIMAL(10,2) | |
| unit_price | DECIMAL(10,2) | |
| total | DECIMAL(10,2) | |
| item_type | TEXT | 'labour', 'parts', 'travel', 'other' |

---

### 3.4 — Parts & Materials

#### `parts_inventory`
Track materials and stock.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| name | TEXT | "15A Circuit Breaker" |
| category | TEXT | 'electrical', 'plumbing', 'painting', 'general', etc. |
| sku | TEXT, UNIQUE | Internal stock code |
| unit | TEXT | 'piece', 'metre', 'litre', 'kg', 'box' |
| unit_cost | DECIMAL(10,2) | Cost to WALANTU |
| markup_percent | DECIMAL(5,2) | Markup when charging customer |
| selling_price | DECIMAL(10,2) | Price to customer |
| stock_quantity | INTEGER | Current stock |
| reorder_level | INTEGER | Alert when stock drops below this |
| supplier | TEXT | |
| supplier_phone | TEXT | |
| is_active | BOOLEAN | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

#### `job_parts`
Parts used on a specific job.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| job_id | UUID, FK | → jobs.id |
| part_id | UUID, FK | → parts_inventory.id (NULL if ad-hoc) |
| description | TEXT | For ad-hoc parts not in inventory |
| quantity | DECIMAL(10,2) | |
| unit_cost | DECIMAL(10,2) | |
| total_cost | DECIMAL(10,2) | |
| charged_to_customer | BOOLEAN | |
| added_by | UUID, FK | → admin_users.id or tradespeople.id |
| added_by_type | TEXT | 'admin', 'tradesperson' |
| receipt_photo_url | TEXT | Photo of purchase receipt |
| created_at | TIMESTAMPTZ | |

---

### 3.5 — Communication

#### `messages`
All communications — internal and customer-facing.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| job_id | UUID, FK | → jobs.id (NULL for general messages) |
| sender_id | UUID | |
| sender_type | TEXT | 'customer', 'tradesperson', 'admin', 'system' |
| recipient_id | UUID | |
| recipient_type | TEXT | 'customer', 'tradesperson', 'admin' |
| channel | TEXT | 'in_app', 'sms', 'email', 'phone_call', 'whatsapp' |
| subject | TEXT | |
| body | TEXT | |
| attachments | JSONB | [{url, filename, type}] |
| is_read | BOOLEAN | |
| read_at | TIMESTAMPTZ | |
| is_internal | BOOLEAN | TRUE = admin-only, not visible to customer |
| created_at | TIMESTAMPTZ | |

#### `phone_call_logs`
Log of all phone interactions.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| job_id | UUID, FK | → jobs.id |
| caller_type | TEXT | 'customer', 'tradesperson', 'admin' |
| caller_id | UUID | |
| called_number | TEXT | |
| direction | TEXT | 'inbound', 'outbound' |
| duration_seconds | INTEGER | |
| summary | TEXT | What was discussed |
| logged_by | UUID, FK | → admin_users.id |
| created_at | TIMESTAMPTZ | |

#### `notifications`
System-generated alerts.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| recipient_id | UUID | |
| recipient_type | TEXT | 'customer', 'tradesperson', 'admin' |
| type | TEXT | 'job_update', 'payment', 'reminder', 'alert', 'system' |
| title | TEXT | |
| body | TEXT | |
| link | TEXT | Deep-link into CRM or customer app |
| is_read | BOOLEAN | |
| read_at | TIMESTAMPTZ | |
| channel | TEXT | 'push', 'sms', 'email' |
| sent_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

---

### 3.6 — Reviews, Complaints & Disputes

#### `reviews`
Customer ratings after a job.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| job_id | UUID, FK | → jobs.id |
| customer_id | UUID, FK | → customers.id |
| tradesperson_id | UUID, FK | → tradespeople.id |
| rating | INTEGER | 1–5 |
| punctuality_rating | INTEGER | 1–5 |
| quality_rating | INTEGER | 1–5 |
| communication_rating | INTEGER | 1–5 |
| value_rating | INTEGER | 1–5 |
| comment | TEXT | |
| admin_response | TEXT | Public response from WALANTU |
| is_published | BOOLEAN | Moderation flag |
| flagged | BOOLEAN | Flagged for review |
| flag_reason | TEXT | |
| created_at | TIMESTAMPTZ | |

#### `complaints`
Formal complaints and issue tracking.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| complaint_number | TEXT, UNIQUE | CMP-2025-00001 |
| job_id | UUID, FK | → jobs.id |
| customer_id | UUID, FK | → customers.id |
| tradesperson_id | UUID, FK | → tradespeople.id |
| category | TEXT | 'quality', 'lateness', 'damage', 'behaviour', 'billing', 'no_show', 'other' |
| severity | TEXT | 'low', 'medium', 'high', 'critical' |
| description | TEXT | |
| status | TEXT | 'open', 'investigating', 'awaiting_response', 'resolved', 'escalated', 'closed' |
| resolution | TEXT | What was done to fix it |
| resolved_by | UUID, FK | → admin_users.id |
| resolved_at | TIMESTAMPTZ | |
| compensation_amount | DECIMAL(10,2) | If any refund/credit given |
| compensation_type | TEXT | 'refund', 'credit', 'free_service', 'none' |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

#### `disputes`
Payment or escrow disputes.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| dispute_number | TEXT, UNIQUE | DSP-2025-00001 |
| job_id | UUID, FK | → jobs.id |
| payment_id | UUID, FK | → payments.id |
| raised_by | UUID | |
| raised_by_type | TEXT | 'customer', 'tradesperson' |
| reason | TEXT | |
| evidence_urls | JSONB | Photos, screenshots |
| status | TEXT | 'open', 'under_review', 'mediation', 'resolved_customer', 'resolved_tradesperson', 'split', 'escalated_external' |
| outcome_notes | TEXT | |
| resolved_by | UUID, FK | → admin_users.id |
| resolved_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

---

### 3.7 — Inspections & Guarantees

#### `inspections`
Before/after inspection records.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| job_id | UUID, FK | → jobs.id |
| inspection_type | TEXT | 'pre_work', 'post_work', 'guarantee_claim', 'quality_check' |
| inspector_id | UUID | → tradespeople.id or admin_users.id |
| inspector_type | TEXT | 'tradesperson', 'admin', 'third_party' |
| findings | TEXT | |
| passed | BOOLEAN | |
| photos | JSONB | [{url, caption, taken_at}] |
| customer_signature_url | TEXT | Digital signature image |
| customer_signed_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

#### `guarantee_claims`
When a customer invokes the 3-month guarantee.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| claim_number | TEXT, UNIQUE | GC-2025-00001 |
| job_id | UUID, FK | → jobs.id |
| customer_id | UUID, FK | → customers.id |
| description | TEXT | What went wrong |
| photos | JSONB | Evidence photos |
| status | TEXT | 'submitted', 'reviewing', 'approved', 'repair_scheduled', 'repaired', 'denied', 'closed' |
| denial_reason | TEXT | If denied |
| repair_job_id | UUID, FK | → jobs.id (the new fix-it job) |
| reviewed_by | UUID, FK | → admin_users.id |
| reviewed_at | TIMESTAMPTZ | |
| cost_to_company | DECIMAL(10,2) | Cost of the guarantee repair |
| created_at | TIMESTAMPTZ | |

#### `insurance_claims`
When optional insurance is used.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| job_id | UUID, FK | → jobs.id |
| customer_id | UUID, FK | → customers.id |
| policy_id | TEXT | Insurance policy reference |
| incident_description | TEXT | |
| damage_amount | DECIMAL(10,2) | |
| claim_amount | DECIMAL(10,2) | |
| status | TEXT | 'filed', 'processing', 'approved', 'paid_out', 'denied' |
| photos | JSONB | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### 3.8 — Scheduling & Availability

#### `tradesperson_schedules`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| tradesperson_id | UUID, FK | → tradespeople.id |
| date | DATE | |
| start_time | TIME | |
| end_time | TIME | |
| is_available | BOOLEAN | |
| block_reason | TEXT | 'leave', 'sick', 'training', 'personal' |
| job_id | UUID, FK | → jobs.id (if blocked by a job) |
| created_at | TIMESTAMPTZ | |

#### `service_areas`
Which neighbourhoods each tradesperson covers.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| tradesperson_id | UUID, FK | → tradespeople.id |
| neighbourhood | TEXT | |
| is_primary | BOOLEAN | Home turf vs. willing to travel |

---

### 3.9 — System & Settings

#### `system_settings`

| Column | Type | Notes |
|--------|------|-------|
| key | TEXT, PK | e.g. 'default_guarantee_months', 'escrow_hold_days' |
| value | TEXT | |
| description | TEXT | |
| updated_by | UUID, FK | → admin_users.id |
| updated_at | TIMESTAMPTZ | |

#### `audit_log`
Every important action in the system.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| user_id | UUID | |
| user_type | TEXT | 'admin', 'customer', 'tradesperson', 'system' |
| action | TEXT | 'create', 'update', 'delete', 'login', 'export', 'refund', etc. |
| entity_type | TEXT | 'job', 'payment', 'customer', etc. |
| entity_id | UUID | |
| old_values | JSONB | Previous state |
| new_values | JSONB | New state |
| ip_address | TEXT | |
| user_agent | TEXT | |
| created_at | TIMESTAMPTZ | |

#### `referral_codes`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID, PK | |
| code | TEXT, UNIQUE | e.g. 'FRIEND50' |
| discount_type | TEXT | 'percentage', 'fixed' |
| discount_value | DECIMAL(10,2) | |
| max_uses | INTEGER | |
| current_uses | INTEGER | |
| valid_from | DATE | |
| valid_until | DATE | |
| is_active | BOOLEAN | |
| created_by | UUID, FK | → admin_users.id |
| created_at | TIMESTAMPTZ | |

---

## 4. CRM Pages & Features

### 4.1 — Dashboard (Home)

**What it shows:** A real-time snapshot of the business at a glance.

- **Today's Numbers**: New bookings, jobs in progress, jobs completed, revenue
- **Alerts Panel**: Overdue jobs, unassigned bookings, expiring guarantees, low stock parts, payment failures
- **Revenue Chart**: Daily/weekly/monthly revenue line graph
- **Job Status Breakdown**: Pie chart of jobs by status
- **Tradesperson Utilisation**: Bar chart — who's busy, who's free
- **Recent Activity Feed**: Live stream of latest actions (new bookings, payments, messages)
- **Quick Actions**: Buttons for "New Booking", "Assign Job", "Process Refund"

---

### 4.2 — Customers

- **Customer List**: Searchable, filterable table (name, email, phone, neighbourhood, total jobs, total spent)
- **Customer Profile Page**: Full history — jobs, payments, messages, reviews, complaints, addresses
- **Add/Edit Customer**: Form with all fields from customers table
- **Merge Duplicates**: Tool to combine two customer records
- **Bulk Actions**: Email, SMS, export selected
- **Filters**: By neighbourhood, spend level, last active, registration date

---

### 4.3 — Jobs

- **Job Board**: Kanban view (drag-and-drop cards between status columns)
- **Job List**: Table view with sort/filter on every column
- **Job Detail Page**:
  - Status badge and timeline
  - Customer info panel
  - Assigned tradesperson panel
  - Parts & materials used
  - Photos (before/after)
  - Payment summary
  - Communication log
  - Status change buttons ("Assign", "Start", "Complete", "Approve")
  - Guarantee info
  - Print/export job sheet
- **New Job Form**: Multi-step — customer select, service type, location, date, priority, notes
- **Assignment Panel**: Suggest available tradespeople by skill + location + rating
- **Calendar View**: See all jobs on a calendar
- **Map View**: Jobs plotted on Accra map by Ghana Post GPS

---

### 4.4 — Tradespeople

- **Tradesperson List**: Table with photo, name, services, rating, status, active jobs count
- **Tradesperson Profile Page**: Skills, documents, ratings, job history, earnings, availability calendar, performance stats
- **Add/Edit Tradesperson**: Full form including ID verification, banking details (admin-only view)
- **Performance Dashboard**: Average rating trend, completion rate, punctuality, complaint ratio
- **Availability Calendar**: See/edit their schedule, block time off
- **Payout History**: All payments made to them

---

### 4.5 — Payments & Finance

- **Payment List**: All transactions, filterable by status, method, date range
- **Escrow Dashboard**: Payments currently held, ready for release, flagged
- **Release Escrow**: One-click with confirmation for approved jobs
- **Refund Processor**: Select payment → enter amount → reason → confirm
- **Tradesperson Payouts**: Batch or individual payout processing
- **Invoice Manager**: Create, send, track invoices
- **Revenue Reports**: By day, week, month, year — by service type, by neighbourhood
- **Payment Method Breakdown**: How customers are paying (Stripe vs MoMo vs cash)
- **Outstanding Balances**: Customers with unpaid amounts
- **Failed Payments**: Retry or follow up on failed transactions

---

### 4.6 — Parts & Inventory

- **Inventory List**: All parts, current stock, reorder alerts
- **Add/Edit Part**: Name, SKU, cost, markup, stock levels
- **Stock Alerts**: Items below reorder level highlighted in red
- **Job Parts Usage**: Which parts went to which jobs
- **Cost Analysis**: Most used parts, highest cost parts, markup revenue
- **Supplier Management**: Contact details, order history

---

### 4.7 — Communication Hub

- **Inbox**: All messages across all channels, sorted by job
- **Compose**: Send email/SMS to customer or tradesperson, linked to a job
- **Templates**: Pre-written messages (booking confirmation, job complete, payment reminder, etc.)
- **Phone Call Logger**: Quick form — who called, duration, summary
- **Bulk Messaging**: Send SMS or email to filtered customer/tradesperson lists

---

### 4.8 — Reviews & Complaints

- **Review Moderation Queue**: New reviews awaiting approval
- **Review List**: All reviews, filter by rating, tradesperson, date
- **Complaint Tracker**: Open complaints, aging, severity
- **Complaint Detail**: Full history, actions taken, resolution
- **Dispute Resolution**: View evidence, assign mediator, record outcome

---

### 4.9 — Guarantees & Insurance

- **Active Guarantees**: Jobs currently within guarantee period
- **Expiring Soon**: Guarantees ending in the next 30 days
- **Guarantee Claims**: Submitted claims, status, linked repair jobs
- **Insurance Claims**: Tracking and status
- **Extend Guarantee**: Add months to existing guarantee

---

### 4.10 — Reports & Analytics

- **Predefined Reports**:
  - Revenue by period (daily, weekly, monthly, yearly)
  - Revenue by service type
  - Revenue by neighbourhood
  - Jobs by status summary
  - Tradesperson performance rankings
  - Customer acquisition (new customers by month)
  - Average job completion time by service
  - Guarantee claim rate
  - Complaint resolution time
  - Payment method popularity
  - Parts cost vs revenue
  - Cancellation analysis
  - Repeat customer rate
  - Referral code effectiveness
- **Custom Report Builder**: Select columns → apply filters → preview → export
- **Scheduled Reports**: Auto-generate and email weekly/monthly reports
- **All reports exportable to spreadsheet** (see Section 5)

---

### 4.11 — Settings

- **System Settings**: Default guarantee period, escrow hold days, working hours, service area
- **Email/SMS Templates**: Edit notification templates
- **Pricing Rules**: Default rates, markup percentages
- **User Management**: Add/edit admin users, assign roles
- **Audit Log Viewer**: Search all system actions
- **Referral Codes**: Create and manage promo codes
- **Integrations**: Stripe keys, MoMo API config, SMS gateway settings

---

## 5. Spreadsheet Export System

Every data table and report in the CRM can be exported to Excel (.xlsx) or CSV.

### How It Works (Technical)

The export system uses **SheetJS** (also called `xlsx`) — a JavaScript library that creates real Excel files in the browser without needing a server.

```
npm install xlsx
```

### Export Feature Specification

#### What Can Be Exported

| Data | Export Name | Sheets/Tabs |
|------|-----------|-------------|
| All customers | customers_export.xlsx | 1 sheet: all customer fields |
| All tradespeople | tradespeople_export.xlsx | 1 sheet: all tradesperson fields |
| All jobs | jobs_export.xlsx | 2 sheets: Jobs Summary + Job Details |
| All payments | payments_export.xlsx | 2 sheets: Payments + Escrow Status |
| Tradesperson payouts | payouts_export.xlsx | 1 sheet |
| Invoices | invoices_export.xlsx | 2 sheets: Invoices + Line Items |
| Parts inventory | inventory_export.xlsx | 1 sheet |
| Parts usage | parts_usage_export.xlsx | 1 sheet: linked to jobs |
| Reviews | reviews_export.xlsx | 1 sheet |
| Complaints | complaints_export.xlsx | 1 sheet |
| Guarantee claims | guarantee_claims_export.xlsx | 1 sheet |
| Communication log | communications_export.xlsx | 1 sheet |
| Audit log | audit_log_export.xlsx | 1 sheet |
| Revenue reports | revenue_report.xlsx | Multiple sheets by period |
| Custom report | custom_report.xlsx | Based on selected columns |
| Full data dump | walantu_full_export.xlsx | All tables as separate sheets |

#### Export Code Pattern

Every list page will have an **"Export" button** in the top-right corner. When clicked:

```javascript
// This is the pattern every export button will use
import * as XLSX from 'xlsx';

function exportToSpreadsheet(data, filename, sheetName) {
  // 1. Create a new workbook
  const workbook = XLSX.utils.book_new();

  // 2. Convert your data array into a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 3. Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 4. Trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// Usage example (on a page listing all jobs):
const jobs = await supabase.from('jobs').select('*');
exportToSpreadsheet(jobs.data, 'jobs_export', 'Jobs');
```

#### Multi-Sheet Export (for full data dump):

```javascript
function exportFullDump(allData) {
  const workbook = XLSX.utils.book_new();

  // Each table becomes its own sheet
  Object.entries(allData).forEach(([tableName, rows]) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, ws, tableName);
  });

  XLSX.writeFile(workbook, 'walantu_full_export.xlsx');
}
```

#### Export Options for Users

Every export dialog will offer:
- **Format**: Excel (.xlsx) or CSV (.csv)
- **Columns**: Select which columns to include
- **Filters**: Export only filtered/visible data or everything
- **Date Range**: Filter by date range before exporting
- **Include Headers**: Toggle column headers on/off

---

## 6. Connecting the CRM to the WALANTU Web App

This is the part many beginners find confusing, so here is a **plain English explanation** followed by step-by-step instructions.

### The Big Picture

Right now you have:
- A **customer-facing website** (your HTML/CSS/JS files) — this is what people see when they visit your site
- A **Supabase database** — this is where all your data lives

You're going to build:
- A **CRM application** (using Next.js) — this is a separate website that only your staff can access

**The connection is the database.** Both the customer website and the CRM read and write to the **same Supabase database**. When a customer books a job on your website, that job appears in the CRM. When an admin assigns a tradesperson in the CRM, the customer sees the update on their dashboard.

```
┌─────────────────────┐         ┌─────────────────────────┐
│  Customer Website    │         │  CRM (Admin Dashboard)  │
│  (HTML/CSS/JS)       │         │  (Next.js + React)      │
│  walantu.com         │         │  crm.walantu.com        │
└────────┬────────────┘         └────────┬────────────────┘
         │                               │
         │  Both read/write to           │
         │  the same database            │
         ▼                               ▼
┌──────────────────────────────────────────┐
│         Supabase (PostgreSQL)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │customers │ │  jobs    │ │ payments │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │messages  │ │ reviews  │ │ parts    │ │
│  └──────────┘ └──────────┘ └──────────┘ │
└──────────────────────────────────────────┘
```

### Step-by-Step Connection Guide

#### Step 1 — Create the CRM Project

Open your terminal (or Cursor's built-in terminal) and run:

```bash
# Create a new Next.js project for the CRM
npx create-next-app@latest walantu-crm

# When it asks you questions, answer:
# ✔ Would you like to use TypeScript? → Yes
# ✔ Would you like to use ESLint? → Yes
# ✔ Would you like to use Tailwind CSS? → Yes
# ✔ Would you like to use `src/` directory? → Yes
# ✔ Would you like to use App Router? → Yes
# ✔ Would you like to customize the import alias? → No

# Go into the new folder
cd walantu-crm

# Install the packages you'll need
npm install @supabase/supabase-js xlsx recharts date-fns
```

#### Step 2 — Connect to Your Existing Supabase

Create a file called `.env.local` in the root of your CRM project:

```bash
# .env.local — NEVER share this file or commit it to GitHub
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find these values:**
1. Go to [supabase.com](https://supabase.com) and open your project
2. Click **Settings** (gear icon) → **API**
3. Copy "Project URL" → that's your `SUPABASE_URL`
4. Copy "anon public" key → that's your `ANON_KEY`
5. Copy "service_role" key → that's your `SERVICE_ROLE_KEY`

> ⚠️ The **service role key** has full access to your database (bypasses security rules). Only use it in server-side code (API routes), never in browser code.

Then create a Supabase client file:

```
src/lib/supabase.ts
```

```typescript
import { createClient } from '@supabase/supabase-js';

// Client-side Supabase (respects Row Level Security)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase (full access — only use in API routes)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

#### Step 3 — Create the Database Tables

Go to your Supabase dashboard → **SQL Editor** → paste and run the SQL to create all the tables from Section 3. Here's an example for the first table:

```sql
-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  ghana_post_gps TEXT,
  neighbourhood TEXT,
  address_line TEXT,
  city TEXT DEFAULT 'Accra',
  profile_photo_url TEXT,
  preferred_payment TEXT CHECK (preferred_payment IN
    ('card', 'mtn_momo', 'vodafone_cash', 'airteltigo')),
  momo_number TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repeat for every table in Section 3
```

> 💡 **Tip:** Use Claude Code in Cursor to generate ALL the SQL at once. Tell it: "Generate SQL CREATE TABLE statements for all tables in the CRM structure document."

#### Step 4 — Set Up Row Level Security (RLS)

RLS is Supabase's way of controlling who can see what data. You need this so that:
- Admin users can read/write everything
- Customer-facing code can only access that customer's own data

```sql
-- Example: Only admins can access the admin view of jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Admin policy (using service_role key bypasses this anyway)
CREATE POLICY "Admins can do everything"
  ON jobs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Customer can only see their own jobs
CREATE POLICY "Customers see own jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());
```

#### Step 5 — Set Up Real-Time Sync

This is what makes the CRM feel "live" — when a customer books on the website, it pops up in the CRM instantly.

In Supabase dashboard → **Database** → **Replication** → Enable replication for the tables you want live updates on (at minimum: `jobs`, `messages`, `payments`).

In your CRM code:

```typescript
// Listen for new bookings in real-time
supabase
  .channel('new-jobs')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'jobs' },
    (payload) => {
      // This fires instantly when a new job is created
      showNotification('New booking received!');
      refreshJobsList();
    }
  )
  .subscribe();
```

#### Step 6 — Set Up Authentication for CRM Staff

In Supabase dashboard → **Authentication** → **Providers** → make sure Email is enabled.

Create admin accounts manually in Supabase Auth, then add their details to the `admin_users` table with the appropriate role.

In your CRM, add a login page that checks if the logged-in user exists in `admin_users`:

```typescript
// On CRM login
const { data: { user } } = await supabase.auth.signInWithPassword({
  email: email,
  password: password,
});

// Check they're actually an admin
const { data: admin } = await supabase
  .from('admin_users')
  .select('*')
  .eq('id', user.id)
  .single();

if (!admin) {
  // Not an admin — kick them out
  await supabase.auth.signOut();
  showError('Access denied');
}
```

---

## 7. Hosting Options

Here are three options, from easiest to most powerful. **For a beginner, go with Option A.**

### Option A — Vercel (Recommended for Beginners)

**Cost:** Free for small projects, paid plans from $20/month for more.
**Difficulty:** ⭐ Easiest

Vercel is made by the same people who made Next.js, so everything "just works."

**Step by step:**

1. **Push your code to GitHub**
   ```bash
   # In your walantu-crm folder
   git init
   git add .
   git commit -m "Initial CRM setup"
   # Create a repo on github.com, then:
   git remote add origin https://github.com/your-username/walantu-crm.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
   - Click **"Add New Project"**
   - Select your `walantu-crm` repository
   - Vercel auto-detects it's a Next.js project
   - **Add your environment variables**: Click "Environment Variables" and add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
     - `SUPABASE_SERVICE_ROLE_KEY` = your service role key
   - Click **Deploy**
   - Wait 1–2 minutes. Done. Your CRM is live at `walantu-crm.vercel.app`

3. **Set up a custom domain (optional)**
   - In Vercel dashboard → your project → **Settings** → **Domains**
   - Add `crm.walantu.com`
   - Vercel will tell you what DNS record to add at your domain registrar
   - Point a CNAME record for `crm` to `cname.vercel-dns.com`
   - Wait a few minutes for DNS to propagate. Free SSL certificate is automatic.

4. **Auto-deploys**
   - Every time you push code to GitHub, Vercel automatically rebuilds and deploys your CRM. No manual steps needed.

### Option B — Render

**Cost:** Free tier available, $7/month for always-on.
**Difficulty:** ⭐⭐ Moderate

Since you already use Render for your background worker, you could host here too.

1. Go to [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repo
4. Build command: `npm run build`
5. Start command: `npm start`
6. Add your environment variables
7. Deploy

> Note: Render's free tier spins down after inactivity (your CRM will be slow to load after periods of no use). Pay $7/month to keep it always-on.

### Option C — Self-Hosted VPS (Advanced)

**Cost:** $5–20/month (DigitalOcean, Hetzner, or Linode).
**Difficulty:** ⭐⭐⭐⭐ Hard for beginners

Only choose this if you need full control. You'll manage your own server, SSL, updates, and backups. Not recommended as a first-time project.

### Domain Setup Summary

| Website | Domain | Host |
|---------|--------|------|
| Customer website | walantu.com | Vercel (current) |
| CRM admin dashboard | crm.walantu.com | Vercel (new) |
| Database | (internal) | Supabase |

---

## 8. Build Order

Don't try to build everything at once. Here's the recommended order:

### Phase 1 — Foundation (Week 1–2)
1. Set up Next.js project with Supabase connection
2. Create all database tables (run SQL)
3. Build CRM login page with admin authentication
4. Build the Dashboard home page with placeholder data
5. Build the Job List page (table view)

### Phase 2 — Core Features (Week 3–4)
6. Job Detail page (full info, status changes)
7. Customer List + Customer Profile pages
8. Tradesperson List + Profile pages
9. New Job / New Booking form
10. Job assignment (suggest tradesperson, assign)

### Phase 3 — Money (Week 5–6)
11. Payments list page
12. Escrow dashboard + release flow
13. Refund processor
14. Invoice generation
15. Tradesperson payouts

### Phase 4 — Communication & Reviews (Week 7–8)
16. Messages inbox (linked to jobs)
17. Phone call logger
18. Reviews moderation
19. Complaints tracker
20. Notification system

### Phase 5 — Advanced Features (Week 9–10)
21. Parts & inventory management
22. Inspection reports with photo uploads
23. Guarantee tracking + claims
24. Insurance claims
25. Calendar and map views

### Phase 6 — Reporting & Polish (Week 11–12)
26. All predefined reports
27. Custom report builder
28. Spreadsheet export on every page
29. Scheduled email reports
30. Audit log viewer
31. Settings pages
32. Mobile responsiveness pass
33. Performance optimisation

---

## 9. Cursor + Claude Code Workflow

Here's how to efficiently build this CRM using Cursor IDE with Claude Code.

### Setting Up Cursor

1. Download Cursor from [cursor.com](https://cursor.com)
2. Open your `walantu-crm` folder in Cursor
3. Open the built-in terminal (`` Ctrl+` `` or `` Cmd+` ``)

### Using Claude Code Effectively

When prompting Claude Code in Cursor, be specific. Here are example prompts for each phase:

**Database setup:**
> "Generate SQL CREATE TABLE statements for these tables: customers, tradespeople, admin_users, jobs, job_status_history, payments. Include all columns from the WALANTU CRM structure document. Add appropriate indexes and foreign key constraints."

**Building a page:**
> "Create a Next.js page at src/app/jobs/page.tsx that displays all jobs from the Supabase 'jobs' table in a sortable, filterable table. Include columns for job_number, customer name, service_type, status, scheduled_date, and final_amount. Add a search bar and status filter dropdown. Use Tailwind CSS for styling."

**Adding export:**
> "Add an 'Export to Excel' button to the jobs list page that uses the SheetJS library to download all currently filtered jobs as an .xlsx file. Include all visible columns and respect the current filter/search state."

### Tips

- Keep this document open in a Cursor tab — you can reference it when prompting Claude Code
- Build one page at a time, test it, then move to the next
- Use Supabase's table viewer to verify data is being saved correctly
- Commit to GitHub after each working feature (Vercel auto-deploys)

---

## 10. Security Checklist

Before going live, make sure you've covered these:

- [ ] CRM is only accessible to admin users (authentication required on every page)
- [ ] Service role key is ONLY used in server-side API routes, never exposed to the browser
- [ ] Row Level Security is enabled on all tables
- [ ] Sensitive fields (bank accounts, ID numbers) are encrypted at rest
- [ ] `.env.local` is in your `.gitignore` (never commit secrets to GitHub)
- [ ] Admin roles are enforced (accountants can't delete jobs, dispatchers can't process refunds)
- [ ] Audit log records every significant action
- [ ] HTTPS is enforced (Vercel does this automatically)
- [ ] Rate limiting on login attempts
- [ ] Session timeout after inactivity (30 minutes recommended)
- [ ] Regular database backups enabled in Supabase (Settings → Database → Backups)
- [ ] Export feature restricted to authorised roles only

---

**You now have the complete blueprint.** Start with Phase 1, use Claude Code in Cursor to build each piece, and refer back to this document as your guide. Every table, every page, and every feature you'll need is described above.

Good luck, Eugene — you've got this! 🔧

---

*Document version: 1.0 — March 2026*
*For: WALANTU Trade Services CRM*
