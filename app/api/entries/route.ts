import { NextResponse } from "next/server";
// This lets us send responses back to the form
import fs from "fs";
import path from "path";

//where to save data
const filePath = path.join(process.cwd(), "data", "entries.json");
const WEBHOOK_URL = "REDACTED_WEBHOOK_URL"
//read data from file 
export async function POST(request: Request) {
  try {
    // Get data from the form
    const newEntry = await request.json();
    
    // Read existing entries
    let entries = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      entries = JSON.parse(fileContent);
    }

    // Add new entry
    entries.push(newEntry);
    
    // Save everything back
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));

    try {
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
    } catch (webhookError) {
      console.error("Webhook trigger failed:", webhookError);
    }
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save" },
      { status: 500 }
    );
  }
}
