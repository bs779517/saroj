# Saroj Fitness & Ayurveda Guide — Runtime Error Resolution & Vector PDF Engine

Eliminate the read-only `window.fetch` startup crash (`TypeError: Cannot set property fetch of #<Window> which has only a getter`) and the `oklch` PDF color-parsing failure, while delivering crisp vector PDF reports (matching the exact 2-column clinical Body Composition card layout) and completing all missing Diet Planner meal plans.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Ready to Apply Fixes**: No application code is modified while the plan is awaiting approval, which is why the `window.fetch` error still appeared in the live preview. Click **Proceed** to immediately apply the `window.fetch` guard, the native vector PDF report engine, and the Diet Planner fixes.

- **Confirmed Priority 1 — Read-Only `window.fetch` Extension Crash Guard**: Install a synchronous pre-hydration guard at the very top of the document `<head>` that converts getter-only `fetch` descriptors on `window` and `Window.prototype` (when configurable) into a safe getter/setter backed by native `fetch`, paired with a capture-phase `error` and `unhandledrejection` boundary that intercepts and silences `Cannot set property fetch` exceptions thrown by injected `chrome-extension://` scripts.
- **Confirmed Priority 2 — Permanent `oklch` PDF Crash Fix & Distinct Vector Reports**:
  - **10xPro Report**: Renders the exact 2-column, 10-card clinical **Body Composition Analysis Report** layout directly as crisp A4 vector graphics (royal blue header banner, darker blue client strip, rounded white cards on light slate, status-colored value pills, normal range text, 3-segment gauge bars with white dividers and circular indicator dots, and Coach Saroj footer).
  - **Smart Report**: Renders a focused 1-page **Executive Wellness Summary** featuring BMI status analysis, current-vs-ideal weight delta, daily calorie/protein/hydration targets, and Coach Saroj's Ayurvedic & Vestige supplement protocol.
- **Confirmed Priority 3 — Placeholder Cleanup & Full Diet Matrix**: Remove broken third-party chat-widget placeholders, replace blocking browser alerts with inline status banners, and populate all 9 **Goal × Diet Type** Indian & Ayurvedic meal plans.

> [!NOTE]
> Browser extensions injected at `document_start` run inside the browser's extension sandbox; our synchronous `<head>` descriptor shim + capture-phase error boundary stops uncaught `chrome-extension://` `fetch` assignment errors from crashing or disrupting application execution and cleans up broken third-party network requests.

---

## 1. Overview & Core Concept

- **What It Does**: Restores error-free startup and one-click PDF health report generation in **Saroj Fitness & Ayurveda Guide**, enabling instant clinical Body Composition PDF downloads on desktop and mobile alongside complete Indian & Ayurvedic nutrition plans.
- **Target Audience / Persona**: Fitness and wellness clients working with Coach Saroj who calculate body composition metrics, download shareable PDF reports for WhatsApp consultations, and follow personalized vegetarian, non-vegetarian, or vegan Indian diet plans.
- **Key Value**: Zero `oklch()` stylesheet crashes during PDF export, protection against browser-extension `window.fetch` setter failures, razor-sharp vector PDFs at a fraction of screenshot file sizes, and complete meal recommendations across every goal and dietary preference.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Resilient App Startup**: On initial load, the synchronous `<head>` guard neutralizes read-only `window.fetch` assignment conflicts from request-intercepting browser extensions and removes dead third-party widget scripts so the landing experience loads cleanly.
  2. **Body Composition Calculation & Dual PDF Export**: Client enters Name, Age, Gender, Phone, Weight (kg), and Height (cm) and clicks **Calculate Composition**. The animated BMI gauge and summary cards update with aligned numerals (`tabular-nums`). Clicking **10xPro Report** or **Smart Report** displays an inline spinner on the clicked button, downloads a crisp A4 PDF immediately, and shows a non-blocking inline confirmation banner.
  3. **Complete Smart Diet Planner**: Client selects any combination of **Goal** (*Weight Loss*, *Muscle Gain*, *Stay Fit*) and **Diet Type** (*Veg*, *Non-Veg*, *Vegan*) to receive a complete 5-meal Indian & Ayurvedic plan, personalized daily calorie and hydration targets, and targeted supplement guidance.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Maintain the dark obsidian-slate (`#0a0a16` / `#0f172a`) and emerald (`#10b981`) web interface, paired with clean clinical light-slate (`#f8fafc`) and royal blue (`#3b82f6` / `#2563eb`) vector styling inside exported PDF documents.
  - *Color Palette & Mood*: Web cards use subtle glass borders (`rgba(255,255,255,0.08)`) with emerald and blue accents; PDF metric cards use explicit RGB semantic badges paired with printed normal ranges—green (`#22c55e` / `#4ade80`) for normal, orange (`#f97316`) for low/borderline, and red (`#ef4444`) for high attention.
  - *Typography & Hierarchy*: Preserve `Sora` display headings and `Inter` body copy on the web with `tabular-nums` across numeric metrics; use crisp proportional vector typography in `jsPDF` so values, units, and reference ranges stay legible at any zoom level.
  - *Component Styling & Layout*: Responsive 1440px max-width sections (`max-w-7xl`), balanced 2-column form-and-result grids, single-line action buttons (`whitespace-nowrap`), and inline feedback banners instead of browser `alert()` dialogs.
- **Interactive Feedback & Motion**:
  - Per-button loading spinners (`Generating PDF...`), inline validation and download confirmation banners, smooth SVG BMI arc transitions, and celebratory confetti on calculation completion.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Synchronous `window.fetch` Descriptor Shim + Capture-Phase Extension Error Filter**
  - *Chosen Approach*: Execute an inline script as the very first element in `<head>` that checks `Object.getOwnPropertyDescriptor` on both `window` and `Window.prototype` for `fetch`. When configurable and getter-only, it redefines `fetch` with a working getter/setter backed by native `fetch.bind(window)` so extension monkey-patching (`window.fetch = ...`) succeeds harmlessly. In parallel, register capture-phase `error` and `unhandledrejection` listeners that call `preventDefault()` / `stopImmediatePropagation()` strictly for `chrome-extension://` or `moz-extension://` `Cannot set property fetch` errors.
  - *Why*: Preview environments expose `window.fetch` via a getter-only property descriptor, causing request-interceptor Chrome extensions to throw an uncaught `TypeError`. Scoping the shim and error filter strictly to `fetch` getter conflicts preserves normal `fetch()` behavior and keeps real application errors visible.
  - *Alternatives Considered*: Ignoring the error was rejected because uncaught extension errors trigger error overlays in preview tools; overriding `fetch` inside application bundle code was rejected because module scripts run too late after `<head>` initialization.
- **Decision 2 — Native `jsPDF` Vector Rendering Over `html2canvas` DOM Capture**
  - *Chosen Approach*: Draw both the **10xPro Report** and **Smart Report** directly onto an A4 `jsPDF` canvas using pure RGB vector shapes (`roundedRect`, `circle`, `line`, `text`, `setFillColor`) and remove `html2canvas` usage entirely.
  - *Why*: Tailwind CSS v4 generates `oklch()` colors in document stylesheets; `html2canvas` parses every stylesheet in the document and crashes on `oklch()`. Pure vector drawing never touches DOM stylesheets, eliminates the crash permanently, produces sharp text and gauges, and works reliably on mobile screens.
  - *Alternatives Considered*: CSS `oklch`-to-RGB stylesheet rewriting prior to `html2canvas` was rejected due to brittle browser computed-style serialization and blurry rasterized PDF output.
- **Decision 3 — Complete 9-Combination Indian & Ayurvedic Nutrition Matrix**
  - *Chosen Approach*: Expand the Diet Planner catalog from 1 combination to all 9 Goal × Diet Type profiles, dynamically calculating daily calorie (Mifflin-St Jeor estimate) and water intake targets from user height and weight while syncing lead submissions non-blockingly.
  - *Why*: Guarantees every user selection produces a complete, authentic 5-meal plan without dead API calls or empty screens.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                 Synchronous Pre-Hydration Guard (<head>)                 │
│  • Configurable getter/setter shim on window.fetch / Window.prototype    │
│  • Capture-phase suppression for chrome-extension:// fetch TypeErrors    │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                 Saroj Fitness & Ayurveda Web Application                 │
├────────────────────────────────────┬─────────────────────────────────────┤
│   Body Composition Analyzer        │        Smart Diet Planner           │
│  ┌──────────────────────────────┐  │  ┌───────────────────────────────┐  │
│  │ Biometric Input & Validation │  │  │ Goal × Diet Preference Form   │  │
│  │ (Name, Age, Sex, Phone, W/H) │  │  │ (Weight Loss / Gain / Fit ×   │  │
│  └──────────────┬───────────────┘  │  │  Veg / Non-Veg / Vegan)       │  │
│                 ▼                  │  └───────────────┬───────────────┘  │
│  ┌──────────────────────────────┐  │                  ▼                  │
│  │ 10-Metric Clinical Engine    │  │  ┌───────────────────────────────┐  │
│  │ Weight · BMI · BMR · Fat%    │  │  │ 9-Profile Ayurvedic Matrix    │  │
│  │ Muscle · Fat-Free · Skeletal │  │  │ + Personalized Calorie/Water  │  │
│  │ Bone · Water% · Visceral Fat │  │  │   Targets & Supplement Guide  │  │
│  └──────┬───────────────┬───────┘  │  └───────────────┬───────────────┘  │
│         ▼               ▼          │                  ▼                  │
│  ┌─────────────┐ ┌──────────────┐  │  ┌───────────────────────────────┐  │
│  │ 10xPro PDF  │ │  Smart PDF   │  │  │ Interactive 5-Meal Card View  │  │
│  │ (2×5 Cards  │ │ (Executive   │  │  │ + Non-Blocking Lead Sync      │  │
│  │  + Gauges)  │ │  Summary +   │  │  └───────────────────────────────┘  │
│  └─────────────┘ │  Action Plan)│  │                                     │
│   Native jsPDF   └──────────────┘  │                                     │
│   Vector Engine (Pure RGB, 0 CSS)  │                                     │
└────────────────────────────────────┴─────────────────────────────────────┘
```

- **Data Model & State**:
  - **Biometric Profile & Clinical Metrics**: Stores client details (`name`, `age`, `gender`, `phone`, `weight`, `height`), summary state (`bmi`, `category`, `bodyFat`, `muscleMass`, `visceral`, `bmr`, `idealWeight`, `dailyProteinGrams`, `dailyWaterLiters`), and the 10 `ReportMetric` records (`title`, `value`, `unit`, `normalRange`, `extraInfo`, `status`, `percent`, `barType`).
  - **PDF Generation State**: Manages `downloadingType: '10x' | 'smart' | null` and `pdfFeedback: { type: 'success' | 'error'; message: string } | null` for non-blocking inline status feedback.
  - **Nutrition Matrix State**: Indexed by `[Goal][DietType]` with 5 structured Indian meals (`morningDrink`, `breakfast`, `lunch`, `snack`, `dinner`) and `supplements`, paired with computed `targetCalories` and `waterLiters`.
- **Interactive Component & State Mapping**:
  - **Pre-Hydration Fetch Guard**: Executes immediately on document parse to allow harmless assignment to `window.fetch` when configurable and intercept uncaught extension-origin `fetch` setter errors before app code runs.
  - **Composition Calculation Handler**: Validates numeric height and weight inline (no `window.alert`), computes gender-calibrated reference ranges and indicator percentages for all 10 metrics, animates the SVG BMI gauge, and unlocks PDF export actions.
  - **10xPro & Smart PDF Export Handlers**: Construct A4 (`210mm × 297mm`) vector documents in memory using pure RGB colors, draw all cards/pills/segmented bars/dots or executive wellness guidance, trigger browser download via `pdf.save(...)`, and display an inline confirmation message.
  - **Diet Plan Generator & Reset**: Resolves any of the 9 Goal × Diet Type combinations, calculates personalized daily calorie and hydration targets, optionally logs leads via the existing SheetDB service without failing on network errors, and supports one-click reset to edit inputs.
