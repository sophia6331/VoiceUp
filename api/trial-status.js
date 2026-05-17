// 前端啟動時呼叫，得知是否處於試用期
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    trialActive: process.env.TRIAL_ACTIVE !== "false",
    azureRegion: process.env.AZURE_SPEECH_REGION || "eastasia",
  });
}
