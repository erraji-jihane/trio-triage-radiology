import { NextResponse } from "next/server";

// Webhook of the TRIO-SCAN automation, used by the scan intake page (/scan).
// Set in .env.local (dev) or the Vercel project settings (prod). Never commit it.
const SCAN_WEBHOOK_URL = process.env.TRIO_SCAN_WEBHOOK_URL;

export async function POST(request: Request) {
  if (!SCAN_WEBHOOK_URL) {
    console.error("TRIO_SCAN_WEBHOOK_URL is not set");
    return NextResponse.json({ error: "TRIO_SCAN_WEBHOOK_URL is not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(SCAN_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await request.json()),
    });

    // The automation may answer with JSON or plain text; pass either back with its status.
    const text = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Scan webhook failed:", error);
    return NextResponse.json({ error: "Failed to reach the scan automation" }, { status: 502 });
  }
}
