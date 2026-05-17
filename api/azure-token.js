// 試用模式 Azure 語音 Token Proxy
// Azure 只支援 POST 取 token（10 分鐘有效），Key 藏在伺服器
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const trialActive = process.env.TRIAL_ACTIVE !== "false";
  if (!trialActive) {
    return res.status(403).json({
      error: "TRIAL_ENDED",
      message: "免費試用已結束，請在設定頁面填入您自己的 Azure Speech Key",
    });
  }

  const key    = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || "eastasia";
  if (!key) return res.status(500).json({ error: "Server not configured" });

  try {
    const tokenRes = await fetch(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      { method: "POST", headers: { "Ocp-Apim-Subscription-Key": key } }
    );
    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({ error: "Azure token fetch failed" });
    }
    const token = await tokenRes.text();
    return res.json({ token, region });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
