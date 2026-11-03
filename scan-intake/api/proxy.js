// Vercel serverless function: forwards the scan to the TRIO-SCAN automation.
// The webhook URL stays on the server (TRIO_SCAN_WEBHOOK_URL), never in the page.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.TRIO_SCAN_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'TRIO_SCAN_WEBHOOK_URL is not configured' });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}
