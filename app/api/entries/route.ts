import { NextResponse } from "next/server";

const WEBHOOK_URL =
  "REDACTED_WEBHOOK_URL";

export async function POST(request: Request) {
  try {
    const newEntry = await request.json();

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newEntry.fullName,
        cin: newEntry.cin,
        symptoms: newEntry.symptoms,
        arrival_mode: newEntry.arrivalMode
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook trigger failed:", error);
    return NextResponse.json(
      { error: "Failed to save" },
      { status: 500 }
    );
  }
}