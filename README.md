# T.R.I.O: Triage, Routing & Imaging Orchestration

An AI-assisted emergency-department workflow for radiology: patients are triaged from their symptoms at intake, routed to an imaging room and a radiologist, and their scans get an AI pre-read before a doctor looks at them.

Built in a team of five at the **Fusion AI Hackathon** (AUI AI Summer School 2026), with ABA Technology and the Afretec Network.

## The problem

Radiologists read large volumes of scans under time pressure, and fatigue is linked to missed findings. In the emergency department, urgent cases can wait in the same queue as routine ones. TRIO puts the most urgent patients first and gives the radiologist a pre-read to start from, without taking the decision away from the doctor.

## How it works

```text
 Patient intake form (Next.js)          Scan intake page (scan-intake/)
   name, ID, symptoms, arrival mode        pick a patient from the live ER queue,
            │                              attach the scan image
            ▼ /api/entries                           │ /api/proxy
   ┌──────────────────────────────┐        ┌────────────────────────────────┐
   │ TRIO-INTAKE automation        │        │ TRIO-SCAN automation            │
   │ LLM triage → urgency score,   │        │ AI pre-read of the image,       │
   │ queue entry, alerts           │        │ flags abnormalities, reports    │
   └──────────────────────────────┘        │ to the assigned radiologist     │
                    │                       └────────────────────────────────┘
                    ▼                                    │
          TRIO-DB (Google Sheets): patients · imaging rooms · doctors
                    │
                    ▼
     ER dashboard (er-dashboard/) + WhatsApp alerts to staff
```

- **Intake** (`app/`): a responsive Next.js form. The server route forwards the submission to the triage automation, so the webhook URL never reaches the browser.
- **Triage**: an LLM node in the Fusion visual automation platform scores urgency from the symptoms using a clinical triage prompt with structured JSON output. The automation itself lives in the Fusion platform, not in this repo.
- **Scan intake** (`scan-intake/`): a single-page tool for the imaging desk. It loads the ER queue sorted by urgency, suggests the scan type and region from the symptoms, picks a free imaging room and an on-call radiologist, compresses the image and sends it for the AI pre-read.
- **ER dashboard** (`er-dashboard/`): the command-center screen for staff. It polls TRIO-DB every 5 seconds and shows the patient queue by urgency, imaging-room status, alerts, on-call doctors and the AI scan reports.

![ER dashboard in demo mode](docs/er-dashboard.png)

## Running it

### Intake form

```bash
npm install
cp .env.example .env.local   # set TRIO_WEBHOOK_URL
npm run dev                  # http://localhost:3000
```

### Scan intake

`scan-intake/` is a static page plus one Vercel serverless function. Deploy it as its own Vercel project with `scan-intake` as the root directory and set `TRIO_SCAN_WEBHOOK_URL`. In `index.html`, paste the published-CSV links of the three TRIO-DB tabs.

### ER dashboard

`er-dashboard/` is a single static page: open `index.html` or deploy the folder to any static host. With no links configured it runs in demo mode with sample patients; paste the published-CSV links of the TRIO-DB tabs into the `CSV` object to go live.

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Vercel serverless functions · Fusion AI automation platform · Groq LLM · Google Sheets · WhatsApp (Green API)

## Team

- Jihane Erraji
- Khalil Berjaoui
- Mehdi El Karimi
- Zineb El Koussaimi
- Asma Ouabd
