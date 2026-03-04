# WALANTU Trade Services

African portal for handymen and women — a comprehensive web application for connecting customers with skilled tradespeople in Accra, Ghana.

## Features

### Customer Features
- **Service Booking**: Multi-step form for booking various trade services
- **GhanaPostGPS Integration**: Precise location addressing
- **Mobile Money & Card Payments**: Secure payment processing via Stripe and MTN/Vodafone/AirtelTigo
- **Job Tracking**: Real-time status updates and communication
- **Work Guarantee**: 3-month standard workmanship guarantee with optional extensions
- **User Profiles**: Complete job history and account management
- **Full Dashboard**: Overview, active projects, service history, payments, addresses, insurance, messages, reviews

### CRM Features (`admin.html` → `crm.html`)
- **Role-based access**: Super Admin vs Customer Service agent login
- **Dashboard**: Live stats — total jobs, revenue collected, active jobs, pending assignments
- **Customer panel**: Full customer list with search and slide-in profile detail
- **Jobs panel**: All jobs with status filter (In Progress / Scheduled / Completed / Pending)
- **Parts & Orders**: Every material/part for every job listed with unit price, line total, supplier, delivery status, and per-job subtotals plus grand total. CSV export supported.
- **Messages**: CS-to-CS internal chat + CS-to-customer chat with file attachment support, persisted in localStorage
- **My Activity**: Per-agent action log (views, messages, status updates)
- **CS Team** *(admin only)*: CS agent cards with online status, job counts, activity log modal
- **Reports** *(admin only)*: Revenue by service, jobs by status, CS performance table — all exportable as CSV
- **Settings** *(admin only)*: System config, CRM user management, add-staff modal

### Services Offered
- Electrician
- Plumber
- Carpenter
- AC Technician
- Gardener
- Car Mechanic
- Painter
- Tiler
- General Labour

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Custom Properties (design system via `css/style.css`)
- **Fonts**: Inter (Google Fonts, weights 300–800)
- **Accessibility**: WCAG 2.1 AA compliant, skip links, ARIA labels
- **Responsive Design**: Mobile-first approach
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Payments**: Stripe.js v3 (card) + Ghana Mobile Money (MTN, Vodafone, AirtelTigo)

## Brand & Design

- **Primary colour**: `#E8440A` (Walantu orange-red)
- **Background**: `#FFF8F5` (warm off-white)
- **Design language**: Card-based, clean whites, modern rounded corners
- **Favicon**: `images/logoBlk.png` (black logo mark, used on all pages)
- **Nav logo**: `images/walantu-logo.jpg` (compact logo used in headers/navigation)
- **Full logo**: `images/logoFull.png` (full brand logo, used in footers and brand panels)
- **Hero image**: `images/workers-1.jpg` (homepage hero background)

## Images

| File | Usage |
|------|-------|
| `images/logoFull.png` | Full brand logo — footer, registration brand panel |
| `images/walantu-logo.jpg` | Compact nav logo — all page headers |
| `images/logoBlk.png` | Favicon (all pages) |
| `images/logo.png` | Legacy logo |
| `images/workers-1.jpg` | Homepage hero background |
| `images/workers-2.jpg` | Secondary workers photo |
| `images/workers-3.jpg` | Secondary workers photo |
| `images/workers-4.jpg` | Secondary workers photo |
| `images/workmen.jpg` | Workmen group photo |
| `images/workmen-banner-1.jpg` | Banner image |
| `images/workmen-banner-2.jpg` | Registration brand panel background |
| `images/man-1.jpg` – `man-4.jpg` | Individual worker portraits |
| `images/head-1.jpg`, `head-2.jpg` | Headshots |
| `images/tap-1.jpg` | Plumbing service image |
| `images/Thank-1.jpg`, `Thank-2.jpg` | Thank-you/confirmation images |

## Project Structure

```
walantu web project/
├── index.html          # Homepage — hero, services grid, testimonials, guarantee
├── dashboard.html      # User dashboard — all tabs (overview, projects, payments…)
├── registration.html   # Sign up / sign in with split-panel brand design
├── booking.html        # Multi-step service booking form
├── payment.html        # Stripe + Mobile Money payment page
├── admin.html          # CRM login gateway (staff only)
├── crm.html            # Full CRM single-page app (9 panels, role-based)
├── services.html       # All services listing
├── how-it-works.html   # Process explanation page
├── about.html          # About WALANTU page
├── contact.html        # Contact page
├── terms.html          # Terms & Conditions
├── profile.html        # User profile page
├── css/
│   ├── style.css       # Main design system (CSS custom properties, all components)
│   ├── crm.css         # CRM-specific styles (dark sidebar, chat bubbles, stat cards)
│   └── accessibility.css
├── js/
│   ├── main.js
│   ├── registration.js
│   ├── users.js        # Customer dummy data + auth helpers (walantuLogin, walantuSetSession…)
│   └── crm-data.js     # CRM staff accounts, jobs, parts/orders, messages, activity log
└── images/             # All brand and content images (see table above)
```

## Ghana-Specific Features

- **Ghana Post GPS**: Digital addressing system (format: GA-144-8765) for precise location
- **Mobile Money**: MTN MoMo, Vodafone Cash, AirtelTigo Money with OTP flow
- **Currency**: GH₵ (Ghana Cedis) throughout
- **Phone**: +233 country code prefix
- **Neighbourhoods**: Accra area dropdown (East Legon, Labone, Airport Hills, etc.)

## Demo Credentials

### Customer Portal (`registration.html`)
| Email | Password |
|-------|----------|
| `kofi.mensah@email.com` | `Walantu123!` |

### CRM (`admin.html`)
| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@walantu.com` | `WalantuAdmin#1` |
| CS Agent | `afi.boateng@walantu.com` | `Walantu#CS1` |
| CS Agent | `kweku.asante@walantu.com` | `Walantu#CS2` |

## Key Differentiators

- **3-Month Workmanship Guarantee**: Backed on every job, tracked in dashboard
- **Escrow Payments**: Funds held until customer approves completed work
- **Background-Verified Pros**: Licensed, reference-checked tradespeople only
- **Optional Insurance**: Covers accidental damage during jobs
- **Parts & Orders Tracking**: Every material for every job itemised with pricing, supplier, and delivery status

---

© 2025 WALANTU Trade Services Ltd. Accra, Ghana.
