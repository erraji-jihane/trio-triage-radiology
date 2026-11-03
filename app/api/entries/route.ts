import { NextResponse } from "next/server";

// Set in .env.local (dev) or the Vercel project settings (prod). Never commit it:
// anyone with this URL can trigger the triage automation and its alerts.
const WEBHOOK_URL = process.env.TRIO_WEBHOOK_URL;

export async function POST(request: Request) {
  if (!WEBHOOK_URL) {
    console.error("TRIO_WEBHOOK_URL is not set");
    return NextResponse.json({ error: "Server is not configured" }, { status: 500 });
  }

  try {
    const newEntry = await request.json();

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newEntry.fullName,
        cin: newEntry.cin,
        symptoms: newEntry.symptoms,
        arrival_mode: newEntry.arrivalMode
      })
    });

    // fetch only throws on network errors, so a 4xx/5xx from the automation
    // must be checked explicitly or the form would report a false success.
    if (!response.ok) {
      console.error(`Webhook responded with ${response.status}`);
      return NextResponse.json({ error: "Failed to submit" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook trigger failed:", error);
    return NextResponse.json(
      { error: "Failed to submit" },
      { status: 500 }
    );
  }
}
