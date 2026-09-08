# USTAAD SALON OPS (उस्ताद सैलून) — UI/UX Design System & Specification
## Real-Time Salon Monitoring, Queue Management & Automation System (Desktop-First)

---

## 1. Executive Concept & Creative Direction

### 1.1 Brand Identity & Thematic Narrative
* **Brand Name:** **USTAAD SALON OPS (उस्ताद)** — *"Traditional Karigari meets Precision Automation"*
* **Thematic Genre:** **Retro Indian Street Pop-Kitsch × Modern Neo-Brutalism**
* **Inspiration Synthesis:**
  * **Street Verandah Realism:** Sun-baked terracotta brickwork, rolling sky-blue tin shutters, raw wooden benches, outdoor barber chairs under banana foliage, and hand-painted price signboards (`बाल कटिंग ₹25/-`).
  * **Indie Sticker & Pop Culture Collage:** Hand-drawn STD/ISD/PCO enamel signage, Natraj mathematical tins, Frooti tetra-pack greens, vintage Limca/Gold Spot glass soda bottles, matchbox label typography ("Tea-Girl AMCO Safety Matches"), classic auto-rickshaws, and brass gramophones.
  * **Traditional Talismanic Motifs:** Hand-strung *Nimbu-Mirchi* (lemon & 7 green chillies) hanging charms acting as functional status indicators (e.g., live WebSocket telemetry health check and error prevention).
  * **Expressive Street Typography:** Bold Devanagari-Roman fusion lettering inspired by hand-painted Bollywood street posters (*"बॉम्बार्डिक"* / *"हेल Nah"* / *"Dont Touch Honey"* / *"डाइट Coke"*).
* **Target Experience:** Desktop-first high-utility web application serving both **Customers (Live Queue & Automated Booking)** and **Salon Operators / Stylists (Real-Time Station & Roster Monitoring)**.

---

## 2. Design Tokens & Visual Architecture

### 2.1 Color Palette & Token System

The design system employs a **60-30-10 retro chromatic balance** with high-contrast neo-brutalist ink outlines.

| Token Name | Hex Code | Purpose & UI Role | Thematic Inspiration |
| :--- | :--- | :--- | :--- |
| `surface-canvas` | `#F6EFE2` | Primary screen canvas, modal backdrops, parchment ground | Weathered Khadi / Newsprint grain |
| `surface-card` | `#FFFDF9` | Component surfaces, kanban cards, table rows | Fresh cream matchbox inner |
| `border-ink` | `#1C1B1A` | Neo-brutalist container borders (2px solid), outlines, primary text | Deep Indian Fountain Pen Ink |
| `brand-terracotta` | `#D63927` | Primary brand headers, active tabs, high-priority CTAs | Central baked brick shopfront |
| `accent-haldi` | `#F5B82E` | Queue alerts, token highlight pills, badge containers | STD/ISD signage & raw turmeric |
| `accent-shutter-blue` | `#1E75B8` | WebSocket live pulse, customer profile pills, tooltips | Monsoonal painted rolling shop shutters |
| `feedback-limca-green`| `#288D43` | "Open Chair", confirmed booking, refund processed | Retro Limca / Frooti packaging |
| `feedback-mirchi-red` | `#B81D1D` | Urgent delays (>15m), cancellations, queue halt | Sun-dried Kashmiri chillies |
| `accent-chai-buff` | `#E8DAC1` | Table header fills, inactive tabs, subtle dividers | Cutting Chai saucer stoneware |

### 2.2 Typography Hierarchy & Lettering System

Combines hand-lettered Indian retro signboards with high-legibility digital typography for data scanning.

* **Display & Title Typeface:** **Rozha One** / **Yatra One** (Google Fonts)
  * *Style:* Chunky high-contrast serif with Devanagari headline strokes.
  * *Usage:* Screen headers, Brand Logo, major modal titles, milestone banners.
  * *Desktop Scale:*
    * `Display Large (Hero Title)`: `40px / Line-height: 48px / Bold 700`
    * `Display Medium (Page Header)`: `30px / Line-height: 38px / Bold 700`
* **Expressive Kitsch Accents:** **Modak** / **Shrikhand** (Google Fonts)
  * *Usage:* Floating sticker badges, stamp effects ("CANCELLED", "REFUNDED", "VIP GUEST").
* **Functional Data & Queue Counters:** **Space Mono** / **DM Mono**
  * *Style:* Monospaced retro ticketing font.
  * *Usage:* Token Numbers (`#T-108`), Live Countdown Timers (`14m 22s`), Service Prices (`₹250.00`), Phone Numbers.
  * *Scale:* `22px / Line-height: 28px / Weight: 700`
* **Interface Body & Scannable Text:** **Plus Jakarta Sans** / **Inter**
  * *Style:* Clean geometric sans-serif for high-density administrative operations.
  * *Scale:*
    * `Body Large`: `16px / Line-height: 24px / Regular & Medium`
    * `Body Regular`: `14px / Line-height: 20px / Regular & Semi-Bold`
    * `Caption / Micro`: `11px / Line-height: 14px / Medium uppercase (letter-spacing: 0.08em)`

### 2.3 Elevation, Shadows & Borders (Neo-Brutalist Pop)
* **Borders:** Consistent `2px solid #1C1B1A` across all cards, buttons, drawers, and modal sheets.
* **Hard-Edge Drop Shadows:**
  * `elevation-rest`: `3px 3px 0px #1C1B1A`
  * `elevation-hover`: `5px 5px 0px #1C1B1A` (with `-2px, -2px` transform translation)
  * `elevation-active / pressed`: `0px 0px 0px #1C1B1A` (with `+3px, +3px` translation)
* **Texture Overlays:** Micro SVG halftone dot grid (`opacity: 0.04`) applied to main canvas backgrounds to replicate vintage comic and matchbox newsprint offset printing.

---

## 3. UI Iconography & Thematic Doodles (Component Mapping)

| System UI State / Action | Icon / Doodle Representation | Visual Execution & Animation Behavior |
| :--- | :--- | :--- |
| **System Sync / WebSocket Health** | **Nimbu-Mirchi Hanging Charm** | Hanging from top navigation bar. Subtle physics swing on WebSocket ping; turns monochrome if connection drops. |
| **Chair / Station Occupancy** | **Classic Red Barber Hydraulic Chair** | Illustrated isometric chair doodle. Emits retro steam/scissor snip icon when active; tilts backward when free. |
| **Queue Progress / Distance** | **Auto-Rickshaw Meter / Bus Ticket** | Dynamic progress bar styled as an auto meter ticking distance/minutes until the customer's chair is ready. |
| **Booking Confirmation Slip** | **Vintage Matchbox Label ("AMCO Safety")** | Perforated edge card with stamped "BOOKED" seal in deep terracotta ink. |
| **Hot Line / Urgent Notifications** | **Retro PCO Dial Telephone Booth** | Blue metallic telephone box bouncing slightly when an automated delay alert or cancellation occurs. |
| **Refund Guarantee / Audit** | **Natraj Mathematical Geometry Box** | Stamped brass tin container icon indicating mathematically calculated, auditable refund percentages. |
| **Beverage & Waiting Amenities** | **Limca & Gold Spot Glass Bottles** | Toggleable amenity tags on client waiting check-in ("Chai Offered", "Cold Drink Served"). |

---

## 4. Desktop Layout Architecture (1440px Grid System)

Desktop-first layout based on a **12-Column Grid (Gutter: 24px, Margins: 32px)** with dual split-screen functional ergonomics.

```
+-----------------------------------------------------------------------------------------------------------------------+
|  [ USTAAD LOGO ]  [ CHAIR 1: BUSY ] [ CHAIR 2: OPEN ] [ CHAIR 3: BUSY ] [ CHAIR 4: BREAK ]  |  [ NIMBU-PULSE ] [USER] |
+-------------------------------------------------------------+---------------------------------------------------------+
|                                                             |                                                         |
|   LEFT STAGE (Col 1 to 7 - 58% Width)                       |   RIGHT STAGE (Col 8 to 12 - 42% Width)                 |
|   INTERACTIVE SALON FLOOR & OPERATIONS                      |   DYNAMIC TICKET, QUEUE & FAST-BOOKING DOCK             |
|                                                             |                                                         |
|   [ Banner: Shop Open - Morning Roster 08:00 - 20:00 ]      |   +-------------------------------------------------+   |
|                                                             |   | ACTIVE TOKEN TICKET: #A-24                      |   |
|   +-----------------------------------------------------+   |   | Status: 2 Ahead of You (Est. 18 Mins)           |   |
|   | CHAIR STATIONS (Interactive Floor Map)              |   |   | Haircut + Beard Grooming (Stylist: Suresh)      |   |
|   |                                                     |   |   +-------------------------------------------------+   |
|   | [Chair 1: Suresh]   [Chair 2: Ramesh]               |   |                                                         |
|   | Status: Shave (14m) Status: AVAILABLE               |   |   +-------------------------------------------------+   |
|   |                                                     |   |   | INSTANT APPOINTMENT BOOKER                      |   |
|   | [Chair 3: Imran]    [Chair 4: Vicky]                |   |   | 1. Select Specialist Barber                     |   |
|   | Status: Haircut(8m) Status: Sanitizing              |   |   | 2. Choose Service Pack                          |   |
|   +-----------------------------------------------------+   |   | 3. Live Slot Selector (Morning/Afternoon/Eve)   |   |
|                                                             |   |   | [ Confirm & Pay UPI / Cash at Chair ]           |   |
|   +-----------------------------------------------------+   |   +-------------------------------------------------+   |
|   | TARIFF BOARD (Services & Live Durations)            |   |                                                         |
|   | • Royal Shave .......... 20m ....... ₹150           |   |   +-------------------------------------------------+   |
|   | • Ustaad Fade Cut ...... 35m ....... ₹300           |   |   | REFUND & CANCELLATION GUARANTEE                 |   |
|   | • Champi Head Massage .. 15m ....... ₹120           |   |   | 100% refund eligible if cancelled >30m prior    |   |
|   +-----------------------------------------------------+   |   +-------------------------------------------------+   |
+-------------------------------------------------------------+---------------------------------------------------------+
```

---

## 5. Core Operational Workflows & UI Specifications

### 5.1 Customer Live Queue & Dynamic Wait-Time Tracker
* **Real-Time Dynamic Polling:** Connected via WebSocket with graceful HTTP fallback (10s poll).
* **Queue Card Structure (Yellow STD PCO Board Style):**
  * **Header:** High-contrast mustard yellow banner `#F5B82E` with black Devanagari drop shadow: `"आपकी बारी / CURRENT QUEUE"`.
  * **Token Number Callout:** Giant monospaced counter `#DM-08` in `36px Space Mono`.
  * **Smart Queue Estimator:** Uses duration of active services in assigned chair + average 5m buffer to output live countdown clock.
  * **Interactive Actions:** 
    * `[ I am running 5m late ]` -> Notifies stylist via one-click staff banner.
    * `[ Cancel Appointment & Claim Instant Refund ]` -> Triggers structured refund modal.

### 5.2 Stylist & Station Management Dashboard (Operator View)
* **Kanban Chair Station Cards:**
  * Displays barber photo sticker, active customer name, selected service, elapsed progress ring, and real-time revenue tally.
  * **Action Controls:**
    * `[ Finish Service ]` (Green Neo-Button) -> Flips chair to "Cleaning Required" for 3 minutes, then alerts next customer in queue via SMS/WhatsApp webhook.
    * `[ Add Buffer (+5m) ]` -> Automatically recalculates downstream queue wait-times without page reload.
    * `[ Walk-In Quick Add ]` -> Fast-entry modal (Name, Phone, Service) for offline street clients.

### 5.3 Automated Cancellation & Refund Engine
* **Policy Micro-Interface:**
  * Displays a tiered progress bar showing refund guarantee:
    * `> 60 mins before slot`: **100% Instant Refund** (Processed via razorpay/UPI webhook)
    * `30 – 60 mins before slot`: **80% Instant Refund** (20% chair reservation fee retained)
    * `< 30 mins before slot`: **50% Credit Voucher** redeemable within 30 days
  * Stamped Receipt UI: Cancellation screen renders a vintage perforated railway ticket with a prominent angled red rubber stamp: `[ R E F U N D   P R O C E S S E D ]`.

### 5.4 Management Reporting & Salon Activity Analytics
* **Daily Ledger View (Styled after Traditional Bahi-Khata Ledger Books):**
  * **Metrics Bar:** 
    * Total Footfall Today (Walk-ins vs Pre-booked)
    * Total Revenue (Cash vs UPI vs Online Pre-paid)
    * Refund Volume & Cancellation Rate (%)
    * Average Chair Idle Time (Target: <8 mins)
  * **Visual Charting:** Custom dual-axis area chart with Haldi-yellow for revenue spikes and Monsoon-blue for customer volume.

---

## 6. Frontend Implementation Tokens (CSS / Tailwind Specs)

```css
/* Core Retro Indian Pop Variables */
:root {
  --canvas-bg: #F6EFE2;
  --card-surface: #FFFDF9;
  --ink-border: #1C1B1A;
  --brand-vermilion: #D63927;
  --haldi-yellow: #F5B82E;
  --shutter-blue: #1E75B8;
  --limca-green: #288D43;
  --mirchi-red: #B81D1D;
  
  --shadow-hard: 3px 3px 0px var(--ink-border);
  --shadow-hard-hover: 5px 5px 0px var(--ink-border);
  --shadow-hard-active: 0px 0px 0px var(--ink-border);
  
  --font-display: 'Rozha One', 'Yatra One', serif;
  --font-mono: 'Space Mono', monospace;
  --font-body: 'Plus Jakarta Sans', sans-serif;
}

/* Neo-Brutalist Matchbox Card */
.kitsch-card {
  background: var(--card-surface);
  border: 2px solid var(--ink-border);
  box-shadow: var(--shadow-hard);
  border-radius: 4px;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.kitsch-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-hard-hover);
}

/* Primary Action Button (Terracotta / Haldi Accent) */
.btn-kitsch-primary {
  background: var(--brand-vermilion);
  color: #FFFDF9;
  font-family: var(--font-body);
  font-weight: 700;
  border: 2px solid var(--ink-border);
  box-shadow: var(--shadow-hard);
  padding: 10px 20px;
  cursor: pointer;
}

.btn-kitsch-primary:hover {
  background: #C02D1D;
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-hard-hover);
}

.btn-kitsch-primary:active {
  transform: translate(3px, 3px);
  box-shadow: var(--shadow-hard-active);
}
```

---

## 7. Next Steps & Asset Roadmap
1. **Interactive Figma Component Library:** Build reusable master components (Chairs, Tickets, Signboards, Badges).
2. **Dynamic High-Fidelity Desktop Wireframe Prototype:** Connect live booking stepper to mock WebSocket queue pipeline.
3. **Sound Design (Optional Web Audio API):** Add subtle vintage shop bell chime on token advance and scissor snip audio on service completion.
