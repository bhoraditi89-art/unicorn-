# Implementation Plan: Unicorn OS MVP Prototype

Transform the "Unicorn - College Club OS" concept into a production-grade working prototype with core flows: Club Dashboard, Event Creation & Registration, QR Code Ticket & Live Camera Scanner, Dynamic Certificate Generator with Verification link, and Student Extracurricular Passport.

## User Review Required

> [!IMPORTANT]
> **Project Directory:** We will initialize the MVP in `C:\Users\Admin\.gemini\antigravity\scratch\unicorn-os`.
> 
> **MVP Architecture Choice:**
> To let you immediately test and demo this to club leads and college administration without requiring external cloud accounts on day 1:
> - The application will be built as a full-stack Next.js application with Tailwind CSS and Lucide React.
> - It includes an in-memory/localStorage seed dataset representing a real college (*Pune Institute of Computer Technology*) with clubs (*IEEE, Coding Club, SARC*), real events (*AI Workshop 2026*), student profiles (*Aditi Bhor*), and tickets.
> - It includes a direct toggle / drop-in connector for **Supabase PostgreSQL** so you can transition to production in 5 minutes with the exact SQL schema documented in `unicorn_startup_blueprint.md`.

---

## Proposed MVP Features & Milestones

### Phase 1: Core Foundation & UI Shell
- Setup Next.js 14 project in `scratch/unicorn-os` with Tailwind CSS and dark/light campus aesthetic.
- Institutional Branding & Navigation:
  - Global Campus Switcher (*"PICT Pune"*)
  - Role switcher (*Student View*, *Club Lead View*, *College Admin View*) for instant demos.

### Phase 2: Event Lifecycle & Ticketing
- **Public Event Page:** Clean Luma/Partiful-style registration page (`/events/ai-workshop-2026`) with countdown, capacity meter, venue, and 1-click registration.
- **Unique QR Ticket:** Generates a personal entry pass with unique cryptographic nonce and barcode.

### Phase 3: Live QR Attendance Scanner
- **Organizer Mobile Scanner (`/scan`):**
  - Uses the HTML5 Camera API (`html5-qrcode` / `jsQR`) to scan attendee tickets directly from phone screens.
  - Instant validation feedback (Green check + student name/division + audio chime; red for already scanned / invalid).
  - Real-time stats ticker (e.g., 147 Registered $\rightarrow$ 123 Checked In $\rightarrow$ 83.6% Attendance).

### Phase 4: Dynamic Certificate Studio & Public Verification
- **Automated Certificate Engine:**
  - One-click batch generation for all marked "Checked-In" attendees.
  - Generates official certificate with student name, event title, date, signature, and unique certificate hash.
  - Public verification URL (`/verify/[hash]`) simulating external verification with "Add to LinkedIn" button.

### Phase 5: Student Extracurricular Passport & NAAC Report
- **Student Profile (`/@aditi.bhor`):** Extracurricular timeline, verified certificates, leadership badges, and volunteer hours.
- **College Admin NAAC 5.3 Export:** One-click table and CSV download showing event participation metrics formatted for accreditation inspection.

---

## Verification Plan

### Automated & Build Tests
- Execute `npm run build` or `npm run lint` to verify type safety and bundle cleanliness.
- Validate QR generation and scan decoding logic.

### Manual Verification Flows
1. **Event RSVP:** Register as student Aditi Bhor for "AI Workshop 2026" $\rightarrow$ verify ticket QR generated in `/tickets`.
2. **Door Check-in:** Switch to Club Lead view $\rightarrow$ open scanner or simulate ticket scan $\rightarrow$ verify attendance status updates in real-time.
3. **Certificate Generation:** Click "Issue Certificates" $\rightarrow$ verify Aditi's certificate is generated and viewable in `/wallet` and verifiable at `/verify/[hash]`.
4. **Accreditation Export:** Switch to College Admin view $\rightarrow$ verify NAAC Criterion 5.3 summary dashboard.
