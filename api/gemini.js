// VoiceUp Gemini Proxy — Vercel Serverless Function
// Key 存在 Vercel 環境變數，使用者永遠看不到

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-preview-05-20",
  "gemini-2.0-flash",
];

export default async function handler(req, res) {
  // ── CORS headers ──────────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // ── 試用期檢查 ─────────────────────────────────────────────────────────────
  // 在 Vercel 後台把 TRIAL_ACTIVE 設為 false 即可關閉試用期
  const trialActive = process.env.TRIAL_ACTIVE !== "false";
  if (!trialActive) {
    return res.status(403).json({
      error: "TRIAL_ENDED",
      message: "免費試用已結束，請在設定頁面填入您自己的 Gemini API Key",
    });
  }

  // ── API Key ───────────────────────────────────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server not configured" });
  }

  // ── 接收前端請求 ───────────────────────────────────────────────────────────
  const { model, requestBody } = req.body || {};
  if (!requestBody) return res.status(400).json({ error: "Missing requestBody" });

  // 只允許白名單內的 model
  const targetModel = GEMINI_MODELS.includes(model) ? model : GEMINI_MODELS[0];

  // ── 轉發到 Gemini ─────────────────────────────────────────────────────────
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );
    const data = await geminiRes.json();
    return res.status(geminiRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Proxy error: " + err.message });
  }
}
