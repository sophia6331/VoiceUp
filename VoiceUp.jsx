// VoiceUp v4.0
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

// Portal: renders children directly into document.body, bypassing all CSS stacking contexts
function Portal({ children }) {
  return createPortal(children, document.body);
}

// ─── Image assets (paths) ─────────────────────────────────────────────────────
const IMG_LOGO_DOLPHIN    = "/images/full_logo.png";
const IMG_LOGO_TEXT       = "/images/logo.png";
const IMG_DOLPHIN_HAPPY   = "/images/good.png";
const IMG_DOLPHIN_SLEEP   = "/images/sleep.png";
const IMG_BACKGROUND      = "/images/background.png";
const IMG_LOGO_WAVE       = "/images/hi.png";
const IMG_DOLPHIN_TEACHER = "/images/teach.png";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Fredoka:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* VoiceUp Blue × Sunshine Yellow */
    --blue:       #3B8BEB;
    --blue-light: #EBF3FD;
    --blue-mid:   #6AAAF0;
    --blue-dark:  #1F6ACC;
    --blue-glow:  rgba(59,139,235,0.15);

    --yellow:     #F5A623;
    --yellow-dim: #D98F1A;
    --yellow-glow:rgba(245,166,35,0.18);
    --yellow-light:#FFF4E0;

    --green:      #34C77B;
    --green-light:#E6FAF1;
    --red:        #F0544F;
    --red-light:  #FEF0EF;

    /* Light mode */
    --bg:         #F0F6FF;
    --bg-card:    #FFFFFF;
    --bg-input:   #E8F0FB;
    --border:     rgba(59,139,235,0.12);
    --text:       #1A2744;
    --text-2:     #4A6080;
    --text-3:     #8AAAC8;
    --shadow:     0 2px 12px rgba(59,139,235,0.10);
    --shadow-lg:  0 8px 28px rgba(59,139,235,0.15);
    --shadow-card:0 4px 16px rgba(59,139,235,0.08);

    --amber:      #F5A623;
    --amber-dim:  #D98F1A;
    --amber-glow: rgba(245,166,35,0.18);
  }

  [data-theme="dark"] {
    --bg:         #0D1B2E;
    --bg-card:    #152238;
    --bg-input:   #1E2F45;
    --border:     rgba(59,139,235,0.15);
    --text:       #E8F1FD;
    --text-2:     #7FA8CC;
    --text-3:     #3D6080;
    --shadow:     0 2px 12px rgba(0,0,0,0.4);
    --shadow-lg:  0 8px 32px rgba(0,0,0,0.6);
    --shadow-card:0 4px 16px rgba(0,0,0,0.3);
    /* dark mode: override light hover backgrounds so text stays readable */
    --blue-light: rgba(59,139,235,0.18);
    --green-light:#0D2E1F;
    --red-light:  #2E0D0D;
    --yellow-light:#2E210A;
  }

  html, body, #root { height: 100%; }
  /* NOTE: overflow-x:hidden is intentionally NOT on body/html —
     iOS Safari would treat body as the containing block for position:fixed,
     breaking all full-screen overlays. Apply it on .app-shell instead. */

  body {
    font-family: 'Nunito', sans-serif;
    background: var(--bg);
    color: var(--text);
    transition: background 0.3s, color 0.3s;
    -webkit-font-smoothing: antialiased;
  }

  /* Playful animated background blobs */
  .app-shell::before {
    content: '';
    position: fixed;
    top: -80px;
    right: -60px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(245,166,35,0.18) 0%, rgba(245,166,35,0) 70%);
    border-radius: 50%;
    z-index: 0;
    pointer-events: none;
    animation: floatBlob 18s ease-in-out infinite;
  }
  .app-shell::after {
    content: '';
    position: fixed;
    top: 30%;
    left: -100px;
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(59,139,235,0.12) 0%, rgba(59,139,235,0) 70%);
    border-radius: 50%;
    z-index: 0;
    pointer-events: none;
    animation: floatBlob 22s ease-in-out infinite reverse;
  }
  @keyframes floatBlob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(20px, -30px) scale(1.1); }
    66% { transform: translate(-15px, 20px) scale(0.95); }
  }
  .page, .practice-shell { position: relative; z-index: 1; }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --amber:     #E8A44A;
    --amber-dim: #C4873A;
    --amber-glow: rgba(232,164,74,0.15);
    --green:     #4CAF82;
    --red:       #E05A5A;
    --blue:      #5A9EE0;

    /* Light */
    --bg:        #F5F2EC;
    --bg-card:   #FFFFFF;
    --bg-input:  #EDEAE3;
    --border:    rgba(0,0,0,0.08);
    --text:      #1A1714;
    --text-2:    #5C5650;
    --text-3:    #9C9690;
    --shadow:    0 2px 12px rgba(0,0,0,0.08);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
  }

  [data-theme="dark"] {
    --bg:        #0F0E0C;
    --bg-card:   #1A1916;
    --bg-input:  #242220;
    --border:    rgba(255,255,255,0.07);
    --text:      #F0EDE8;
    --text-2:    #A09C96;
    --text-3:    #605C58;
    --shadow:    0 2px 12px rgba(0,0,0,0.4);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.6);
  }

  html, body, #root { height: 100%; }

  body {
    font-family: 'Nunito', sans-serif;
    background: var(--bg);
    color: var(--text);
    transition: background 0.3s, color 0.3s;
    -webkit-font-smoothing: antialiased;
  }

  /* Playful animated background blobs */
  .app-shell::before {
    content: '';
    position: fixed;
    top: -80px;
    right: -60px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(245,166,35,0.18) 0%, rgba(245,166,35,0) 70%);
    border-radius: 50%;
    z-index: 0;
    pointer-events: none;
    animation: floatBlob 18s ease-in-out infinite;
  }
  .app-shell::after {
    content: '';
    position: fixed;
    top: 30%;
    left: -100px;
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(59,139,235,0.12) 0%, rgba(59,139,235,0) 70%);
    border-radius: 50%;
    z-index: 0;
    pointer-events: none;
    animation: floatBlob 22s ease-in-out infinite reverse;
  }
  @keyframes floatBlob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(20px, -30px) scale(1.1); }
    66% { transform: translate(-15px, 20px) scale(0.95); }
  }
  .page, .practice-shell { position: relative; z-index: 1; }


  /* ── Layout ── */
  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
    background: var(--bg);
    background-image: url('/images/background.png');
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: cover;
    background-attachment: local;
  }
  [data-theme="dark"] .app-shell {
    background-image:
      linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.62)),
      url('/images/background.png');
  }

  .page {
    flex: 1;
    padding: 24px 18px 96px;
  }

  @keyframes fadeUp {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* ── Bottom Nav ── */
  .bottom-nav {
    position: fixed;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 100%; max-width: 480px;
    background: var(--bg-card);
    border-top: 2px solid var(--border);
    display: flex;
    padding: 8px 0 env(safe-area-inset-bottom, 8px);
    z-index: 100;
    backdrop-filter: blur(16px);
    box-shadow: 0 -4px 20px rgba(59,139,235,0.08);
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 0;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-3);
    font-family: 'Nunito', sans-serif;
    font-size: 10px;
    font-weight: 700;
    transition: color 0.2s, transform 0.15s;
  }
  .nav-item:active { transform: scale(0.92); }
  .nav-item.active { color: var(--blue); }
  .nav-item svg { transition: all 0.2s; }
  .nav-item.active svg { transform: scale(1.1); }
  .nav-item svg { width: 22px; height: 22px; }

  /* ── Cards ── */
  .card {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 20px;
    box-shadow: var(--shadow-card);
  }
  .card + .card { margin-top: 12px; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 22px;
    border-radius: 50px;
    border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1);
    letter-spacing: 0.01em;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
    color: white;
    box-shadow: 0 4px 14px rgba(59,139,235,0.35);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,139,235,0.45); }
  .btn-primary:active { transform: translateY(0) scale(0.97); }
  .btn-primary:disabled { opacity: 0.45; transform: none; box-shadow: none; cursor: not-allowed; }

  .btn-ghost {
    background: var(--bg-input);
    color: var(--text-2);
    box-shadow: none;
  }
  .btn-ghost:hover { background: var(--blue-light); color: var(--blue); }

  .btn-outline {
    background: transparent;
    color: var(--blue);
    border: 2px solid var(--blue);
  }
  .btn-outline:hover { background: var(--blue-light); }

  .btn-yellow {
    background: linear-gradient(135deg, var(--yellow) 0%, var(--yellow-dim) 100%);
    color: white;
    box-shadow: 0 4px 14px rgba(245,166,35,0.35);
  }
  .btn-yellow:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245,166,35,0.45); }

  .btn-full { width: 100%; }
  .btn-sm { padding: 7px 16px; font-size: 12px; }

  /* ── Inputs ── */
  .input-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }

  .input-label {
    font-size: 12px;
    font-weight: 800;
    color: var(--text-2);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .input-field {
    background: var(--bg-input);
    border: 2px solid var(--border);
    border-radius: 14px;
    padding: 12px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .input-field:focus { border-color: var(--blue); box-shadow: 0 0 0 4px var(--blue-glow); }
  .input-field::placeholder { color: var(--text-3); }

  .input-field-text {
    background: var(--bg-input);
    border: 2px solid var(--border);
    border-radius: 14px;
    padding: 12px 14px;
    font-family: 'Nunito', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .input-field-text:focus { border-color: var(--blue); box-shadow: 0 0 0 4px var(--blue-glow); }

  /* ── Status badges ── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 12px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 800;
  }
  .badge-green  { background: var(--green-light); color: var(--green); }
  .badge-amber  { background: var(--yellow-light); color: var(--yellow-dim); }
  .badge-red    { background: var(--red-light); color: var(--red); }
  .badge-muted  { background: var(--bg-input); color: var(--text-3); }
  .badge-blue   { background: var(--blue-light); color: var(--blue-dark); }

  /* ── Divider ── */
  .divider { height: 2px; background: var(--border); border-radius: 2px; margin: 20px 0; }

  /* ── Page titles ── */
  .page-title {
    font-family: 'Fredoka', sans-serif;
    font-size: 30px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.2;
    margin-bottom: 4px;
  }

  .page-subtitle {
    font-size: 13px;
    color: var(--text-3);
    margin-bottom: 20px;
    line-height: 1.5;
  }

  /* ── Section label ── */
  .section-label {
    font-size: 11px;
    font-weight: 800;
    color: var(--blue-mid);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 10px;
    margin-top: 22px;
  }

  /* ── Toggle ── */
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1.5px solid var(--border);
  }
  .toggle-row:last-child { border-bottom: none; }
  .toggle-info { display: flex; flex-direction: column; gap: 2px; }
  .toggle-title { font-size: 14px; font-weight: 700; }
  .toggle-desc  { font-size: 12px; color: var(--text-3); }

  .toggle { position: relative; width: 46px; height: 26px; cursor: pointer; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-track {
    position: absolute; inset: 0;
    background: var(--bg-input);
    border-radius: 13px;
    transition: background 0.25s;
    border: 2px solid var(--border);
  }
  .toggle input:checked + .toggle-track { background: var(--blue); border-color: var(--blue); }
  .toggle-track::after {
    content: '';
    position: absolute;
    top: 2px; left: 2px;
    width: 18px; height: 18px;
    background: white;
    border-radius: 50%;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .toggle input:checked + .toggle-track::after { transform: translateX(20px); }

  /* ── Key status indicator ── */
  .key-status { display: flex; align-items: center; gap: 6px; font-size: 12px; margin-top: 6px; }
  .key-dot { width: 8px; height: 8px; border-radius: 50%; }
  .key-dot.set    { background: var(--green); box-shadow: 0 0 0 3px var(--green-light); }
  .key-dot.unset  { background: var(--text-3); }

  /* ── Onboarding ── */
  .onboarding {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 28px;
    text-align: center;
    animation: fadeUp 0.5s ease both;
    background: linear-gradient(160deg, #EBF3FD 0%, #F0F6FF 60%, #FFF4E0 100%);
  }

  .logo-mark {
    width: 80px; height: 80px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
    border-radius: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 0 0 10px var(--blue-glow), 0 8px 28px rgba(59,139,235,0.3);
    animation: popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
  }
  .logo-mark svg { width: 40px; height: 40px; color: white; }

  .onboarding h1 {
    font-family: 'Fredoka', sans-serif;
    font-size: 42px;
    font-weight: 600;
    line-height: 1.1;
    margin-bottom: 12px;
    background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 50%, var(--yellow) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .onboarding p {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.6;
    max-width: 320px;
    margin: 0 auto 36px;
    font-weight: 600;
  }

  .step-dots {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 28px;
  }
  .step-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--border);
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .step-dot.active {
    background: var(--blue);
    width: 26px;
    border-radius: 4px;
  }

  /* ── Setup step ── */
  .setup-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .step-number {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
    color: white;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 800; flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(59,139,235,0.35);
  }
  .step-title { font-size: 18px; font-weight: 800; color: var(--text); }

  .help-link {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; color: var(--blue); text-decoration: none;
    margin-top: 4px; cursor: pointer; font-weight: 700;
  }

  .password-field-wrap { position: relative; }
  .password-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--text-3); padding: 0;
  }

  /* ── Home page ── */
  .greeting {
    font-family: 'Fredoka', sans-serif;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--text);
  }

  .streak-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
    border-radius: 20px;
    margin-bottom: 16px;
    box-shadow: 0 6px 20px rgba(59,139,235,0.3);
    color: white;
    position: relative;
    overflow: hidden;
  }
  .streak-bar::before {
    content: '';
    position: absolute;
    right: -20px; top: -20px;
    width: 100px; height: 100px;
    background: rgba(255,255,255,0.08);
    border-radius: 50%;
  }

  .streak-flame { font-size: 28px; line-height: 1; }
  .streak-info { flex: 1; }
  .streak-count { font-size: 22px; font-weight: 900; color: var(--yellow); }
  .streak-label { font-size: 11px; color: rgba(255,255,255,0.75); margin-top: 1px; font-weight: 600; }

  .quick-action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
  .quick-action {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 18px 16px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
    text-align: left;
    box-shadow: var(--shadow-card);
  }
  .quick-action:hover { transform: translateY(-3px) scale(1.02); box-shadow: var(--shadow-lg); border-color: var(--blue-mid); }
  .qa-icon { font-size: 26px; margin-bottom: 8px; display: block; }
  .qa-title { font-size: 13px; font-weight: 800; margin-bottom: 2px; }
  .qa-desc  { font-size: 11px; color: var(--text-3); line-height: 1.4; font-weight: 600; }

  .scenario-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: 18px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
    margin-bottom: 10px;
    box-shadow: var(--shadow-card);
  }
  .scenario-card:hover { border-color: var(--blue-mid); transform: translateX(4px); box-shadow: var(--shadow-lg); }
  .scenario-emoji { font-size: 28px; flex-shrink: 0; }
  .scenario-info  { flex: 1; }
  .scenario-name  { font-size: 14px; font-weight: 800; margin-bottom: 2px; }
  .scenario-desc  { font-size: 12px; color: var(--text-3); font-weight: 600; }
  .scenario-arrow { color: var(--text-3); font-size: 18px; }

  /* ── Settings ── */
  .settings-section {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 16px;
    box-shadow: var(--shadow-card);
  }
  .settings-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 15px 18px; border-bottom: 1.5px solid var(--border);
    cursor: pointer; transition: background 0.15s;
  }
  .settings-row:last-child { border-bottom: none; }
  .settings-row:hover { background: var(--blue-light); }
  .settings-row-left { display: flex; flex-direction: column; gap: 2px; }
  .settings-row-title { font-size: 14px; font-weight: 700; }
  .settings-row-desc  { font-size: 12px; color: var(--text-3); font-weight: 600; }
  .settings-row-right { color: var(--text-3); font-size: 12px; display: flex; align-items: center; gap: 6px; }

  /* ── Modals ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(13,27,46,0.65);
    backdrop-filter: blur(6px);
    z-index: 200;
    display: flex; align-items: flex-end;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal-sheet {
    background: var(--bg);
    border-radius: 28px 28px 0 0;
    width: 100%; max-height: 92vh;
    overflow-y: auto;
    padding: 28px 22px env(safe-area-inset-bottom, 24px);
    animation: slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1);
    border-top: 2px solid var(--border);
  }
  @keyframes slideUp {
    from { transform: translateY(70px); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }

  .modal-handle {
    width: 44px; height: 5px;
    background: var(--border);
    border-radius: 3px;
    margin: 0 auto 22px;
  }
  .modal-title {
    font-family: 'Fredoka', sans-serif;
    font-size: 24px; font-weight: 600;
    margin-bottom: 6px; color: var(--text);
  }
  .modal-desc { font-size: 13px; color: var(--text-2); line-height: 1.55; margin-bottom: 22px; font-weight: 600; }

  /* ── Connection pill ── */
  .connection-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 700;
    background: var(--bg-input);
  }
  .conn-dot { width: 7px; height: 7px; border-radius: 50%; }
  .conn-dot.ok  { background: var(--green); box-shadow: 0 0 0 3px var(--green-light); }
  .conn-dot.err { background: var(--red); box-shadow: 0 0 0 3px var(--red-light); }
  .conn-dot.off { background: var(--text-3); }

  /* ── Warning banner ── */
  .warning-banner {
    background: var(--yellow-light);
    border: 2px solid rgba(245,166,35,0.35);
    border-radius: 16px;
    padding: 14px 16px;
    font-size: 13px; color: var(--yellow-dim);
    line-height: 1.5; margin-bottom: 18px;
    display: flex; gap: 10px; align-items: flex-start;
    font-weight: 700;
  }

  /* ── Stats ── */
  .stat-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 18px; }
  .stat-item {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: 18px;
    padding: 14px 12px; text-align: center;
    box-shadow: var(--shadow-card);
  }
  .stat-value { font-size: 22px; font-weight: 900; color: var(--blue); }
  .stat-label { font-size: 10px; color: var(--text-3); margin-top: 3px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }

  /* ── Calendar ── */
  .mini-calendar {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 16px;
    box-shadow: var(--shadow-card);
  }
  .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .cal-month { font-size: 14px; font-weight: 800; color: var(--text); }
  .cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 3px; }
  .cal-day-label {
    text-align: center; font-size: 10px; color: var(--text-3);
    font-weight: 800; letter-spacing: 0.04em; padding-bottom: 6px;
  }
  .cal-day {
    aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
    font-size: 12px; border-radius: 10px; color: var(--text-3); font-weight: 600;
    transition: all 0.15s;
  }
  .cal-day.practiced { background: var(--blue-light); color: var(--blue-dark); font-weight: 800; }
  .cal-day.today { background: var(--yellow); color: white; font-weight: 900; box-shadow: 0 3px 8px rgba(245,166,35,0.4); }
  .cal-day.today-practiced {
    background: var(--yellow); color: white; font-weight: 900;
    box-shadow: 0 3px 8px rgba(245,166,35,0.4), inset 0 0 0 2px var(--green);
  }
  .cal-day.empty { opacity: 0; pointer-events: none; }

  /* ── Tags ── */
  .tag-chip {
    padding: 5px 14px; border-radius: 99px;
    font-size: 12px; font-weight: 700;
    border: 2px solid var(--border);
    background: var(--bg-input); color: var(--text-2);
    cursor: pointer; transition: all 0.15s;
    white-space: nowrap;
  }
  .tag-chip:hover { border-color: var(--blue-mid); color: var(--blue); background: var(--blue-light); }
  .tag-chip.selected { background: var(--blue-light); border-color: var(--blue); color: var(--blue-dark); }
  .tag-row { display: flex; flex-wrap: wrap; gap: 6px; }

  /* ── Save modal ── */
  .save-modal {
    position: fixed; inset: 0;
    background: rgba(13,27,46,0.6);
    backdrop-filter: blur(6px);
    z-index: 400;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: fadeIn 0.2s ease;
  }
  .save-sheet {
    background: var(--bg);
    border-radius: 24px; width: 100%; max-width: 420px;
    padding: 24px 20px; animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
    border: 1.5px solid var(--border);
    box-shadow: 0 20px 60px rgba(13,27,46,0.3);
  }

  /* responsive */
  @media (min-width: 480px) {
    .app-shell { border-left: 1.5px solid var(--border); border-right: 1.5px solid var(--border); }
    .bottom-nav { border-left: 1.5px solid var(--border); border-right: 1.5px solid var(--border); }
  }
`;

// ─── Local storage helpers ─────────────────────────────────────────────────────
const LS = {
  get: (k, fallback = null) => {
    try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

const KEY_AZURE_KEY    = "vu_azure_key";
const KEY_AZURE_REGION = "vu_azure_region";
const KEY_GEMINI_KEY   = "vu_gemini_key";
const KEY_DARK_MODE    = "vu_dark_mode";
const KEY_ONBOARDED    = "vu_onboarded";
const KEY_STREAK_DAYS  = "vu_streak_days";   // array of "YYYY-MM-DD"
const KEY_JOINED_DATE  = "vu_joined_date";    // "YYYY-MM-DD" first open
const KEY_STATS        = "vu_stats";         // { savedSentences, sessions }

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Mic: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10a7 7 0 01-14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>
    </svg>
  ),
  // Nav icons (filled, friendly style) — active state controlled via CSS
  Book: ({ active }) => active ? (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 2H7.5C5.57 2 4 3.57 4 5.5v13C4 20.43 5.57 22 7.5 22H19a1 1 0 001-1V3a1 1 0 00-1-1zM7.5 4H17v12H7.5c-.55 0-1.05.12-1.5.32V5.5C6 4.67 6.67 4 7.5 4z"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  ),
  Chart: ({ active }) => active ? (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 21h18a1 1 0 000-2H4V3a1 1 0 00-2 0v17a1 1 0 001 1z"/>
      <rect x="6" y="13" width="3" height="6" rx="1"/>
      <rect x="11" y="8" width="3" height="11" rx="1"/>
      <rect x="16" y="4" width="3" height="15" rx="1"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Gear: ({ active }) => active ? (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65a.5.5 0 00.12-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0014 2h-4a.488.488 0 00-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.5.5 0 00-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.14.25.43.34.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.05.24.25.42.49.42h4c.24 0 .44-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  Home: ({ active }) => active ? (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3l9 7v11a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V10l9-7z"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Eye: ({ off }) => off ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Google: () => (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  Warning: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0,marginTop:1}}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

// ─── Scenarios data ───────────────────────────────────────────────────────────
const SCENARIOS = [
  { id: "meeting",   emoji: "💼", name: "Team Meeting",        desc: "Discuss projects with colleagues",  level: "B2" },
  { id: "interview", emoji: "🎯", name: "Job Interview",       desc: "Practice for international roles",  level: "C1" },
  { id: "pitch",     emoji: "📊", name: "Pitch & Presentation",desc: "Present ideas persuasively",         level: "B2" },
  { id: "client",    emoji: "📞", name: "Client Call",         desc: "Handle calls & complaints",         level: "B2" },
  { id: "travel",    emoji: "✈️", name: "Travel & Booking",    desc: "Navigate real travel situations",   level: "B1" },
  { id: "smalltalk", emoji: "☕", name: "Small Talk",          desc: "Chat about life, news, weekends",   level: "B1" },
  { id: "debate",    emoji: "⚡", name: "Debate & Persuade",   desc: "Argue a position confidently",      level: "C1" },
  { id: "improv",    emoji: "🎲", name: "Improv Speaking",     desc: "Random topic, 2 min to respond",    level: "C1" },
  { id: "custom",    emoji: "✏️", name: "自訂場景",            desc: "自己設定情境與 AI 角色",              level: "自訂" },
];

// Random openers per scenario (multiple variants to avoid repetition)
const SCENARIO_OPENERS = {
  meeting: [
    "Good morning, everyone! Let's get the ball rolling. First on the agenda — can someone give me a quick update on where we are with the project?",
    "Hi team, glad you could all make it. Before we dive in, does anyone have any urgent items they'd like to add to the agenda?",
    "Morning! Let's keep this one tight — we've got a lot to cover. Who wants to kick things off with a status update?",
    "Hey, thanks for joining. Quick housekeeping — this meeting will be recorded. Now, let's start with last week's action items. Any blockers?",
  ],
  interview: [
    "Welcome! Please, have a seat. I've had a chance to look over your CV — impressive background. Shall we start with you telling me a bit about yourself?",
    "Good afternoon! Thanks for coming in. We've been really excited to meet you. To start, could you walk me through your career journey so far?",
    "Hi, great to meet you in person! So, before we get into the role specifics — what made you apply for this position?",
    "Thanks for making the trip. I'll be straight with you — your profile stood out. Let's start simple: why are you looking to leave your current role?",
  ],
  pitch: [
    "Thanks for joining us today. We're excited to hear your pitch. Whenever you're ready, go ahead!",
    "Great, the floor is yours. We've got about 15 minutes, so make it count. What problem are you solving?",
    "Alright, let's hear it. I've seen a hundred pitches this month — what makes yours different?",
    "We've read your one-pager. Now we want to hear it in your own words. What's the core idea?",
  ],
  client: [
    "Hello, thank you for calling. How can I assist you today?",
    "Good afternoon, you've reached customer support. What can I help you with?",
    "Hi there! I see your account has been flagged — is this regarding your recent order?",
    "Thanks for reaching out. I understand you've been having some issues. Can you walk me through what happened?",
  ],
  travel: [
    "Hi there! Welcome to the hotel. Do you have a reservation, or would you like to check room availability?",
    "Good evening! You look a bit lost — can I help you find something?",
    "Welcome! Just so you know, there's a slight issue with your booking. Can I have your name so I can pull it up?",
    "Hi! Table for how many? Do you have a reservation, or is it walk-in?",
  ],
  smalltalk: [
    "Hey! Crazy week, right? What have you been up to lately?",
    "Oh hey! Long time no see. You look great — anything exciting going on?",
    "So, did you catch any of the news this week? There's been a lot happening.",
    "Happy Friday! Any big plans for the weekend?",
  ],
  debate: [
    "Alright, today's motion: 'AI will do more harm than good in the next decade.' I'll argue in favour — you argue against. Ready?",
    "Let's debate: 'Remote work should be the default for all office jobs.' I'll take the opposition — you defend it.",
    "Motion: 'Social media does more harm than good to society.' I'm for the motion. You're against. Make your opening argument.",
    "Here's the topic: 'Universities are no longer worth the cost.' I'll argue they are — you say they aren't. Go ahead.",
  ],
  improv: [
    "Here's your topic: *The best advice you've ever received.* You've got two minutes. Whenever you're ready — go!",
    "Your topic: *Describe a time you completely changed your mind about something.* Two minutes on the clock. Start!",
    "Ready? Topic: *If you could have dinner with anyone, alive or dead — who and why?* Go!",
    "Topic: *What's one skill everyone should learn before they're 30?* Two minutes. Off you go!",
  ],
};

function getRandomOpener(scenarioId) {
  const openers = SCENARIO_OPENERS[scenarioId];
  if (!openers) return "Hello! Let's get started. What would you like to talk about?";
  return openers[Math.floor(Math.random() * openers.length)];
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar({ practicedDays }) {
  const now  = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleString("zh-TW", { month: "long" });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const isoToday = `${year}-${String(month+1).padStart(2,"0")}-${String(today).padStart(2,"0")}`;

  return (
    <div className="mini-calendar">
      <div className="cal-header">
        <span className="cal-month">{year} 年 {month + 1} 月</span>
        <span className="badge badge-amber">🔥 {practicedDays.length} 天</span>
      </div>
      <div className="cal-grid">
        {["日","一","二","三","四","五","六"].map(d => (
          <div key={d} className="cal-day-label">{d}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={`e${i}`} className="cal-day empty" />;
          const iso = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const isToday     = iso === isoToday;
          const isPracticed = practicedDays.includes(iso);
          const cls = isToday
            ? (isPracticed ? "today-practiced" : "today")
            : (isPracticed ? "practiced" : "");
          return (
            <div key={d} className={`cal-day ${cls}`} style={{position:"relative"}}>
              {d}
              {isToday && isPracticed && (
                <span style={{position:"absolute",bottom:2,right:"50%",transform:"translateX(50%)",fontSize:6,color:"#1A1714"}}>●</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-track" />
    </label>
  );
}

// ─── Password field ───────────────────────────────────────────────────────────
function PasswordField({ value, onChange, placeholder, name }) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-field-wrap">
      <input
        className="input-field"
        type={show ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        name={name}
        autoComplete="off"
        spellCheck={false}
        style={{ paddingRight: 40 }}
      />
      <button className="password-toggle" type="button" onClick={() => setShow(s => !s)}>
        <Icons.Eye off={show} />
      </button>
    </div>
  );
}

// ─── Keys Setup Modal ─────────────────────────────────────────────────────────
function KeysModal({ onClose, onSave, initial }) {
  const [azureKey,    setAzureKey]    = useState(initial.azureKey    || "");
  const [azureRegion, setAzureRegion] = useState(initial.azureRegion || "eastasia");
  const [geminiKey,   setGeminiKey]   = useState(initial.geminiKey   || "");

  const handleSave = () => {
    onSave({ azureKey, azureRegion, geminiKey });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">API 金鑰設定</div>
        <div className="modal-desc">
          金鑰僅儲存在您的裝置，不會上傳至任何伺服器。換裝置時需重新填入。
        </div>

        <div className="section-label" style={{marginTop:0}}>Azure Speech</div>
        <div className="input-group">
          <div className="input-label">Subscription Key</div>
          <PasswordField value={azureKey} onChange={setAzureKey} placeholder="貼上 Azure Key..." name="azure_key" />
          <span className="help-link" onClick={() => window.open("https://portal.azure.com","_blank")}>
            ↗ 前往 Azure Portal 取得 Key
          </span>
        </div>
        <div className="input-group">
          <div className="input-label">Region</div>
          <input
            className="input-field"
            value={azureRegion}
            onChange={e => setAzureRegion(e.target.value)}
            placeholder="e.g. eastasia"
          />
        </div>

        <div className="section-label">Gemini API</div>
        <div className="input-group">
          <div className="input-label">Gemini API Key</div>
          <PasswordField value={geminiKey} onChange={setGeminiKey} placeholder="貼上 Gemini Key..." name="gemini_key" />
          <span className="help-link" onClick={() => window.open("https://aistudio.google.com/app/apikey","_blank")}>
            ↗ 前往 Google AI Studio 取得 Key
          </span>
        </div>

        <div className="divider" />
        <button className="btn btn-primary btn-full" onClick={handleSave}>
          <Icons.Check /> 儲存金鑰
        </button>
        <button className="btn btn-ghost btn-full" style={{marginTop:10}} onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep]               = useState(0);
  const [azureKey,    setAzureKey]    = useState("");
  const [azureRegion, setAzureRegion] = useState("eastasia");
  const [geminiKey,   setGeminiKey]   = useState("");

  const handleFinish = () => {
    LS.set(KEY_AZURE_KEY,    azureKey.trim());
    LS.set(KEY_AZURE_REGION, azureRegion.trim() || "eastasia");
    LS.set(KEY_GEMINI_KEY,   geminiKey.trim());
    LS.set(KEY_ONBOARDED,    true);
    if (!LS.get(KEY_JOINED_DATE)) LS.set(KEY_JOINED_DATE, new Date().toISOString().slice(0,10));
    onComplete();
  };

  const canSkip = step === 1 || step === 2;

  return (
    <div className="onboarding">
      {step === 0 && (
        <>
          <img src={IMG_LOGO_WAVE} alt="VoiceUp" style={{width:270,height:270,objectFit:"contain",marginBottom:4,animation:"popIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both"}} />
          <img src={IMG_LOGO_TEXT} alt="VoiceUp" style={{width:200,objectFit:"contain",marginBottom:20,animation:"fadeUp 0.5s ease 0.3s both"}} />
          <p>中高階英文口說練習。即時 AI 對話、學習庫複習、情境考驗，讓你說得更自然、更有信心。</p>
          <div className="step-dots">
            {[0,1,2,3].map(i => <div key={i} className={`step-dot ${i === step ? "active" : ""}`} />)}
          </div>
          <button className="btn btn-primary btn-full" style={{maxWidth:320}} onClick={() => setStep(1)}>
            下一步 →
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <img src={IMG_DOLPHIN_TEACHER} alt="VoiceUp" style={{width:240,height:240,objectFit:"contain",marginBottom:18,animation:"popIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both"}} />
          <h1 style={{fontSize:30,marginBottom:14}}>關於 VoiceUp</h1>
          <p style={{fontWeight:600,lineHeight:1.7,maxWidth:340}}>
            由 <strong style={{color:"var(--blue-dark)"}}>Sophia</strong> 製作的開源免費 App。
            <br/><br/>
            輸入你自己的 <strong style={{color:"var(--blue-dark)"}}>Gemini</strong> 與 <strong style={{color:"var(--blue-dark)"}}>Azure 金鑰</strong>即可開始免費使用，金鑰只存在你的裝置，不會上傳任何伺服器。
          </p>
          <div className="step-dots">
            {[0,1,2,3].map(i => <div key={i} className={`step-dot ${i === step ? "active" : ""}`} />)}
          </div>
          <div style={{display:"flex",gap:10,width:"100%",maxWidth:320}}>
            <button className="btn btn-ghost" style={{flex:"0 0 80px"}} onClick={() => setStep(0)}>← 上一步</button>
            <button className="btn btn-primary" style={{flex:1}} onClick={() => setStep(2)}>開始設定 →</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{width:"100%",maxWidth:400}}>
            <div className="setup-header">
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                <button onClick={() => setStep(1)} style={{background:"none",border:"none",cursor:"pointer",padding:6,marginLeft:-6,color:"var(--text-2)",display:"flex",alignItems:"center"}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <div className="step-number">1</div>
                <span className="step-title">Azure 語音辨識</span>
              </div>
            </div>

            <div className="warning-banner">
              <Icons.Warning />
              <span>Azure Speech 免費方案每月提供 <strong>5 小時</strong>語音辨識額度，個人練習完全夠用。<strong>可略過僅先以打字練習。</strong></span>
            </div>

            <div className="input-group">
              <div className="input-label">Subscription Key</div>
              <PasswordField value={azureKey} onChange={setAzureKey} placeholder="貼上 Azure Key..." name="ob_azure_key" />
              <span className="help-link" onClick={() => window.open("https://portal.azure.com","_blank")}>
                ↗ 前往 Azure Portal 申請（免費）
              </span>
            </div>
            <div className="input-group">
              <div className="input-label">Region</div>
              <input className="input-field" value={azureRegion} onChange={e => setAzureRegion(e.target.value)} placeholder="eastasia" />
            </div>

            <div className="step-dots" style={{marginTop:28}}>
              {[0,1,2,3].map(i => <div key={i} className={`step-dot ${i === step ? "active" : ""}`} />)}
            </div>
            <button className="btn btn-primary btn-full" onClick={() => setStep(3)} disabled={!azureKey.trim()}>
              下一步 →
            </button>
            <button className="btn btn-ghost btn-full" style={{marginTop:10}} onClick={() => setStep(3)}>
              稍後設定
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div style={{width:"100%",maxWidth:400}}>
            <div className="setup-header">
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                <button onClick={() => setStep(2)} style={{background:"none",border:"none",cursor:"pointer",padding:6,marginLeft:-6,color:"var(--text-2)",display:"flex",alignItems:"center"}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <div className="step-number">2</div>
                <span className="step-title">Gemini AI</span>
              </div>
            </div>

            <div className="warning-banner">
              <Icons.Warning />
              <span>Gemini API 有免費額度，個人練習用量通常不會超過免費上限。<strong>亦可略過稍後再設定。</strong></span>
            </div>

            <div className="input-group">
              <div className="input-label">Gemini API Key</div>
              <PasswordField value={geminiKey} onChange={setGeminiKey} placeholder="貼上 Gemini Key..." name="ob_gemini_key" />
              <span className="help-link" onClick={() => window.open("https://aistudio.google.com/app/apikey","_blank")}>
                ↗ 前往 Google AI Studio 取得（免費）
              </span>
            </div>

            <div className="step-dots" style={{marginTop:28}}>
              {[0,1,2,3].map(i => <div key={i} className={`step-dot ${i === step ? "active" : ""}`} />)}
            </div>
            <button className="btn btn-primary btn-full" onClick={handleFinish}>
              <Icons.Check /> 完成設定，開始練習！
            </button>
            <button className="btn btn-ghost btn-full" style={{marginTop:10}} onClick={handleFinish}>
              稍後設定
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ keys, onStartScenario, onStartCustom }) {
  const streakDays = LS.get(KEY_STREAK_DAYS, []);
  const stats      = LS.get(KEY_STATS, { savedSentences: 0, sessions: 0 });
  const hasKeys    = keys.azureKey; // Azure optional; AI uses built-in Claude API
  // Days since first open — hide streak/sleep banner for new users (< 4 days)
  const joinedISO    = LS.get(KEY_JOINED_DATE, null) || new Date().toISOString().slice(0,10);
  const daysSinceJoin = Math.floor((Date.now() - new Date(joinedISO).getTime()) / 86400000);
  const isNewUser    = daysSinceJoin < 3;

  const now = new Date();
  const todayISO = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const streak = (() => {
    if (!streakDays.includes(todayISO)) return streakDays.length;
    let count = 0, d = new Date();
    while (true) {
      const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      if (!streakDays.includes(iso)) break;
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  return (
    <div className="page">
      <div style={{marginBottom:16}}>
        <img src={IMG_LOGO_TEXT} alt="VoiceUp" style={{height:34,objectFit:"contain",display:"block",marginBottom:4}} />
        <div style={{fontSize:13,color:"var(--text-2)",fontWeight:600}}>選一個場景，開口練習吧！</div>
      </div>

      {!hasKeys && (
        <div className="warning-banner" style={{marginBottom:20}}>
          <Icons.Warning />
          <span>還沒設定 API 金鑰，部分功能無法使用。請前往<strong>設定</strong>頁面完成設定。</span>
        </div>
      )}

      {/* Dolphin sleeping banner — only after 4+ days of usage, 3+ inactive days */}
      {(() => {
        if (isNewUser) return null; // hide for brand-new users
        const mkISO = (daysAgo) => new Date(Date.now() - daysAgo*86400000).toISOString().slice(0,10);
        const [d0,d1,d2] = [mkISO(0),mkISO(1),mkISO(2)];
        const inactive = !streakDays.includes(d0) && !streakDays.includes(d1) && !streakDays.includes(d2);
        if (!inactive) return null;
        return (
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"var(--blue-light)",borderRadius:18,marginBottom:12,border:"1.5px solid var(--border)",animation:"fadeUp 0.4s ease both"}}>
            <img src={IMG_DOLPHIN_SLEEP} alt="💤" style={{width:56,height:56,objectFit:"contain",flexShrink:0}} />
            <div>
              <div style={{fontSize:13,fontWeight:800,color:"var(--blue-dark)"}}>好久不見！</div>
              <div style={{fontSize:12,color:"var(--text-2)",fontWeight:600}}>超過 3 天沒練習了，快來開口說英文 🐬</div>
            </div>
          </div>
        );
      })()}

      {/* Streak bar — hide for new users (first 3 days) */}
      {!isNewUser && <div className="streak-bar" style={{position:"relative",overflow:"visible",marginBottom:streak>=3?28:16}}>
        {streak >= 7 && (
          <img src={IMG_DOLPHIN_HAPPY} alt="🎉" style={{
            position:"absolute",right:-8,top:-50,width:80,height:80,objectFit:"contain",
            animation:"popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
            filter:"drop-shadow(0 4px 10px rgba(59,139,235,0.35))",pointerEvents:"none",
          }} />
        )}
        {streak >= 3 && streak < 7 && (
          <img src={IMG_DOLPHIN_HAPPY} alt="🎉" style={{
            position:"absolute",right:-8,top:-42,width:66,height:66,objectFit:"contain",
            animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
            filter:"drop-shadow(0 3px 8px rgba(59,139,235,0.3))",pointerEvents:"none",
          }} />
        )}
        {streak === 0
          ? <img src={IMG_DOLPHIN_SLEEP} alt="💤" style={{width:44,height:44,objectFit:"contain",flexShrink:0}} />
          : <span className="streak-flame">🔥</span>
        }
        <div className="streak-info">
          <div className="streak-count">{streak}</div>
          <div className="streak-label">
            {streak >= 7 ? "🎉 連續 "+streak+" 天！超厲害！" :
             streak >= 3 ? "🐬 連續 "+streak+" 天，繼續！" :
             "連續練習天數"}
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.22)",color:"white",padding:"4px 12px",borderRadius:99,fontSize:11,fontWeight:800}}>
          {streakDays.filter(d=>d.startsWith(String(now.getFullYear())+"-"+String(now.getMonth()+1).padStart(2,"0"))).length} 天/本月
        </div>
      </div>}

      {/* Stats — hide for new users */}
      {!isNewUser && <div className="stat-row">
        <div className="stat-item">
          <div className="stat-value">{stats.sessions}</div>
          <div className="stat-label">練習場次</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.savedSentences}</div>
          <div className="stat-label">已儲存句子</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{streakDays.length}</div>
          <div className="stat-label">累積天數</div>
        </div>
      </div>}

      {/* Scenarios */}
      <div className="section-label">選擇練習場景</div>
      {SCENARIOS.map(s => (
        <div key={s.id} className="scenario-card"
          onClick={() => s.id === "custom" ? onStartCustom() : onStartScenario(s)}
          style={s.id === "custom" ? {borderStyle:"dashed",borderColor:"var(--amber)"} : {}}
        >
          <span className="scenario-emoji">{s.emoji}</span>
          <div className="scenario-info">
            <div className="scenario-name">{s.name}</div>
            <div className="scenario-desc">{s.desc}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span className={`badge ${s.id==="custom" ? "badge-amber" : "badge-muted"}`}>{s.level}</span>
            <span className="scenario-arrow">›</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Progress Page ────────────────────────────────────────────────────────────
function ProgressPage() {
  const streakDays = LS.get(KEY_STREAK_DAYS, []);
  const stats      = LS.get(KEY_STATS, { savedSentences: 0, sessions: 0 });

  // Compute current streak
  const now = new Date();
  const todayISO = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const streak = (() => {
    if (!streakDays.includes(todayISO)) {
      // Check from yesterday
      let d = new Date(); d.setDate(d.getDate()-1);
      let count = 0;
      while (true) {
        const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
        if (!streakDays.includes(iso)) break;
        count++;
        d.setDate(d.getDate()-1);
      }
      return count;
    }
    let count = 0, d = new Date();
    while (true) {
      const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      if (!streakDays.includes(iso)) break;
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  // Check if inactive 3+ days
  const mkISO = (daysAgo) => new Date(Date.now() - daysAgo*86400000).toISOString().slice(0,10);
  const inactive = streakDays.length >= 3 &&
    !streakDays.includes(mkISO(0)) &&
    !streakDays.includes(mkISO(1)) &&
    !streakDays.includes(mkISO(2));

  return (
    <div className="page">
      <div className="page-title">學習紀錄</div>
      <div className="page-subtitle">追蹤你的練習進度</div>

      {/* Status banner with dolphin */}
      {inactive ? (
        <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"var(--blue-light)",borderRadius:18,marginBottom:16,border:"1.5px solid var(--border)",animation:"fadeUp 0.4s ease both"}}>
          <img src={IMG_DOLPHIN_SLEEP} alt="💤" style={{width:64,height:64,objectFit:"contain",flexShrink:0}} />
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"var(--blue-dark)"}}>好久不見！</div>
            <div style={{fontSize:12,color:"var(--text-2)",fontWeight:600,marginTop:2}}>已超過 3 天沒練習，快來開口說英文 🐬</div>
          </div>
        </div>
      ) : streak >= 3 ? (
        <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"linear-gradient(135deg, var(--blue-light) 0%, var(--yellow-light) 100%)",borderRadius:18,marginBottom:16,border:"1.5px solid var(--border)",animation:"fadeUp 0.4s ease both"}}>
          <img src={IMG_DOLPHIN_HAPPY} alt="🎉" style={{width:64,height:64,objectFit:"contain",flexShrink:0,filter:"drop-shadow(0 3px 6px rgba(59,139,235,0.25))"}} />
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"var(--blue-dark)"}}>
              {streak >= 7 ? `🎉 連續 ${streak} 天！太厲害了！` : `🐬 連續 ${streak} 天，繼續加油！`}
            </div>
            <div style={{fontSize:12,color:"var(--text-2)",fontWeight:600,marginTop:2}}>
              {streak >= 7 ? "你已經養成了學習習慣！" : "再幾天就達到 7 天里程碑了！"}
            </div>
          </div>
        </div>
      ) : streak > 0 ? (
        <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"var(--bg-card)",borderRadius:18,marginBottom:16,border:"1.5px solid var(--border)"}}>
          <div style={{fontSize:48,flexShrink:0}}>🔥</div>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"var(--blue-dark)"}}>連續 {streak} 天練習中</div>
            <div style={{fontSize:12,color:"var(--text-2)",fontWeight:600,marginTop:2}}>連續 3 天會有小驚喜 🐬</div>
          </div>
        </div>
      ) : null}

      <MiniCalendar practicedDays={streakDays} />

      <div className="section-label">本月統計</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {[
          { v: stats.sessions,        l: "總練習場次" },
          { v: stats.savedSentences,  l: "已儲存句子" },
          { v: streakDays.length,     l: "累積練習天數" },
          { v: "—",                   l: "字卡練習正確率" },
        ].map(({ v, l }) => (
          <div key={l} className="stat-item" style={{textAlign:"left",padding:"16px"}}>
            <div className="stat-value">{v}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="section-label">練習天數</div>
      <div className="card" style={{padding:"16px 18px"}}>
        {streakDays.length === 0
          ? <div style={{fontSize:13,color:"var(--text-3)",textAlign:"center",padding:"12px 0"}}>
              還沒有練習紀錄。完成第一場對話後就會開始記錄！
            </div>
          : streakDays.slice().reverse().slice(0, 10).map(d => (
              <div key={d} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:13,fontFamily:"'JetBrains Mono',monospace"}}>{d}</span>
                <span className="badge badge-green"><Icons.Check /> 有練習</span>
              </div>
            ))
        }
      </div>
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────
function SettingsPage({ keys, setKeys, darkMode, setDarkMode }) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetApp, setShowResetApp] = useState(false);

  const handleSaveKeys = (newKeys) => {
    LS.set(KEY_AZURE_KEY,    newKeys.azureKey);
    LS.set(KEY_AZURE_REGION, newKeys.azureRegion);
    LS.set(KEY_GEMINI_KEY,   newKeys.geminiKey);
    setKeys(newKeys);
  };

  const handleClearData = () => {
    LS.set(KEY_STREAK_DAYS, []);
    LS.set(KEY_STATS, { savedSentences: 0, sessions: 0 });
    setShowClearConfirm(false);
    alert("練習紀錄已清除。");
  };

  const KeyStatus = ({ label, value }) => (
    <div style={{marginBottom:8}}>
      <div style={{fontSize:13,fontWeight:500,marginBottom:3}}>{label}</div>
      <div className="key-status">
        <div className={`key-dot ${value ? "set" : "unset"}`} />
        <span style={{fontSize:12,color:"var(--text-2)"}}>
          {value
            ? `已設定（${value.slice(0,6)}...${value.slice(-4)}）`
            : "尚未設定"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-title">設定</div>
      <div className="page-subtitle">管理 API 金鑰與 App 偏好設定</div>

      <div className="section-label" style={{marginTop:0}}>API 金鑰狀態</div>
      <div className="settings-section">
        <div className="settings-row" onClick={() => setShowKeyModal(true)}>
          <div className="settings-row-left">
            <div className="settings-row-title">🔑 管理 API 金鑰</div>
            <div style={{marginTop:8}}>
              <KeyStatus label="Azure Speech" value={keys.azureKey} />
              <KeyStatus label="Gemini API"   value={keys.geminiKey} />
            </div>
          </div>
          <div className="settings-row-right">
            編輯 <Icons.ChevronRight />
          </div>
        </div>
      </div>

      <div className="section-label">外觀</div>
      <div className="settings-section">
        <div className="settings-row" style={{cursor:"default"}}>
          <div className="settings-row-left">
            <div className="settings-row-title">{darkMode ? <><Icons.Moon /> 深色模式</> : <><Icons.Sun /> 淺色模式</>}</div>
            <div className="settings-row-desc">切換介面主題</div>
          </div>
          <Toggle checked={darkMode} onChange={v => { setDarkMode(v); LS.set(KEY_DARK_MODE, v); }} />
        </div>
      </div>

      <div className="section-label">資料管理</div>
      <div className="settings-section">
        <div className="settings-row" onClick={() => {
          const data = {
            library:    LS.get(KEY_LIBRARY, []),
            streakDays: LS.get(KEY_STREAK_DAYS, []),
            stats:      LS.get(KEY_STATS, {}),
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = "voiceup_backup.json"; a.click();
        }}>
          <div className="settings-row-left">
            <div className="settings-row-title">📤 匯出練習紀錄</div>
            <div className="settings-row-desc">下載 JSON 備份檔（含儲存的句子）</div>
          </div>
          <div className="settings-row-right"><Icons.ChevronRight /></div>
        </div>
        <div className="settings-row" onClick={() => {
          const input = document.createElement("input");
          input.type = "file"; input.accept = ".json";
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              try {
                const data = JSON.parse(ev.target.result);
                // Merge library: combine existing + imported, deduplicate by id
                if (Array.isArray(data.library)) {
                  const existing = LS.get(KEY_LIBRARY, []) || [];
                  const existingIds = new Set(existing.map(e => e.id));
                  const merged = [...existing, ...data.library.filter(e => !existingIds.has(e.id))];
                  LS.set(KEY_LIBRARY, merged);
                }
                if (data.streakDays) LS.set(KEY_STREAK_DAYS, data.streakDays);
                if (data.stats) LS.set(KEY_STATS, data.stats);
                alert("✅ 匯入成功！句子已合併到學習庫。");
              } catch { alert("❌ 檔案格式錯誤，請使用 VoiceUp 匯出的 JSON 檔案。"); }
            };
            reader.readAsText(file);
          };
          input.click();
        }}>
          <div className="settings-row-left">
            <div className="settings-row-title">📥 匯入備份</div>
            <div className="settings-row-desc">匯入 JSON 備份，句子會與現有資料合併</div>
          </div>
          <div className="settings-row-right"><Icons.ChevronRight /></div>
        </div>
        <div className="settings-row" onClick={() => setShowClearConfirm(true)}>
          <div className="settings-row-left">
            <div className="settings-row-title" style={{color:"var(--red)"}}>🗑 清除所有練習紀錄</div>
            <div className="settings-row-desc">連續天數、統計資料將全部清除</div>
          </div>
          <div className="settings-row-right"><Icons.ChevronRight /></div>
        </div>
        <div className="settings-row" onClick={() => setShowResetApp(true)}>
          <div className="settings-row-left">
            <div className="settings-row-title" style={{color:"var(--red)"}}>⚠️ 完全重置 App</div>
            <div className="settings-row-desc">清除所有資料並重新初始化（測試用）</div>
          </div>
          <div className="settings-row-right"><Icons.ChevronRight /></div>
        </div>
      </div>

      <div className="section-label">關於</div>
      <div className="settings-section">
        <div className="settings-row" style={{cursor:"default"}}>
          <div className="settings-row-left">
            <div className="settings-row-title">VoiceUp</div>
            <div className="settings-row-desc">中階英文口說練習 · v0.1.0 MVP</div>
          </div>
        </div>
      </div>

      <div style={{height:20}} />

      {showKeyModal && (
        <KeysModal
          initial={keys}
          onClose={() => setShowKeyModal(false)}
          onSave={handleSaveKeys}
        />
      )}

      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">確認清除？</div>
            <div className="modal-desc">
              這個動作無法復原。所有練習紀錄與連續天數都會被清除。API 金鑰不受影響。
            </div>
            <button className="btn btn-full" style={{background:"var(--red)",color:"white",marginBottom:10}} onClick={handleClearData}>
              確認清除
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => setShowClearConfirm(false)}>取消</button>
          </div>
        </div>
      )}

      {showResetApp && (
        <div className="modal-overlay" onClick={() => setShowResetApp(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">⚠️ 確認完全重置？</div>
            <div className="modal-desc" style={{lineHeight:1.8}}>
              以下資料將全部清除且<strong>無法復原</strong>：<br/>
              • 所有 API 金鑰<br/>
              • 學習庫所有句子<br/>
              • 練習紀錄與連續天數<br/><br/>
              App 將重新回到初始設定畫面。
            </div>
            <button className="btn btn-full" style={{background:"var(--red)",color:"white",marginBottom:10}}
              onClick={() => { localStorage.clear(); window.location.reload(); }}>
              確認重置
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => setShowResetApp(false)}>取消</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Quiz Modal ──────────────────────────────────────────────────────────────
// mode: "flashcard" = 字卡練習 | "dialog" = 情境對話考驗
function QuizModal({ mode, library, allTags, onClose }) {
  const isDialog = mode === "dialog";

  // ── shared state ──────────────────────────────────────────────────────────
  const [step,          setStep]          = useState("setup");
  const [selectedTag,   setSelectedTag]   = useState("全部");
  const [questionCount, setQuestionCount] = useState(10);

  // ── 字卡練習 state ────────────────────────────────────────────────────────
  const [questions,  setQuestions]  = useState([]);
  const [qIndex,     setQIndex]     = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [judging,    setJudging]    = useState(false);
  const [feedback,   setFeedback]   = useState(null);
  const [results,    setResults]    = useState([]);

  // ── 情境對話考驗 state ────────────────────────────────────────────────────
  // targets: array of library items to "detect" in the conversation
  // detected: Set of item ids that have been naturally used
  // chatHistory: [{role:"ai"|"user", text}]
  // hintsGiven: map of item.id → how many hints given (0/1/2)
  const [targets,      setTargets]      = useState([]);
  const [detected,     setDetected]     = useState(() => new Set());
  const [hintsGiven,   setHintsGiven]   = useState(() => ({}));
  const [chatHistory,  setChatHistory]  = useState([]);
  const [dialogInput,  setDialogInput]  = useState("");
  const [dialogBusy,   setDialogBusy]   = useState(false);
  const [dialogDone,   setDialogDone]   = useState(false);
  const chatEndRef = useRef(null);

  const eligible = library.filter(it =>
    selectedTag === "全部" || (it.tags || []).includes(selectedTag)
  );

  // auto-scroll dialog
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, dialogBusy]);

  // ── START ─────────────────────────────────────────────────────────────────
  const startQuiz = async () => {
    const count = Math.min(questionCount, eligible.length);
    const shuffled = [...eligible].sort(() => Math.random() - 0.5).slice(0, count);

    if (isDialog) {
      setTargets(shuffled);
      setDetected(new Set());
      setHintsGiven({});
      setChatHistory([]);
      setDialogDone(false);
      setStep("quiz");
      // AI opens the conversation
      setDialogBusy(true);
      try {
        const targetList = shuffled.map(t => `"${t.english}"`).join(", ");
        const raw = await callAI(
          `You are running an English speaking assessment conversation.
The user has saved these target sentences in their study library: [${targetList}]
Your job: have a natural conversation that gradually creates opportunities for the user to use each target sentence naturally.
DO NOT mention or hint at the target sentences directly.
Start with a casual, engaging opening that sets a real-world scenario (e.g. workplace, travel, social situation).
The opening should not require the user to use any target sentence immediately — just get the conversation going.
Reply with ONLY the opening line (1-2 sentences, plain text, no JSON).`,
          [],
          "Start the conversation."
        );
        const opener = raw.trim();
        setChatHistory([{ role: "ai", text: opener }]);
      } catch (err) {
        setChatHistory([{ role: "ai", text: "Let's chat! Tell me about something interesting that happened to you recently." }]);
        console.warn("Dialog opener error:", err.message);
      }
      setDialogBusy(false);
    } else {
      // 字卡練習
      setQuestions(shuffled);
      setQIndex(0);
      setResults([]);
      setUserAnswer("");
      setFeedback(null);
      setStep("quiz");
    }
  };

  // ── 字卡練習: judge answer ─────────────────────────────────────────────────
  const judgeAnswer = async () => {
    if (!userAnswer.trim()) return;
    const current = questions[qIndex];
    setJudging(true);
    try {
      const raw = await callAI(
        "You judge English translation answers. Output only valid JSON, no markdown.",
        [],
        `Target sentence: "${current.english}"
User's answer: "${userAnswer}"

Judge if the user's answer expresses the SAME MEANING. Different wording is OK if meaning is the same. Be lenient.
Reply: {"correct":true|false,"note":"1-2 sentences in 繁體中文 explaining the result and any improvement tips"}`
      );
      const parsed = parseGeminiJSON(raw);
      const fb = parsed || { correct: false, note: "無法判斷，請手動評分。" };
      setFeedback(fb);
      setResults(prev => [...prev, { question: current, userAnswer, correct: fb.correct, note: fb.note }]);
      const lib = (LS.get(KEY_LIBRARY, []) || []).map(it =>
        it.id === current.id ? { ...it, lastQuizCorrect: fb.correct } : it
      );
      LS.set(KEY_LIBRARY, lib);
    } catch {
      setFeedback({ correct: false, note: "判斷失敗，請重試。" });
    }
    setJudging(false);
  };

  const nextFlashcard = () => {
    const newIdx = qIndex + 1;
    setUserAnswer(""); setFeedback(null);
    if (newIdx >= questions.length) setStep("done");
    else setQIndex(newIdx);
  };

  const retryWrong = () => {
    const wrong = results.filter(r => !r.correct).map(r => r.question);
    if (!wrong.length) { onClose(); return; }
    setQuestions(wrong); setQIndex(0); setResults([]); setUserAnswer(""); setFeedback(null);
  };

  // ── 情境對話考驗: send message ────────────────────────────────────────────
  const sendDialogMessage = async () => {
    if (!dialogInput.trim() || dialogBusy) return;
    const userText = dialogInput.trim();
    setDialogInput("");
    setDialogBusy(true);

    const newHistory = [...chatHistory, { role: "user", text: userText }];
    setChatHistory(newHistory);

    try {
      const remainingTargets = targets.filter(t => !detected.has(t.id));
      const detectedIds      = new Set(detected);
      const newHints         = { ...hintsGiven };

      // Ask AI to: (1) detect if any target was used, (2) reply naturally, (3) optionally give a hint
      const targetList = remainingTargets.map(t => `[ID:${t.id}] "${t.english}"`).join("; ");
      const hintNeeded = remainingTargets.find(t => (newHints[t.id] || 0) < 2 &&
        newHistory.filter(m => m.role === "user").length > (detectedIds.size + 1) * 2
      );

      const systemPrompt = `You are conducting a natural English conversation to assess the user's ability to use specific sentences.

Remaining target sentences to detect: ${targetList || "(all detected — wrap up the conversation)"}
Already detected: ${targets.filter(t => detected.has(t.id)).map(t => t.english).join(", ") || "none yet"}

RULES:
1. Continue the conversation naturally and engagingly (1-3 sentences).
2. Check if the user's latest message semantically matches any remaining target sentence. Be lenient — similar meaning counts.
3. If all targets are detected, set "allDone": true in your response.
4. If a target has gone undetected for a while, you may gently steer the conversation toward a situation where it's natural to use it — but NEVER quote the target sentence directly.
5. If you give a hint, increment hint count.

Reply ONLY with valid JSON:
{
  "reply": "your conversational response (plain English)",
  "detectedIds": [list of [ID:xxx] ids just detected in this message, or []],
  "allDone": false,
  "hintGiven": null or the id of the target you hinted at
}`;

      const raw = await callAI(systemPrompt, [], `User said: "${userText}"

Conversation so far: ${newHistory.map(m=>`${m.role}: ${m.text}`).join(" | ")}`);
      const parsed = parseGeminiJSON(raw);

      if (parsed) {
        // Process detected targets
        if (parsed.detectedIds?.length) {
          parsed.detectedIds.forEach(raw_id => {
            const id = parseInt(String(raw_id).replace(/\D/g, ""));
            if (id) detectedIds.add(id);
          });
          setDetected(new Set(detectedIds));
        }

        if (parsed.hintGiven) {
          const hid = parseInt(String(parsed.hintGiven).replace(/\D/g, ""));
          if (hid) newHints[hid] = (newHints[hid] || 0) + 1;
          setHintsGiven(newHints);
        }

        const aiMsg = { role: "ai", text: parsed.reply || "..." };
        setChatHistory(prev => [...prev, aiMsg]);

        if (parsed.allDone || detectedIds.size >= targets.length) {
          setDialogDone(true);
        }
      } else {
        setChatHistory(prev => [...prev, { role: "ai", text: raw.trim() }]);
      }
    } catch {
      setChatHistory(prev => [...prev, { role: "ai", text: "Hmm, let me think... Could you say that again?" }]);
    }
    setDialogBusy(false);
  };

  const correctCount = results.filter(r => r.correct).length;

  // ══════════════════════════════════════════════════════════════════════════
  // SETUP SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (step === "setup") return (
    <Portal>
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">
          {isDialog ? "💬 情境對話考驗" : "🃏 字卡練習"}
        </div>
        <div className="modal-desc">
          {isDialog
            ? "AI 開啟一段真實對話。你在對話中自然用出你的學習庫句子——不用死背，考的是你能不能在情境中活用。"
            : "看中文翻譯，用英文說出或打出來。AI 寬鬆判斷語意是否正確。"}
        </div>

        <div className="input-group">
          <div className="input-label">選擇分類</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {allTags.map(t => (
              <span key={t} className={`tag-chip ${selectedTag===t ? "selected" : ""}`}
                onClick={() => setSelectedTag(t)}>{t}</span>
            ))}
          </div>
          <div style={{fontSize:11,color:"var(--text-3)",marginTop:6}}>此分類有 {eligible.length} 個句子</div>
        </div>

        <div className="input-group">
          <div className="input-label">{isDialog ? "目標句子數" : "題數"}</div>
          <div style={{display:"flex",gap:6}}>
            {[5,10,15].map(n => (
              <button key={n}
                className={`btn ${questionCount===n ? "btn-primary" : "btn-ghost"} btn-sm`}
                style={{flex:1,padding:"8px 0",fontSize:13}}
                onClick={() => setQuestionCount(n)}
                disabled={eligible.length < n && n !== 5}
              >{n}</button>
            ))}
          </div>
          {eligible.length < questionCount && (
            <div style={{fontSize:11,color:"var(--amber)",marginTop:5}}>
              此分類僅 {eligible.length} 個句子，將全部納入
            </div>
          )}
        </div>

        {isDialog && (
          <div className="card" style={{padding:"12px 14px",marginBottom:16,fontSize:12,color:"var(--text-2)",lineHeight:1.6}}>
            💡 <strong>怎麼考？</strong><br/>
            AI 會開啟一段日常對話，並在對話中自然創造機會讓你用到學習庫裡的句子。<br/>
            你不知道要考哪些句子——如果你自然用出來了，AI 會悄悄記錄。<br/>
            說不出來也不急，AI 會給提示，最多提示 2 次。
          </div>
        )}

        <button className="btn btn-primary btn-full" onClick={startQuiz}
          disabled={eligible.length === 0}>
          {eligible.length === 0 ? "此分類無句子" : "開始"}
        </button>
        <button className="btn btn-ghost btn-full" style={{marginTop:8}} onClick={onClose}>取消</button>
      </div>
    </div>
    </Portal>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // QUIZ SCREEN — 字卡練習
  // ══════════════════════════════════════════════════════════════════════════
  if (step === "quiz" && !isDialog) {
    const current = questions[qIndex];
    if (!current) return null;
    return (
      <Portal>
      <div className="modal-overlay" style={{alignItems:"stretch"}}>
        <div className="modal-sheet" style={{display:"flex",flexDirection:"column",maxHeight:"100vh"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div>
              <div style={{fontSize:11,color:"var(--text-3)",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>
                第 {qIndex+1} / {questions.length} 題
              </div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20,marginTop:2}}>🃏 字卡練習</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>結束</button>
          </div>

          <div className="card" style={{marginBottom:16,padding:"22px 18px",textAlign:"center"}}>
            <div style={{fontSize:11,color:"var(--amber)",fontWeight:700,marginBottom:12,letterSpacing:"0.06em"}}>翻譯成英文</div>
            <div style={{fontSize:19,fontWeight:600,lineHeight:1.5}}>
              {current.chinese || "（無中文翻譯，憑記憶說出英文）"}
            </div>
            {!current.chinese && (
              <div style={{fontSize:12,color:"var(--text-3)",marginTop:8,fontStyle:"italic"}}>
                提示：{current.english.slice(0,10)}...
              </div>
            )}
          </div>

          {!feedback ? (
            <>
              <textarea className="input-field-text" value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); judgeAnswer(); } }}
                placeholder="用英文打字回答，Enter 送出..." rows={3}
                style={{resize:"none",marginBottom:12}} disabled={judging} />
              <button className="btn btn-primary btn-full" onClick={judgeAnswer}
                disabled={!userAnswer.trim() || judging}>
                {judging ? "判斷中..." : "送出"}
              </button>
            </>
          ) : (
            <>
              <div className="card" style={{
                marginBottom:14,padding:"14px 16px",
                background: feedback.correct ? "rgba(76,175,130,0.08)" : "rgba(224,90,90,0.06)",
                borderColor: feedback.correct ? "rgba(76,175,130,0.3)" : "rgba(224,90,90,0.3)",
              }}>
                <div style={{fontSize:14,fontWeight:700,color:feedback.correct?"var(--green)":"var(--red)",marginBottom:8}}>
                  {feedback.correct ? "✓ 答對！" : "✗ 不太對"}
                </div>
                <div style={{fontSize:12,color:"var(--text-3)",marginBottom:3}}>你的回答：</div>
                <div style={{fontSize:13,marginBottom:10,lineHeight:1.5}}>{userAnswer}</div>
                <div style={{fontSize:12,color:"var(--text-3)",marginBottom:3}}>標準答案：</div>
                <div style={{fontSize:14,fontWeight:600,color:"var(--green)",marginBottom:8,lineHeight:1.5}}>{current.english}</div>
                {feedback.note && (
                  <div style={{fontSize:12,color:"var(--text-2)",lineHeight:1.6,paddingTop:8,borderTop:"1px solid var(--border)"}}>
                    💡 {feedback.note}
                  </div>
                )}
              </div>
              <button className="btn btn-primary btn-full" onClick={nextFlashcard}>
                {qIndex+1 >= questions.length ? "完成" : "下一題 →"}
              </button>
            </>
          )}
        </div>
      </div>
      </Portal>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // QUIZ SCREEN — 情境對話考驗
  // ══════════════════════════════════════════════════════════════════════════
  if (step === "quiz" && isDialog) {
    const detectedCount = detected.size;
    const totalCount    = targets.length;

    return (
      <Portal>
      <div className="dialog-quiz-shell" style={{animation:"fadeUp 0.3s ease both"}}>
          {/* Header */}
          <div style={{
            padding:"14px 16px",borderBottom:"1px solid var(--border)",
            background:"var(--bg-card)",flexShrink:0,
            display:"flex",alignItems:"center",justifyContent:"space-between",
          }}>
            <div>
              <div style={{fontFamily:"'Fredoka',sans-serif",fontSize:20,fontWeight:600}}>💬 情境對話考驗</div>
              <div style={{fontSize:11,color:"var(--text-3)",marginTop:2}}>
                已自然用出 {detectedCount} / {totalCount} 個目標句子
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {/* Progress dots */}
              <div style={{display:"flex",gap:4}}>
                {targets.map(t => (
                  <div key={t.id} style={{
                    width:10,height:10,borderRadius:"50%",
                    background: detected.has(t.id) ? "var(--green)" : "var(--border)",
                    transition:"background 0.4s",
                  }} title={t.english} />
                ))}
              </div>
              {!dialogDone
                ? <button className="btn btn-ghost btn-sm"
                    onClick={() => setDialogDone(true)}>結束對話</button>
                : <button className="btn btn-primary btn-sm"
                    onClick={() => setStep("done")}>查看成績 →</button>
              }
            </div>
          </div>

          {/* Chat messages */}
          <div className="dialog-quiz-messages">
            {chatHistory.map((msg, i) => {
              const isUser = msg.role === "user";
              // Check if this user message triggered a detection
              return (
                <div key={i} style={{display:"flex",gap:8,flexDirection:isUser?"row-reverse":"row",animation:"fadeUp 0.2s ease both"}}>
                  <div style={{
                    width:30,height:30,borderRadius:"50%",flexShrink:0,
                    background:isUser?"var(--bg-input)":"var(--amber-glow)",
                    border:`1.5px solid ${isUser?"var(--border)":"rgba(232,164,74,0.3)"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,
                  }}>
                    {isUser ? "🗣" : "🤖"}
                  </div>
                  <div style={{
                    maxWidth:"76%",padding:"10px 13px",borderRadius:14,fontSize:14,lineHeight:1.55,
                    background:isUser?"var(--amber)":"var(--bg-card)",
                    color:isUser?"#1A1714":"var(--text)",
                    border:isUser?"none":"1px solid var(--border)",
                    borderBottomRightRadius:isUser?4:14,
                    borderBottomLeftRadius:isUser?14:4,
                  }}>
                    {msg.text}
                    {msg.detectedTarget && (
                      <div style={{fontSize:11,color:isUser?"rgba(26,23,20,0.7)":"var(--green)",marginTop:4,fontWeight:600}}>
                        ✓ 用出：{msg.detectedTarget}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {dialogBusy && (
              <div style={{display:"flex",gap:8}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:"var(--amber-glow)",border:"1.5px solid rgba(232,164,74,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
                <div style={{padding:"10px 13px",background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"14px 14px 14px 4px",display:"flex",gap:4,alignItems:"center"}}>
                  <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
                </div>
              </div>
            )}
            {dialogDone && (
              <div style={{textAlign:"center",padding:"12px 0",fontSize:13,color:"var(--amber)",fontWeight:600}}>
                🎉 對話考驗完成！請按下方「查看成績」
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          {!dialogDone && (
            <div className="dialog-quiz-input">
              <textarea
                className="input-field-text"
                value={dialogInput}
                onChange={e => setDialogInput(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendDialogMessage(); } }}
                placeholder="用英文回應，Enter 送出..."
                rows={1} style={{flex:1,resize:"none",minHeight:44,maxHeight:100}}
                disabled={dialogBusy}
              />
              <button className="send-btn" onClick={sendDialogMessage} disabled={!dialogInput.trim()||dialogBusy}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          )}
      </div>
      </Portal>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // DONE SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (!isDialog) {
    const wrongCount = results.length - correctCount;
    return (
      <Portal>
      <div className="modal-overlay">
        <div className="modal-sheet" style={{textAlign:"center",paddingTop:32}}>
          <div className="modal-handle" />
          <div style={{fontSize:48,marginBottom:8}}>
            {correctCount===results.length?"🎉":correctCount>=results.length/2?"👏":"💪"}
          </div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,marginBottom:6}}>字卡練習完成！</div>
          <div style={{fontSize:13,color:"var(--text-2)",marginBottom:24}}>
            答對 <span style={{color:"var(--green)",fontWeight:700,fontSize:16}}>{correctCount}</span> / {results.length} 題
          </div>
          {wrongCount > 0 && (
            <div style={{textAlign:"left",marginBottom:20}}>
              <div className="section-label" style={{marginTop:0}}>答錯的句子</div>
              {results.filter(r=>!r.correct).map((r,i)=>(
                <div key={i} className="card" style={{padding:"12px 14px",marginBottom:8}}>
                  <div style={{fontSize:12,color:"var(--text-3)",marginBottom:3}}>你說：{r.userAnswer}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--green)"}}>✓ {r.question.english}</div>
                  {r.question.chinese&&<div style={{fontSize:11,color:"var(--text-3)",marginTop:2}}>{r.question.chinese}</div>}
                </div>
              ))}
            </div>
          )}
          {wrongCount > 0 && (
            <button className="btn btn-primary btn-full" onClick={retryWrong}>
              🔄 只練錯題（{wrongCount} 題）
            </button>
          )}
          <button className="btn btn-ghost btn-full" style={{marginTop:8}} onClick={onClose}>完成關閉</button>
        </div>
      </div>
      </Portal>
    );
  }

  // Dialog done screen — FULLSCREEN with dolphin, close btn, transcript at bottom
  const detectedItems   = targets.filter(t => detected.has(t.id));
  const missedItems     = targets.filter(t => !detected.has(t.id));
  const hintedItems     = detectedItems.filter(t => (hintsGiven[t.id] || 0) > 0);
  const naturalItems    = detectedItems.filter(t => (hintsGiven[t.id] || 0) === 0);

  return (
    <Portal>
    <div className="dialog-quiz-shell">
      {/* Header with close button */}
      <div style={{
        padding:"14px 16px",borderBottom:"2px solid var(--border)",
        background:"var(--bg-card)",flexShrink:0,
        display:"flex",alignItems:"center",justifyContent:"space-between",
      }}>
        <div style={{fontFamily:"'Fredoka',sans-serif",fontSize:18,fontWeight:600}}>💬 考驗結果</div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕ 關閉</button>
      </div>

      {/* Scrollable content */}
      <div style={{flex:1,overflowY:"auto",padding:"20px 18px"}}>
        {/* Hero section — dolphin + title */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <img src={IMG_DOLPHIN_TEACHER} alt="完成"
            style={{width:120,height:120,objectFit:"contain",marginBottom:8,animation:"popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both"}} />
          <div style={{fontFamily:"'Fredoka',sans-serif",fontSize:24,fontWeight:600,marginBottom:6}}>情境對話考驗完成！</div>
          <div style={{fontSize:13,color:"var(--text-2)",fontWeight:600}}>
            自然用出 <span style={{color:"var(--green)",fontWeight:900,fontSize:17}}>{naturalItems.length}</span>
            {hintedItems.length>0 && <> + 提示後用出 <span style={{color:"var(--yellow-dim)",fontWeight:900,fontSize:17}}>{hintedItems.length}</span></>}
            {missedItems.length>0 && <> · 未用出 <span style={{color:"var(--red)",fontWeight:900,fontSize:17}}>{missedItems.length}</span></>}
            {" "}/ {targets.length} 個目標句子
          </div>
        </div>

        {naturalItems.length>0 && (
          <>
            <div className="section-label" style={{marginTop:0}}>✅ 自然用出（未提示）</div>
            {naturalItems.map(t=>(
              <div key={t.id} className="card" style={{padding:"10px 14px",marginBottom:8,borderColor:"rgba(52,199,123,0.35)",background:"var(--green-light)"}}>
                <div style={{fontSize:13,fontWeight:700}}>{t.english}</div>
                {t.chinese&&<div style={{fontSize:11,color:"var(--text-3)",marginTop:2}}>{t.chinese}</div>}
              </div>
            ))}
          </>
        )}
        {hintedItems.length>0 && (
          <>
            <div className="section-label">⚠️ 提示後用出</div>
            {hintedItems.map(t=>(
              <div key={t.id} className="card" style={{padding:"10px 14px",marginBottom:8,background:"var(--yellow-light)",borderColor:"rgba(245,166,35,0.3)"}}>
                <div style={{fontSize:13,fontWeight:700}}>{t.english}</div>
                {t.chinese&&<div style={{fontSize:11,color:"var(--text-3)",marginTop:2}}>{t.chinese}</div>}
                <div style={{fontSize:11,color:"var(--yellow-dim)",marginTop:3,fontWeight:700}}>提示了 {hintsGiven[t.id]} 次</div>
              </div>
            ))}
          </>
        )}
        {missedItems.length>0 && (
          <>
            <div className="section-label">❌ 未在對話中使用</div>
            {missedItems.map(t=>(
              <div key={t.id} className="card" style={{padding:"10px 14px",marginBottom:8,borderColor:"rgba(240,84,79,0.25)",background:"var(--red-light)"}}>
                <div style={{fontSize:13,fontWeight:700}}>{t.english}</div>
                {t.chinese&&<div style={{fontSize:11,color:"var(--text-3)",marginTop:2}}>{t.chinese}</div>}
              </div>
            ))}
          </>
        )}

        {/* Full conversation transcript with save buttons */}
        {chatHistory.length > 0 && (
          <>
            <div className="section-label">📜 完整對話紀錄</div>
            <div style={{fontSize:11,color:"var(--text-3)",marginBottom:12,fontWeight:600}}>
              點選句子右上角可儲存到學習庫
            </div>
            {chatHistory.map((msg, i) => (
              <DialogTranscriptRow key={i} msg={msg} index={i} />
            ))}
          </>
        )}

      </div>

      {/* Sticky close button — always visible outside scroll */}
      <div style={{flexShrink:0,padding:"12px 18px",borderTop:"1px solid var(--border)",background:"var(--bg-card)"}}>
        <button className="btn btn-primary btn-full" onClick={onClose}>完成關閉</button>
      </div>
    </div>
    </Portal>
  );
}

// ─── Single transcript row for dialog quiz result ──────────────────────────
function DialogTranscriptRow({ msg, index }) {
  const [saved,      setSaved]      = useState(false);
  const [entryId,    setEntryId]    = useState(null);
  const [showModal,  setShowModal]  = useState(false);

  const handleClick = () => {
    if (saved) {
      // Unsave
      if (entryId) {
        const lib = (LS.get(KEY_LIBRARY, []) || []).filter(e => e.id !== entryId);
        LS.set(KEY_LIBRARY, lib);
        const stats = LS.get(KEY_STATS, { savedSentences: 0, sessions: 0 });
        LS.set(KEY_STATS, { ...stats, savedSentences: Math.max(0,(stats.savedSentences||1)-1) });
      }
      setSaved(false);
      setEntryId(null);
      return;
    }
    setShowModal(true);
  };

  const isUser = msg.role === "user";
  return (
    <div style={{
      display:"flex",flexDirection:"column",gap:4,
      padding:"12px 14px",
      background:"var(--bg-card)",
      border:"1.5px solid var(--border)",
      borderRadius:14,marginBottom:8,
      borderLeft:`3px solid ${isUser?"var(--blue)":"var(--text-3)"}`,
      position:"relative",
    }}>
      <div style={{fontSize:10,fontWeight:800,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>
        {isUser ? "🗣 You" : "🤖 AI"}
      </div>
      <div style={{fontSize:14,lineHeight:1.5}}>{msg.text}</div>
      <button
        onClick={handleClick}
        style={{
          position:"absolute",top:10,right:10,
          background:saved?"var(--green-light)":"var(--bg-input)",
          border:`1.5px solid ${saved?"var(--green)":"var(--border)"}`,
          color:saved?"var(--green)":"var(--text-3)",
          fontSize:11,fontWeight:700,
          padding:"3px 10px",borderRadius:99,cursor:"pointer",
          transition:"all 0.15s",
        }}
        title={saved?"點擊取消":"儲存到學習庫"}
      >
        {saved ? "✓ 已存" : "＋ 儲存"}
      </button>

      {showModal && (
        <SaveSentenceModal
          sentence={msg.text}
          onSaved={(id) => { setSaved(true); setEntryId(id); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ─── Library Page (Full) ─────────────────────────────────────────────────────
function LibraryPage() {
  const [library,    setLibrary]    = useState(() => LS.get(KEY_LIBRARY, []) || []);
  const [filterTag,  setFilterTag]  = useState("全部");
  const [filterReview, setFilterReview] = useState("全部");
  const [saveTarget, setSaveTarget] = useState(null);
  const [editItem,   setEditItem]   = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [quizMode,   setQuizMode]   = useState(null); // null | "flashcard" | "dialog"
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const reload = () => setLibrary(LS.get(KEY_LIBRARY, []) || []);

  // All unique tags
  const allTags = ["全部", ...new Set(library.flatMap(item => item.tags || []))];

  // Filtered list
  const filtered = library.filter(item => {
    const tagMatch = filterTag === "全部" || (item.tags || []).includes(filterTag);
    const revMatch = filterReview === "全部"
      ? true
      : filterReview === "已複習" ? item.reviewed
      : !item.reviewed;
    return tagMatch && revMatch;
  });

  const markReviewed = (id) => {
    const lib = (LS.get(KEY_LIBRARY, []) || []).map(item =>
      item.id === id ? { ...item, reviewed: !item.reviewed } : item
    );
    LS.set(KEY_LIBRARY, lib);
    reload();
  };

  const deleteItem = (id) => {
    const lib = (LS.get(KEY_LIBRARY, []) || []).filter(item => item.id !== id);
    LS.set(KEY_LIBRARY, lib);
    const stats = LS.get(KEY_STATS, { savedSentences: 0, sessions: 0 });
    LS.set(KEY_STATS, { ...stats, savedSentences: Math.max(0, (stats.savedSentences || 1) - 1) });
    setDeleteId(null);
    reload();
  };

  return (
    <div className="page">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <div className="page-title">學習庫</div>
        <button className="btn btn-primary btn-sm" onClick={() => setSaveTarget("__new__")}>＋ 新增</button>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontSize:13,color:"var(--text-2)"}}>{library.length} 個已儲存 · 點卡片標記複習</div>
        {library.some(it => it.reviewed) && (
          <button
            onClick={() => setShowResetConfirm(true)}
            style={{
              background:"none",border:"none",fontSize:11,color:"var(--amber)",
              textDecoration:"underline",cursor:"pointer",padding:0,
            }}
          >🔄 全部重新複習</button>
        )}
      </div>

      {/* Quiz actions */}
      {library.length >= 3 && (
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <button
            className="btn btn-outline"
            style={{flex:1,padding:"10px 8px",fontSize:12}}
            onClick={() => setQuizMode("flashcard")}
          >🃏 字卡練習</button>
          <button
            className="btn btn-outline"
            style={{flex:1,padding:"10px 8px",fontSize:12}}
            onClick={() => setQuizMode("dialog")}
          >💬 情境對話考驗</button>
        </div>
      )}

      {/* Filter: Review status */}
      <div style={{display:"flex",gap:8,marginBottom:12,overflowX:"auto",paddingBottom:2}}>
        {["全部","未複習","已複習"].map(f => (
          <span key={f}
            onClick={() => setFilterReview(f)}
            style={{
              flexShrink:0, padding:"6px 16px", borderRadius:99,
              fontSize:12, fontWeight:800, cursor:"pointer",
              background: filterReview===f
                ? "linear-gradient(135deg,var(--blue) 0%,var(--blue-dark) 100%)"
                : "var(--bg-input)",
              color: filterReview===f ? "white" : "var(--text-2)",
              border: "2px solid " + (filterReview===f ? "var(--blue)" : "var(--border)"),
              transition:"all 0.2s",
              boxShadow: filterReview===f ? "0 4px 12px rgba(59,139,235,0.3)" : "none",
            }}
          >{f}</span>
        ))}
      </div>

      {/* Filter: Tags */}
      {allTags.length > 1 && (
        <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:2}}>
          {allTags.map(t => (
            <span key={t}
              onClick={() => setFilterTag(t)}
              className={`tag-chip ${filterTag===t ? "selected" : ""}`}
              style={{flexShrink:0}}
            >{t}</span>
          ))}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card" style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:36,marginBottom:10}}>📚</div>
          <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>
            {library.length === 0 ? "還沒有儲存的句子" : "沒有符合篩選的句子"}
          </div>
          <div style={{fontSize:12,color:"var(--text-3)",lineHeight:1.6}}>
            {library.length === 0 ? "在對話練習中點「＋ 儲存」，或點右上角「＋ 新增」手動輸入" : "試試調整篩選條件"}
          </div>
        </div>
      ) : (
        filtered.map(item => (
          <div key={item.id} style={{
            background: item.reviewed ? "rgba(76,175,130,0.07)" : "var(--bg-card)",
            border: "1.5px solid " + (item.reviewed ? "rgba(76,175,130,0.25)" : "var(--border)"),
            borderRadius:14, padding:"14px 14px 10px",
            marginBottom:10, boxShadow:"var(--shadow)",
            cursor:"pointer", transition:"all 0.2s",
          }}
            onClick={() => markReviewed(item.id)}
          >
            {/* Tags */}
            {item.tags?.length > 0 && (
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
                {item.tags.map(t => (
                  <span key={t} className="badge badge-muted" style={{fontSize:10}}>{t}</span>
                ))}
              </div>
            )}
            {/* English */}
            <div style={{fontSize:14,fontWeight:600,lineHeight:1.5,marginBottom:item.chinese ? 4 : 0}}>
              {item.english}
            </div>
            {/* Chinese */}
            {item.chinese && (
              <div style={{fontSize:12,color:"var(--text-2)",lineHeight:1.5}}>{item.chinese}</div>
            )}
            {/* Actions */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
              <span style={{fontSize:11,color: item.reviewed ? "var(--green)" : "var(--text-3)",fontWeight:600}}>
                {item.reviewed ? "✓ 已複習" : "○ 點擊標記複習"}
              </span>
              <div style={{display:"flex",gap:6}} onClick={e => e.stopPropagation()}>
                <button className="btn btn-ghost btn-sm"
                  style={{padding:"4px 10px",fontSize:11}}
                  onClick={() => setEditItem(item)}>編輯</button>
                <button className="btn btn-sm"
                  style={{padding:"4px 10px",fontSize:11,background:"rgba(224,90,90,0.1)",color:"var(--red)",border:"none"}}
                  onClick={() => setDeleteId(item.id)}>刪除</button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Add new (saveTarget = "__new__") */}
      {saveTarget === "__new__" && (
        <SaveSentenceModal sentence="" onClose={() => { setSaveTarget(null); reload(); }} />
      )}

      {/* Edit item */}
      {editItem && (
        <EditLibraryModal item={editItem} onClose={() => { setEditItem(null); reload(); }} />
      )}

      {/* Quiz Modal */}
      {quizMode && (
        <QuizModal
          mode={quizMode}
          library={library}
          allTags={allTags}
          onClose={() => { setQuizMode(null); reload(); }}
        />
      )}

      {/* Reset all reviewed confirm */}
      {showResetConfirm && (
        <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">全部重新複習？</div>
            <div className="modal-desc">將所有句子改為「未複習」狀態。不會刪除任何句子。</div>
            <button className="btn btn-primary btn-full" onClick={() => {
              const lib = (LS.get(KEY_LIBRARY, []) || []).map(it => ({...it, reviewed: false}));
              LS.set(KEY_LIBRARY, lib);
              setLibrary(lib);
              setShowResetConfirm(false);
            }}>確認重置</button>
            <button className="btn btn-ghost btn-full" style={{marginTop:8}} onClick={() => setShowResetConfirm(false)}>取消</button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">確認刪除？</div>
            <div className="modal-desc">此動作無法復原。</div>
            <button className="btn btn-full" style={{background:"var(--red)",color:"white",marginBottom:10}} onClick={() => deleteItem(deleteId)}>確認刪除</button>
            <button className="btn btn-ghost btn-full" onClick={() => setDeleteId(null)}>取消</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Edit Library Item Modal ──────────────────────────────────────────────────
function EditLibraryModal({ item, onClose }) {
  const [english,  setEnglish]  = useState(item.english);
  const [chinese,  setChinese]  = useState(item.chinese || "");
  const [tagInput, setTagInput] = useState("");
  const [tags,     setTags]     = useState(item.tags || []);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput("");
  };

  const handleSave = () => {
    const lib = (LS.get(KEY_LIBRARY, []) || []).map(i =>
      i.id === item.id ? { ...i, english, chinese, tags } : i
    );
    LS.set(KEY_LIBRARY, lib);
    onClose();
  };

  return (
    <div className="save-modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="save-sheet">
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20,marginBottom:16}}>編輯句子</div>
        <div className="input-group">
          <div className="input-label">英文</div>
          <textarea className="input-field-text" value={english} onChange={e => setEnglish(e.target.value)}
            rows={3} style={{resize:"none"}} />
        </div>
        <div className="input-group">
          <div className="input-label">中文翻譯</div>
          <input className="input-field-text" value={chinese} onChange={e => setChinese(e.target.value)} placeholder="輸入中文翻譯..." />
        </div>
        <div style={{marginBottom:12}}>
          <div className="input-label" style={{marginBottom:6}}>分類標籤</div>

          {/* Existing tags (from library) — selectable */}
          {(() => {
            const existingTags = [...new Set(
              (LS.get(KEY_LIBRARY, []) || []).flatMap(it => it.tags || [])
            )].filter(t => !tags.includes(t));
            return existingTags.length > 0 && (
              <div style={{marginBottom:8}}>
                <div style={{fontSize:10,color:"var(--text-3)",marginBottom:5}}>點選使用現有分類：</div>
                <div className="tag-row">
                  {existingTags.map(t => (
                    <span key={t} className="tag-chip"
                      onClick={() => setTags(prev => [...prev, t])}>{t}</span>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Currently selected tags */}
          {tags.length > 0 && (
            <div className="tag-row" style={{marginBottom:8}}>
              {tags.map(t => (
                <span key={t} className="tag-chip selected" onClick={() => setTags(prev => prev.filter(x => x !== t))}>{t} ✕</span>
              ))}
            </div>
          )}

          <div style={{display:"flex",gap:8}}>
            <input className="input-field-text" value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTag()} placeholder="新增分類..." style={{flex:1,padding:"8px 12px",fontSize:13}} />
            <button className="btn btn-ghost btn-sm" onClick={addTag}>＋</button>
          </div>
        </div>
        <button className="btn btn-primary btn-full" onClick={handleSave}>儲存修改</button>
        <button className="btn btn-ghost btn-full" style={{marginTop:8}} onClick={onClose}>取消</button>
      </div>
    </div>
  );
}

// ─── Practice CSS additions ───────────────────────────────────────────────────
const PRACTICE_STYLES = `
  .practice-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    max-width: 480px;
    margin: 0 auto;
    background: var(--bg);
  }

  /* Header */
  .practice-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px 12px;
    border-bottom: 2px solid var(--border);
    background: var(--bg-card);
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(59,139,235,0.06);
  }

  .practice-back {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-2);
    padding: 6px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    transition: background 0.15s;
  }
  .practice-back:hover { background: var(--bg-input); }

  .practice-scenario-info { flex: 1; }
  .practice-scenario-name { font-size: 15px; font-weight: 600; }
  .practice-scenario-sub  { font-size: 11px; color: var(--text-3); margin-top: 1px; }

  .practice-end-btn {
    background: none;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    padding: 6px 12px;
    font-family: 'Nunito', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-2);
    cursor: pointer;
    transition: all 0.15s;
  }
  .practice-end-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }

  /* Messages */
  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 16px 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scroll-behavior: smooth;
  }

  .msg-row {
    display: flex;
    gap: 10px;
    animation: fadeUp 0.25s ease both;
  }

  .msg-row.user { flex-direction: row-reverse; }

  .msg-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .msg-avatar.ai   { background: var(--amber-glow); border: 1.5px solid rgba(232,164,74,0.3); }
  .msg-avatar.user { background: var(--bg-input); border: 1.5px solid var(--border); }

  .msg-bubble-wrap { max-width: 78%; display: flex; flex-direction: column; gap: 4px; }
  .msg-row.user .msg-bubble-wrap { align-items: flex-end; }

  .msg-bubble {
    padding: 11px 14px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.55;
    position: relative;
  }

  .msg-bubble.ai {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
    color: var(--text);
  }

  .msg-bubble.user {
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
    color: white;
    border-bottom-right-radius: 4px;
    font-weight: 700;
    box-shadow: 0 3px 10px rgba(59,139,235,0.25);
  }

  .msg-bubble.system {
    background: var(--bg-input);
    color: var(--text-2);
    font-size: 12px;
    font-style: italic;
    border-radius: 10px;
    text-align: center;
    padding: 8px 14px;
  }

  /* Grammar feedback */
  .grammar-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
  }

  .grammar-panel {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 12px;
    line-height: 1.6;
    margin-top: 4px;
    animation: fadeUp 0.2s ease;
  }

  .grammar-panel .original { color: var(--red); text-decoration: line-through; margin-bottom: 4px; }
  .grammar-panel .suggested { color: var(--green); font-weight: 600; margin-bottom: 4px; }
  .grammar-panel .reason { color: var(--text-2); }

  /* Save button on msg */
  .msg-save-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-3);
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 6px;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .msg-save-btn:hover { background: var(--blue-light); color: var(--blue); }
  .msg-save-btn.saved { color: var(--green); }

  /* Typing indicator */
  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 12px 14px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    border-bottom-left-radius: 4px;
    width: fit-content;
  }
  .typing-dot {
    width: 7px; height: 7px;
    background: var(--text-3);
    border-radius: 50%;
    animation: typingBounce 1.2s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-5px); opacity: 1; }
  }

  .analyzing-dots { display: inline-flex; }
  .analyzing-dots span {
    opacity: 0;
    animation: dotPulse 1.4s infinite;
  }
  .analyzing-dots span:nth-child(1) { animation-delay: 0s; }
  .analyzing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .analyzing-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dotPulse {
    0%, 60%, 100% { opacity: 0; }
    30%           { opacity: 1; }
  }

  /* Input area */
  .input-area {
    flex-shrink: 0;
    padding: 10px 14px;
    padding-bottom: max(10px, env(safe-area-inset-bottom, 10px));
    background: var(--bg-card);
    border-top: 1px solid var(--border);
  }

  /* Hint bar */
  .hint-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    overflow-x: auto;
    padding-bottom: 2px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .hint-bar::-webkit-scrollbar { display: none; }

  .hint-chip {
    flex-shrink: 0;
    background: var(--bg-input);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-2);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .hint-chip:hover, .hint-chip.active { background: var(--blue-light); border-color: var(--blue); color: var(--blue-dark); }

  .hint-content {
    background: var(--blue-light);
    border: 2px solid rgba(59,139,235,0.25);
    border-radius: 14px;
    padding: 10px 14px;
    font-size: 13px;
    line-height: 1.5;
    color: var(--blue-dark);
    margin-bottom: 10px;
    animation: fadeUp 0.2s ease;
    font-weight: 600;
  }

  /* Input row */
  .input-row {
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

  .text-input-box {
    flex: 1;
    background: var(--bg-input);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 10px 14px;
    font-family: 'Nunito', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    resize: none;
    min-height: 44px;
    max-height: 120px;
    transition: border-color 0.2s;
    line-height: 1.4;
  }
  .text-input-box:focus { border-color: var(--amber); }
  .text-input-box::placeholder { color: var(--text-3); }

  /* Mic button */
  .mic-btn {
    width: 44px; height: 44px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .mic-btn.idle {
    background: var(--bg-input);
    color: var(--text-2);
  }
  .mic-btn.idle:hover { background: var(--blue-light); color: var(--blue); }

  .mic-btn.listening {
    background: var(--red);
    color: white;
    animation: micPulse 1.5s infinite;
    box-shadow: 0 0 0 0 rgba(224,90,90,0.4);
  }

  @keyframes micPulse {
    0%   { box-shadow: 0 0 0 0 rgba(224,90,90,0.4); }
    70%  { box-shadow: 0 0 0 10px rgba(224,90,90,0); }
    100% { box-shadow: 0 0 0 0 rgba(224,90,90,0); }
  }

  .mic-btn.processing {
    background: var(--blue);
    color: white;
    animation: spin 1s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .send-btn {
    width: 44px; height: 44px;
    border-radius: 50%;
    border: none;
    background: var(--amber);
    color: #1A1714;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .send-btn:hover { background: var(--amber-dim); transform: scale(1.05); }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* Interim transcript */
  .interim-strip {
    font-size: 12px;
    color: var(--text-3);
    font-style: italic;
    padding: 4px 2px;
    min-height: 20px;
    transition: opacity 0.2s;
  }

  /* Live transcript in bubble */
  .live-transcript {
    background: rgba(232,164,74,0.08);
    border: 1.5px dashed rgba(232,164,74,0.4);
    border-radius: 16px;
    border-bottom-right-radius: 4px;
    padding: 11px 14px;
    font-size: 14px;
    color: var(--amber-dim);
    font-style: italic;
    max-width: 78%;
    align-self: flex-end;
    animation: fadeUp 0.2s ease;
  }

  /* Summary modal */
  .summary-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(6px);
    z-index: 300;
    display: flex;
    align-items: flex-end;
    animation: fadeIn 0.25s ease;
  }

  .summary-sheet {
    background: var(--bg);
    border-radius: 24px 24px 0 0;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    max-height: 88vh;
    overflow-y: auto;
    padding: 24px 20px env(safe-area-inset-bottom, 24px);
    animation: slideUp 0.3s ease;
  }

  .summary-title {
    font-family: 'Fredoka', sans-serif;
    font-size: 24px;
    margin-bottom: 4px;
  }

  .summary-compare-row {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }

  .compare-original  { font-size: 13px; color: var(--red); margin-bottom: 4px; }
  .compare-suggested { font-size: 13px; color: var(--green); font-weight: 600; margin-bottom: 4px; }
  .compare-note      { font-size: 11px; color: var(--text-3); }

  /* Save sentence modal */
  .save-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }

  .save-sheet {
    background: var(--bg);
    border-radius: 20px;
    width: 100%;
    max-width: 420px;
    padding: 24px 20px;
    
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  .tag-chip {
    display: inline-flex;
    align-items: center;
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    border: 1.5px solid var(--border);
    background: var(--bg-card);
    color: var(--text-2);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .tag-chip:hover { border-color: var(--amber); color: var(--amber); background: var(--amber-glow); }
  .tag-chip.selected { background: var(--amber-glow); border-color: var(--amber); color: var(--amber); }

  /* Custom scenario modal */
  .custom-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 500;
    display: flex; align-items: flex-end;
    animation: fadeIn 0.2s ease;
  }
  .custom-modal-sheet {
    background: var(--bg);
    border-radius: 24px 24px 0 0;
    width: 100%; max-width: 480px;
    margin: 0 auto;
    max-height: 90vh; overflow-y: auto;
    padding: 24px 20px env(safe-area-inset-bottom, 24px);
    animation: slideUp 0.3s ease;
  }

  /* Transcript modal */
  .transcript-modal {
    position: fixed; inset: 0;
    background: var(--bg);
    z-index: 600;
    display: flex; flex-direction: column;
    animation: fadeUp 0.25s ease;
  }
  .transcript-header {
    padding: 16px 18px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
    position: sticky; top: 0; z-index: 10;
    background: var(--bg-card);
  }
  .transcript-body {
    flex: 1; overflow-y: auto;
    padding: 16px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .transcript-row {
    display: flex; flex-direction: column; gap: 4px;
    padding: 12px 14px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    position: relative;
  }
  .transcript-row.user-row { border-left: 3px solid var(--amber); }
  .transcript-row.ai-row   { border-left: 3px solid var(--text-3); }
  .transcript-speaker { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); margin-bottom: 2px; }
  .transcript-en { font-size: 14px; line-height: 1.5; }
  .transcript-zh { font-size: 12px; color: var(--text-2); margin-top: 3px; font-style: italic; }
  .transcript-save-btn {
    position: absolute; top: 10px; right: 10px;
    background: none; border: 1.5px solid var(--border); border-radius: 8px;
    padding: 3px 9px; font-size: 11px; font-weight: 600;
    color: var(--text-3); cursor: pointer; transition: all 0.15s;
  }
  .transcript-save-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }
  .transcript-save-btn.saved { border-color: var(--green); color: var(--green); background: var(--green-light); }
  .transcript-footer {
    padding: 14px 16px; border-top: 1px solid var(--border);
    flex-shrink: 0; display: flex; flex-direction: column; gap: 8px;
  }

  /* 情境對話考驗 — full-screen overlay */
  .dialog-quiz-shell {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    z-index: 9999;
    overflow: hidden;
  }
  .dialog-quiz-messages {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 14px 14px 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .dialog-quiz-input {
    flex-shrink: 0;
    padding: 10px 12px;
    padding-bottom: max(12px, env(safe-area-inset-bottom, 12px));
    border-top: 2px solid var(--border);
    background: var(--bg-card);
    display: flex;
    gap: 8px;
    align-items: flex-end;
    box-shadow: 0 -3px 12px rgba(59,139,235,0.06);
  }

  /* No-keys warning */
  .no-keys-wall {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 28px;
    text-align: center;
    gap: 16px;
  }
`;

// ─── AI API call (Google Gemini) ──────────────────────────────────────────────
async function callAI(systemPrompt, history, userMessage, maxTokens = 800) {
  const apiKey = LS.get(KEY_GEMINI_KEY, "");
  if (!apiKey) throw new Error("未設定 Gemini API Key — 請至設定頁面填入金鑰");

  // Gemini: contents must alternate user/model, start with user
  const histParts = history
    .filter(m => m.role === "user" || m.role === "ai")
    .map(m => ({ role: m.role === "ai" ? "model" : "user", parts: [{ text: m.text }] }));
  // Drop leading model turns
  while (histParts.length && histParts[0].role === "model") histParts.shift();
  const contents = [...histParts, { role: "user", parts: [{ text: userMessage }] }];

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents,
            generationConfig: { maxOutputTokens: maxTokens },
          }),
        }
      );
      if (!res.ok) {
        let errMsg = `Gemini API 錯誤 (HTTP ${res.status})`;
        try { const j = await res.json(); errMsg = `Gemini: ${j.error?.message || j.error?.status || res.status}`; } catch {}
        if (attempt === 0) { await new Promise(r => setTimeout(r, 1200)); continue; }
        throw new Error(errMsg);
      }
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Gemini 回傳空白結果，請稍後再試");
      return text;
    } catch (e) {
      if (attempt === 0) { await new Promise(r => setTimeout(r, 1200)); continue; }
      throw e;
    }
  }
  throw new Error("連線失敗，請確認 Gemini API Key 正確並重試");
}

// Parse Gemini JSON response safely
function parseGeminiJSON(raw) {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// Build system prompt per scenario
function buildSystemPrompt(scenario) {
  const roleDesc = scenario.id === "custom"
    ? `CRITICAL ROLE ASSIGNMENT:
- YOU (the AI) are playing: ${scenario.aiRole}
- THE USER is playing: ${scenario.userRole}
- Context: ${scenario.context}

Stay fully in YOUR character (${scenario.aiRole}) throughout. The user will respond as ${scenario.userRole}. NEVER swap roles. The hints you provide (hint1/hint2/hint3) must be what THE USER (${scenario.userRole}) would say in response to you, NOT what you (${scenario.aiRole}) would say.`
    : `ROLE: ${scenario.desc}. Keep your responses natural, conversational, and engaging.`;

  return `You are an English conversation partner helping a Taiwanese intermediate-to-advanced English learner (B1–C1) practice speaking in a "${scenario.name}" scenario.

${roleDesc}

CRITICAL: Always respond in this EXACT JSON format:
{
  "reply": "Your conversational response here (1–3 sentences, natural English)",
  "feedback": {
    "status": "ok" | "suggestion" | "error",
    "original": "The user's exact sentence if there's an issue (or null)",
    "suggested": "Better version of the sentence (or null)",
    "reason": "Brief explanation in Traditional Chinese (or null)"
  },
  "hint1": "A few keywords for the NEXT conversation turn",
  "hint2": "A sentence frame/template for the next turn",
  "hint3": "A complete example sentence the user could say next"
}

GRAMMAR RULES:
- "ok": sentence is correct and natural
- "suggestion": grammatically correct but unnatural / there's a more idiomatic way  
- "error": clear grammar mistake

Keep feedback concise. Reason in Traditional Chinese (繁體中文), max 30 characters.
Reply content must be English only.
Never break character. Be encouraging but honest.`;
}

// Build summary prompt
function buildSummaryPrompt(scenario, messages) {
  const userMsgs = messages.filter(m => m.role === "user").map(m => m.text).join("\n");
  const corrections = messages.filter(m => m.feedback && m.feedback.status !== "ok");

  return `You are summarizing an English speaking practice session.

Scenario: ${scenario.name}
User's messages:
${userMsgs}

Issues found during conversation:
${corrections.map(m => `- Original: "${m.feedback.original}" → Suggested: "${m.feedback.suggested}" (${m.feedback.reason})`).join("\n") || "None"}

Respond in this EXACT JSON format:
{
  "topic_summary": "1-sentence summary of what was discussed (in 繁體中文)",
  "error_types": ["list of error pattern types in 繁體中文, max 3"],
  "top3_comparisons": [
    { "original": "user said", "better": "better version", "note": "short reason in 繁體中文" }
  ],
  "focus_tip": "One grammar/expression point to focus on next time (in 繁體中文, 1–2 sentences)"
}`;
}

// ─── Save Sentence Modal ──────────────────────────────────────────────────────
const KEY_LIBRARY = "vu_library";

// sentence: text to display & save (pass suggested version if available)
// originalSentence: user's original (shown as context, not saved)
function SaveSentenceModal({ sentence, originalSentence, onClose, onSaved }) {
  const isNew = sentence === "__new__";
  const [english,      setEnglish]      = useState(isNew ? "" : sentence);
  const [chinese,      setChinese]      = useState("");
  const [chineseLoading, setChineseLoading] = useState(false);
  const [newTag,       setNewTag]       = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [saved,        setSaved]        = useState(false);

  const existingTags = [...new Set(
    (LS.get(KEY_LIBRARY, []) || []).flatMap(item => item.tags || [])
  )];

  // Auto-translate on mount if we have an English sentence
  useEffect(() => {
    if (!english.trim() || isNew) return;
    setChineseLoading(true);
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 150,
        messages: [{ role: "user", content: `Translate this English sentence to Traditional Chinese (繁體中文). Reply with ONLY the translation text in plain form. Do NOT add quotation marks of any kind (no 「」 「」 " ' or any brackets). Just the plain Chinese translation:

${english}` }],
      }),
    })
      .then(r => r.json())
      .then(d => { let t = d.content?.[0]?.text?.trim() || ""; t = t.replace(/^[「\"\u201C\u300C]+|[」\"\u201D\u300D]+$/g, "").trim(); setChinese(t); })
      .catch(() => {})
      .finally(() => setChineseLoading(false));
  }, []);

  const toggleTag = (t) => setSelectedTags(prev =>
    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
  );

  const addNewTag = () => {
    const t = newTag.trim();
    if (t && !selectedTags.includes(t)) setSelectedTags(prev => [...prev, t]);
    setNewTag("");
  };

  const handleSave = () => {
    if (!english.trim()) return;
    const lib = LS.get(KEY_LIBRARY, []) || [];
    const entryId = Date.now();
    lib.push({
      id: entryId, english: english.trim(),
      chinese: chinese.trim(), tags: selectedTags,
      source: "conversation", createdAt: new Date().toISOString(), reviewed: false,
    });
    LS.set(KEY_LIBRARY, lib);
    const stats = LS.get(KEY_STATS, { savedSentences: 0, sessions: 0 });
    LS.set(KEY_STATS, { ...stats, savedSentences: (stats.savedSentences || 0) + 1 });
    setSaved(true);
    if (onSaved) onSaved(entryId);
    setTimeout(onClose, 700);
  };

  return (
    <div className="save-modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="save-sheet">
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20,marginBottom:12}}>儲存句子</div>

        {/* Show original vs suggested if different */}
        {originalSentence && originalSentence !== sentence && (
          <div style={{marginBottom:12,fontSize:12,padding:"8px 12px",background:"rgba(224,90,90,0.07)",borderRadius:10,borderLeft:"3px solid var(--red)"}}>
            <div style={{color:"var(--text-3)",marginBottom:2}}>你說的：</div>
            <div style={{color:"var(--red)",textDecoration:"line-through"}}>{originalSentence}</div>
          </div>
        )}

        {/* English field — always editable */}
        <div className="input-group" style={{marginBottom:12}}>
          <div className="input-label" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>儲存的英文句子</span>
            {isNew && english.trim().length > 3 && (
              <button
                className="btn btn-ghost btn-sm"
                style={{padding:"3px 10px",fontSize:11}}
                onClick={() => {
                  if (chineseLoading) return;
                  setChineseLoading(true);
                  fetch("https://api.anthropic.com/v1/messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      model: "claude-sonnet-4-20250514",
                      max_tokens: 150,
                      messages: [{ role: "user", content: `Translate to Traditional Chinese (繁體中文). Reply with ONLY the translation, no quotes, no brackets:\n\n${english}` }],
                    }),
                  }).then(r => r.json())
                    .then(d => { let t = d.content?.[0]?.text?.trim() || ""; t = t.replace(/^[「"\u201C\u300C]+|[」"\u201D\u300D]+$/g, "").trim(); setChinese(t); })
                    .catch(() => {})
                    .finally(() => setChineseLoading(false));
                }}
              >🌐 AI 翻譯</button>
            )}
          </div>
          <textarea className="input-field-text" value={english} onChange={e => setEnglish(e.target.value)}
            rows={isNew ? 3 : 2} style={{resize:"none"}} placeholder="輸入英文句子或片語..." />
        </div>

        {/* Chinese (AI auto-translated, editable) */}
        <div className="input-group">
          <div className="input-label" style={{display:"flex",alignItems:"center",gap:6}}>
            中文翻譯
            {chineseLoading && <span style={{fontSize:10,color:"var(--amber)"}}>AI 翻譯中...</span>}
          </div>
          <input className="input-field-text" value={chinese}
            onChange={e => setChinese(e.target.value)}
            placeholder={chineseLoading ? "翻譯中..." : "可修改 AI 翻譯，或自行輸入"} />
        </div>

        {/* Tags */}
        <div style={{marginBottom:12}}>
          <div className="input-label" style={{marginBottom:6}}>分類標籤</div>
          {existingTags.length > 0 && (
            <div className="tag-row" style={{marginBottom:8}}>
              {existingTags.map(t => (
                <span key={t} className={`tag-chip ${selectedTags.includes(t) ? "selected" : ""}`}
                  onClick={() => toggleTag(t)}>{t}</span>
              ))}
            </div>
          )}
          <div style={{display:"flex",gap:8}}>
            <input className="input-field-text" value={newTag} onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addNewTag()}
              placeholder="新增分類..." style={{flex:1,padding:"8px 12px",fontSize:13}} />
            <button className="btn btn-ghost btn-sm" onClick={addNewTag}>＋</button>
          </div>
          {selectedTags.length > 0 && (
            <div className="tag-row" style={{marginTop:8}}>
              {selectedTags.map(t => (
                <span key={t} className="tag-chip selected" onClick={() => toggleTag(t)}>{t} ✕</span>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-primary btn-full" onClick={handleSave}
          disabled={saved || !english.trim()}
          style={saved ? {background:"var(--green)",color:"white"} : {}}>
          {saved ? "✓ 已儲存！" : "儲存到學習庫"}
        </button>
        <button className="btn btn-ghost btn-full" style={{marginTop:8}} onClick={onClose}>取消</button>
      </div>
    </div>
  );
}

// ─── Summary Modal ────────────────────────────────────────────────────────────
function SummaryModal({ summary, msgCount, onClose }) {
  if (!summary) return (
    <Portal>
    <div className="summary-modal">
      <div className="summary-sheet" style={{textAlign:"center",padding:"60px 20px"}}>
        <div style={{fontSize:32,marginBottom:12}}>⏳</div>
        <div style={{fontSize:15,fontWeight:600}}>正在生成本次總結...</div>
      </div>
    </div>
    </Portal>
  );

  return (
    <Portal>
    <div className="summary-modal">
      <div className="summary-sheet">
        <div className="modal-handle" />
        <div className="summary-title">對話總結 🎉</div>
        <div style={{fontSize:13,color:"var(--text-3)",marginBottom:20}}>共 {msgCount} 句對話</div>

        <div className="section-label" style={{marginTop:0}}>本次主題</div>
        <div className="card" style={{marginBottom:16,fontSize:14,lineHeight:1.6}}>
          {summary.topic_summary}
        </div>

        {summary.error_types?.length > 0 && (
          <>
            <div className="section-label">常見錯誤類型</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {summary.error_types.map((e, i) => (
                <span key={i} className="badge badge-red">{e}</span>
              ))}
            </div>
          </>
        )}

        {summary.top3_comparisons?.length > 0 && (
          <>
            <div className="section-label">句子改進對照</div>
            {summary.top3_comparisons.map((c, i) => (
              <div key={i} className="summary-compare-row">
                <div className="compare-original">✗ {c.original}</div>
                <div className="compare-suggested">✓ {c.better}</div>
                <div className="compare-note">{c.note}</div>
              </div>
            ))}
          </>
        )}

        {summary.focus_tip && (
          <>
            <div className="section-label">下次建議加強</div>
            <div className="card" style={{fontSize:13,lineHeight:1.6,color:"var(--text-2)",marginBottom:20}}>
              💡 {summary.focus_tip}
            </div>
          </>
        )}

        <button className="btn btn-primary btn-full" onClick={onClose}>完成，回到首頁</button>
      </div>
    </div>
    </Portal>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, onSave, isSaved, onUnsave }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const saved = isSaved;

  if (msg.role === "system") {
    return (
      <div style={{textAlign:"center"}}>
        <span className="msg-bubble system">{msg.text}</span>
      </div>
    );
  }

  const fb = msg.feedback;
  const hasFeedback = fb && fb.status !== "ok" && fb.original;

  return (
    <div className={`msg-row ${msg.role}`}>
      <div className={`msg-avatar ${msg.role}`}>
        {msg.role === "ai" ? "🤖" : "🗣️"}
      </div>
      <div className="msg-bubble-wrap">
        <div className={`msg-bubble ${msg.role}`}>
          {msg.text}
        </div>

        {/* Grammar feedback tag */}
        {msg.role === "user" && (
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:3}}>
            {msg.skipFeedback ? (
              <span className="grammar-tag badge-green">✅ 表達自然</span>
            ) : !fb ? (
              <span className="grammar-tag badge-muted" style={{color:"var(--text-3)"}}>
                <span>🔍 AI 分析中</span>
                <span className="analyzing-dots"><span>.</span><span>.</span><span>.</span></span>
              </span>
            ) : hasFeedback ? (
              <span
                className={`grammar-tag ${fb.status === "error" ? "badge-red" : "badge-amber"}`}
                onClick={() => setShowFeedback(s => !s)}
              >
                {fb.status === "error" ? "❌ 文法問題" : "⚠️ 更好的說法"}
              </span>
            ) : (
              <span className="grammar-tag badge-green">✅ 表達自然</span>
            )}

            <button
              className={`msg-save-btn ${saved ? "saved" : ""}`}
              onClick={() => {
                if (saved) {
                  onUnsave(msg.id);
                } else {
                  const toSave = (hasFeedback && fb.suggested) ? fb.suggested : msg.text;
                  const orig   = (hasFeedback && fb.suggested && fb.suggested !== msg.text) ? msg.text : null;
                  onSave(toSave, orig, msg.id);
                }
              }}
            >
              {saved ? "✓ 已存 (點擊取消)" : "＋ 儲存"}
            </button>
          </div>
        )}

        {/* Expand feedback */}
        {hasFeedback && showFeedback && (
          <div className="grammar-panel">
            <div className="original">✗ {fb.original}</div>
            <div className="suggested">✓ {fb.suggested}</div>
            <div className="reason">{fb.reason}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Custom Scenario Modal ───────────────────────────────────────────────────
function CustomScenarioModal({ onStart, onClose }) {
  const [aiRole,   setAiRole]   = useState("");
  const [userRole, setUserRole] = useState("");
  const [context,  setContext]  = useState("");

  const canStart = aiRole.trim() && userRole.trim() && context.trim();

  return (
    <Portal>
    <div className="custom-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="custom-modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">✏️ 自訂場景</div>
        <div className="modal-desc">設定情境，AI 會完全依照你的設定來對話。</div>

        <div className="input-group">
          <div className="input-label">AI 扮演什麼角色？</div>
          <input className="input-field-text" value={aiRole} onChange={e => setAiRole(e.target.value)}
            placeholder="例：一位嚴格的外商面試官、一家餐廳的不友善服務生..." />
        </div>

        <div className="input-group">
          <div className="input-label">你（使用者）的角色是？</div>
          <input className="input-field-text" value={userRole} onChange={e => setUserRole(e.target.value)}
            placeholder="例：應徵行銷主管的求職者、一位對服務不滿的客人..." />
        </div>

        <div className="input-group">
          <div className="input-label">背景 / 情境說明（一句話）</div>
          <input className="input-field-text" value={context} onChange={e => setContext(e.target.value)}
            placeholder="例：這是最後一輪面試，你的競爭對手非常強..." />
        </div>

        <button className="btn btn-primary btn-full" disabled={!canStart}
          onClick={() => onStart({ aiRole: aiRole.trim(), userRole: userRole.trim(), context: context.trim() })}>
          開始練習
        </button>
        <button className="btn btn-ghost btn-full" style={{marginTop:8}} onClick={onClose}>取消</button>
      </div>
    </div>
    </Portal>
  );
}

// ─── Transcript / End Session Modal ──────────────────────────────────────────
function TranscriptModal({ messages, initialSavedIds, initialEntryMap, onClose }) {
  const [savedIds,    setSavedIds]    = useState(() => new Set(initialSavedIds || []));
  const [entryMap,    setEntryMap]    = useState(() => ({...(initialEntryMap || {})}));
  const [saveTarget,  setSaveTarget]  = useState(null); // { sentence, original, msgId }

  const convo = messages.filter(m => m.role === "user" || m.role === "ai");

  const handleSaveClick = (msg) => {
    if (savedIds.has(msg.id)) {
      // Unsave: remove from library
      const entryId = entryMap[msg.id];
      if (entryId) {
        const lib = (LS.get(KEY_LIBRARY, []) || []).filter(e => e.id !== entryId);
        LS.set(KEY_LIBRARY, lib);
        const stats = LS.get(KEY_STATS, { savedSentences: 0, sessions: 0 });
        LS.set(KEY_STATS, { ...stats, savedSentences: Math.max(0,(stats.savedSentences||1)-1) });
      }
      setSavedIds(prev => { const s = new Set(prev); s.delete(msg.id); return s; });
      setEntryMap(prev => { const m = {...prev}; delete m[msg.id]; return m; });
      return;
    }
    // For user messages: pick suggested version if correction exists
    // For AI messages: save the AI text directly (no correction concept)
    if (msg.role === "user") {
      const fb = msg.feedback;
      const toSave = (fb && fb.status !== "ok" && fb.suggested) ? fb.suggested : msg.text;
      const original = (fb && fb.status !== "ok" && fb.suggested) ? msg.text : null;
      setSaveTarget({ sentence: toSave, original, msgId: msg.id });
    } else {
      // AI message — save as useful expression
      setSaveTarget({ sentence: msg.text, original: null, msgId: msg.id });
    }
  };

  return (
    <Portal>
    <div className="transcript-modal">
      <div className="transcript-header">
        <div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20}}>本次對話紀錄</div>
          <div style={{fontSize:12,color:"var(--text-3)",marginTop:2}}>儲存會自動選正確版本</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onClose}>完成並離開</button>
      </div>

      <div className="transcript-body">
        {convo.map((msg, i) => {
          const fb = msg.feedback;
          const hasSuggestion = fb && fb.status !== "ok" && fb.suggested;
          const isSaved = savedIds.has(msg.id);
          // Only show save button for user and ai messages (not system)
          const canSave = msg.role === "user" || msg.role === "ai";
          return (
            <div key={msg.id || i} className={`transcript-row ${msg.role === "user" ? "user-row" : "ai-row"}`}>
              <div className="transcript-speaker">{msg.role === "user" ? "🗣 You" : "🤖 AI"}</div>

              {/* User's original text */}
              <div className="transcript-en" style={hasSuggestion ? {color:"var(--text-3)",fontSize:13} : {}}>
                {msg.text}
              </div>

              {/* Suggested correction — same size, green bold, NOT italic */}
              {hasSuggestion && (
                <div style={{fontSize:14,fontWeight:700,color:"var(--green)",marginTop:4,lineHeight:1.5}}>
                  ✓ {fb.suggested}
                </div>
              )}

              {/* Reason note — small, muted */}
              {hasSuggestion && fb.reason && (
                <div className="transcript-zh" style={{fontStyle:"normal",marginTop:3}}>
                  （{fb.reason}）
                </div>
              )}

              {/* Save button — for both user AND ai messages */}
              {canSave && (
                <button
                  className={`transcript-save-btn ${isSaved ? "saved" : ""}`}
                  onClick={() => handleSaveClick(msg)}
                  title={isSaved ? "點擊取消儲存" : "儲存到學習庫"}
                >
                  {isSaved ? "✓ 已存" : "＋ 儲存"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="transcript-footer">
        <div style={{fontSize:12,color:"var(--text-3)",textAlign:"center"}}>
          共 {convo.filter(m=>m.role==="user").length} 句回應 · 對話結束後不會保留記錄
        </div>
        <button className="btn btn-primary btn-full" onClick={onClose}>完成並離開</button>
      </div>

      {saveTarget && (
        <SaveSentenceModal
          sentence={saveTarget.sentence}
          originalSentence={saveTarget.original}
          onSaved={(entryId) => {
            setSavedIds(prev => new Set([...prev, saveTarget.msgId]));
            setEntryMap(prev => ({...prev, [saveTarget.msgId]: entryId}));
          }}
          onClose={() => setSaveTarget(null)}
        />
      )}
    </div>
    </Portal>
  );
}

// ─── Practice Page (FULL) ─────────────────────────────────────────────────────
function PracticePage({ scenario, keys, onBack }) {
  const [messages,      setMessages]      = useState([]);
  const [isListening,   setIsListening]   = useState(false);
  const [isProcessing,  setIsProcessing]  = useState(false);
  const [interimText,   setInterimText]   = useState("");
  const [textInput,     setTextInput]     = useState("");
  const [hintLevel,     setHintLevel]     = useState(null); // null | 1 | 2 | 3
  const [currentHints,  setCurrentHints]  = useState(null);
  const [showSummary,     setShowSummary]     = useState(false);
  const [summary,         setSummary]         = useState(null);
  const [showTranscript,  setShowTranscript]  = useState(false);
  const [saveTarget,      setSaveTarget]      = useState(null);
  const [savedMsgIds,     setSavedMsgIds]     = useState(() => new Set());
  // Map msgId → library entry id (so we can unsave by deleting the right entry)
  const [savedEntryMap,   setSavedEntryMap]   = useState(() => ({}));
  const [geminiHistory,   setGeminiHistory]   = useState([]);

  const recogRef    = useRef(null);
  const messagesRef = useRef(null);
  const styleRef    = useRef(false);

  // Practice styles already injected globally by VoiceUp root component

  // Auto-scroll
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, interimText, isProcessing]);

  // Opening message from AI + dynamically generated hints
  useEffect(() => {
    // For custom scenario, wait until customScenario is set
    if (scenario.id === "custom" && !scenario.customReady) return;

    // Reset all state when scenario changes
    setIsProcessing(false);
    setIsListening(false);
    setInterimText("");
    setTextInput("");
    setHintLevel(null);
    setShowTranscript(false);
    setSaveTarget(null);
    setGeminiHistory([]);

    const opener = scenario.id === "custom"
      ? null  // Will be generated dynamically by AI in character
      : getRandomOpener(scenario.id);

    setMessages([
      { id: 1, role: "system", text: `場景：${scenario.name} ${scenario.emoji}` },
      ...(opener ? [{ id: 2, role: "ai", text: opener }] : []),
    ]);

    // Block user input while opener/hints are being generated
    if (scenario.id === "custom") setIsProcessing(true);

    // Show fallback hints first
    setCurrentHints({
      hint1: "...", hint2: "...", hint3: opener ? "Generating hints..." : "Generating opening...",
    });

    // For custom scenarios: AI generates opener IN CHARACTER + hints for user role
    // For preset scenarios: AI generates hints that match the chosen opener
    (async () => {
      try {
        let hintPrompt;
        if (scenario.id === "custom") {
          hintPrompt = `You are creating the OPENING of a roleplay conversation.

Roles:
- AI plays: ${scenario.aiRole}
- User plays: ${scenario.userRole}
- Context: ${scenario.context}

TASK:
1. Generate the AI's opening line (in character as ${scenario.aiRole}, in English, 1-2 sentences, natural)
2. Generate three response hints for what the USER (playing ${scenario.userRole}) would say in reply

Reply ONLY with this JSON:
{"opener":"AI's opening line in English","hint1":"3-5 keywords for the user (${scenario.userRole}) to use","hint2":"a sentence frame the user would say","hint3":"a complete natural reply the user (${scenario.userRole}) would say (1-2 sentences)"}`;
        } else {
          hintPrompt = `Given this opening line in a "${scenario.name}" scenario:\n"${opener}"\n\nGenerate THREE response hints for the user. Reply ONLY with JSON:\n{"hint1":"3-5 keywords (slash-separated)","hint2":"a sentence frame","hint3":"a complete natural example reply (1-2 sentences)"}`;
        }

        const raw = await callAI("You generate English conversation content. Output only valid JSON, no markdown code fences.", [], hintPrompt);
        const parsed = parseGeminiJSON(raw);

        if (scenario.id === "custom" && parsed?.opener) {
          // Add AI opener message
          setMessages(prev => [
            ...prev,
            { id: 2, role: "ai", text: parsed.opener },
          ]);
        }

        if (parsed?.hint1 && parsed?.hint2 && parsed?.hint3) {
          setCurrentHints({ hint1: parsed.hint1, hint2: parsed.hint2, hint3: parsed.hint3 });
        }
      } catch {
        setCurrentHints({
          hint1: "respond / share / continue",
          hint2: "Well, I'd say...",
          hint3: "That's a good question. Let me think about it for a moment.",
        });
        if (scenario.id === "custom") {
          setMessages(prev => [
            ...prev,
            { id: 2, role: "ai", text: "Hello! Let's begin." },
          ]);
        }
      } finally {
        // Always unblock input after opener generation completes
        setIsProcessing(false);
      }
    })();
  }, [scenario]);

  // ── Send message (shared logic) ──────────────────────────────────────────────
  // skipFeedback=true when user sent the suggested hint sentence → don't grade it
  const sendMessage = useCallback(async (userText, skipFeedback = false) => {
    if (!userText.trim() || isProcessing) return;
    setIsProcessing(true);
    setHintLevel(null);

    const userMsg = {
      id: Date.now(), role: "user", text: userText.trim(),
      feedback: skipFeedback ? { status: "ok" } : null,
      skipFeedback,
    };
    setMessages(prev => [...prev, userMsg]);

    const newHistory = [...geminiHistory, { role: "user", text: userText.trim() }];

    try {
      // Build instruction differently for hint-sent messages (skip grading)
      const instruction = skipFeedback
        ? `${userText.trim()}\n\n[INTERNAL NOTE: The user used the suggested hint sentence, which is already correct. In your JSON response, set feedback.status to "ok" and original/suggested/reason to null. Do not grade this message.]`
        : userText.trim();

      const raw = await callAI(buildSystemPrompt(scenario), geminiHistory, instruction);
      const parsed = parseGeminiJSON(raw);

      const aiText = parsed?.reply || raw;
      const feedback = skipFeedback ? { status: "ok" } : (parsed?.feedback || { status: "ok" });

      // Update user msg with feedback
      setMessages(prev => prev.map(m =>
        m.id === userMsg.id ? { ...m, feedback } : m
      ));

      // Add AI reply
      const aiMsg = { id: Date.now() + 1, role: "ai", text: aiText };
      setMessages(prev => [...prev, aiMsg]);

      // Update hints for next turn
      if (parsed?.hint1) {
        setCurrentHints({ hint1: parsed.hint1, hint2: parsed.hint2, hint3: parsed.hint3 });
      }

      setGeminiHistory([...newHistory, { role: "ai", text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: "ai",
        text: `⚠️ ${err.message || "連線失敗，請稍後再試"}`,
      }]);
    }

    setIsProcessing(false);
  }, [isProcessing, geminiHistory, scenario]);

  // ── Azure Speech Recognition ──────────────────────────────────────────────────
  const startListening = useCallback(async () => {
    if (!keys.azureKey) {
      alert("請先在設定頁面填入 Azure Speech Key。");
      return;
    }

    // Dynamically load Azure Speech SDK
    if (!window.SpeechSDK) {
      try {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://aka.ms/csspeech/jsbrowserpackageraw";
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      } catch {
        alert("無法載入 Azure Speech SDK，請檢查網路連線。");
        return;
      }
    }

    const SDK = window.SpeechSDK;
    const config = SDK.SpeechConfig.fromSubscription(keys.azureKey, keys.azureRegion);
    config.speechRecognitionLanguage = "en-US";

    const audioConfig = SDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer  = new SDK.SpeechRecognizer(config, audioConfig);
    recogRef.current  = recognizer;

    recognizer.recognizing = (_, e) => {
      setInterimText(e.result.text);
    };

    recognizer.recognized = (_, e) => {
      if (e.result.reason === SDK.ResultReason.RecognizedSpeech && e.result.text) {
        setInterimText("");
        stopListening();
        sendMessage(e.result.text);
      }
    };

    recognizer.canceled = () => { stopListening(); };

    recognizer.startContinuousRecognitionAsync(
      () => setIsListening(true),
      err => { console.error(err); setIsListening(false); }
    );
  }, [keys, sendMessage]);

  const stopListening = useCallback(() => {
    if (recogRef.current) {
      recogRef.current.stopContinuousRecognitionAsync(
        () => { setIsListening(false); setInterimText(""); recogRef.current = null; },
        () => { setIsListening(false); setInterimText(""); recogRef.current = null; }
      );
    } else {
      setIsListening(false);
      setInterimText("");
    }
  }, []);

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  // ── End session: show transcript first, record stats ─────────────────────────
  const handleEndSession = () => {
    stopListening();

    // Record practice day
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    const days = LS.get(KEY_STREAK_DAYS, []);
    if (!days.includes(iso)) LS.set(KEY_STREAK_DAYS, [...days, iso]);

    // Update session count
    const stats = LS.get(KEY_STATS, { savedSentences: 0, sessions: 0 });
    LS.set(KEY_STATS, { ...stats, sessions: (stats.sessions || 0) + 1 });

    // Show transcript modal
    setShowTranscript(true);
  };

  // AI now uses Claude built-in API — no external key needed
  // Azure is optional (enables voice; text-only mode without it)
  const hasAzure = !!keys.azureKey;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="practice-shell">
      {/* Header */}
      <div className="practice-header">
        <button className="practice-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="practice-scenario-info">
          <div className="practice-scenario-name">{scenario.emoji} {scenario.name}</div>
          <div className="practice-scenario-sub">{scenario.level} · {messages.filter(m=>m.role==="user").length} 句回應</div>
        </div>
        <button className="practice-end-btn" onClick={handleEndSession}>結束對話</button>
      </div>

      {/* No-Azure banner */}
      {!hasAzure && (
        <div style={{background:"rgba(232,164,74,0.1)",borderBottom:"1px solid rgba(232,164,74,0.2)",padding:"7px 16px",fontSize:11,color:"var(--amber)",display:"flex",alignItems:"center",gap:6}}>
          <span>⚠️</span>
          <span>語音輸入停用（未設定 Azure Key）— 可用文字輸入練習</span>
        </div>
      )}

      {/* Messages */}
      <div className="messages-area" ref={messagesRef}>
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isSaved={savedMsgIds.has(msg.id)}
            onSave={(text, orig, msgId) => setSaveTarget({ sentence: text, original: orig, msgId })}
            onUnsave={(msgId) => {
              const entryId = savedEntryMap[msgId];
              if (entryId) {
                const lib = (LS.get(KEY_LIBRARY, []) || []).filter(e => e.id !== entryId);
                LS.set(KEY_LIBRARY, lib);
                const stats = LS.get(KEY_STATS, { savedSentences: 0, sessions: 0 });
                LS.set(KEY_STATS, { ...stats, savedSentences: Math.max(0,(stats.savedSentences||1)-1) });
              }
              setSavedMsgIds(prev => { const s = new Set(prev); s.delete(msgId); return s; });
              setSavedEntryMap(prev => { const m = {...prev}; delete m[msgId]; return m; });
            }}
          />
        ))}

        {/* Live interim transcript */}
        {interimText && (
          <div className="live-transcript">🎙️ {interimText}...</div>
        )}

        {/* Typing indicator */}
        {isProcessing && (
          <div className="msg-row ai">
            <div className="msg-avatar ai">🤖</div>
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="input-area">
        {/* Hint chips */}
        {currentHints && (
          <div className="hint-bar">
            <span style={{fontSize:11,color:"var(--text-3)",alignSelf:"center",flexShrink:0}}>提示：</span>
            {[1,2,3].map(lv => (
              <span
                key={lv}
                className={`hint-chip ${hintLevel === lv ? "active" : ""}`}
                onClick={() => setHintLevel(hintLevel === lv ? null : lv)}
              >
                {lv === 1 ? "🔑 關鍵字" : lv === 2 ? "📐 句型" : "💬 完整示範"}
              </span>
            ))}
          </div>
        )}

        {/* Hint content */}
        {hintLevel && currentHints && (
          <div className="hint-content">
            {hintLevel === 1 && <><strong>關鍵字：</strong>{currentHints.hint1}</>}
            {hintLevel === 2 && <><strong>句型：</strong>{currentHints.hint2}</>}
            {hintLevel === 3 && (
              <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                <div style={{flex:1}}><strong>示範句：</strong>{currentHints.hint3}</div>
                <button
                  className="btn btn-primary"
                  style={{padding:"5px 10px",fontSize:11,flexShrink:0,marginTop:-2}}
                  onClick={() => { if (!isProcessing) sendMessage(currentHints.hint3, true); }}
                  disabled={isProcessing}
                  title="直接送出此示範句"
                >
                  ✈ 送出
                </button>
              </div>
            )}
          </div>
        )}

        {/* Interim status */}
        {isListening && (
          <div className="interim-strip">
            {interimText ? `聽到：${interimText}` : "🎙️ 聆聽中，請開口說英文..."}
          </div>
        )}

        {/* Input row */}
        <div className="input-row">
          {/* Mic button — disabled with tooltip when no Azure key */}
          <div style={{position:"relative",flexShrink:0}}>
            <button
              className={`mic-btn ${isProcessing ? "processing" : isListening ? "listening" : "idle"}`}
              onClick={hasAzure ? toggleMic : undefined}
              disabled={isProcessing || !hasAzure}
              title={!hasAzure ? "請在設定頁面填入 Azure Speech Key 以啟用語音輸入" : isListening ? "點擊停止錄音" : "點擊開始語音輸入"}
              style={!hasAzure ? {opacity:0.35,cursor:"not-allowed"} : {}}
            >
              {isProcessing
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                : isListening
                  ? <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10a7 7 0 01-14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
              }
            </button>
            {!hasAzure && (
              <div style={{position:"absolute",top:-6,right:-6,width:16,height:16,background:"var(--amber)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#1A1714",border:"2px solid var(--bg-card)"}}>
                !
              </div>
            )}
          </div>

          {/* Text input */}
          <textarea
            className="text-input-box"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (textInput.trim()) { sendMessage(textInput); setTextInput(""); }
              }
            }}
            placeholder={isListening ? "語音輸入中..." : !hasAzure ? "用文字練習（無 Azure Key，語音功能停用）" : "打字或語音輸入，Enter 送出"}
            disabled={isListening || isProcessing}
            rows={1}
          />

          {/* Send button */}
          <button
            className="send-btn"
            disabled={!textInput.trim() || isProcessing || isListening}
            onClick={() => { if (textInput.trim()) { sendMessage(textInput); setTextInput(""); } }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Transcript modal (shown when session ends) */}
      {showTranscript && (
        <TranscriptModal
          messages={messages}
          initialSavedIds={savedMsgIds}
          initialEntryMap={savedEntryMap}
          onClose={() => { setShowTranscript(false); onBack(); }}
        />
      )}

      {/* Save sentence modal (from conversation, not transcript) */}
      {saveTarget && (
        <SaveSentenceModal
          sentence={saveTarget.sentence || saveTarget}
          originalSentence={saveTarget.original || null}
          onSaved={(entryId) => {
            if (saveTarget.msgId) {
              setSavedMsgIds(prev => new Set([...prev, saveTarget.msgId]));
              setSavedEntryMap(prev => ({...prev, [saveTarget.msgId]: entryId}));
            }
          }}
          onClose={() => setSaveTarget(null)}
        />
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function VoiceUp() {
  const [darkMode,      setDarkMode]      = useState(() => LS.get(KEY_DARK_MODE, false));
  const [onboarded,     setOnboarded]     = useState(() => LS.get(KEY_ONBOARDED, false));
  const [tab,           setTab]           = useState("home");
  const [scenario,      setScenario]      = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [keys,          setKeys]          = useState(() => ({
    azureKey:    LS.get(KEY_AZURE_KEY,    ""),
    azureRegion: LS.get(KEY_AZURE_REGION, "eastasia"),
    geminiKey:   LS.get(KEY_GEMINI_KEY,   ""),
  }));

  // Inject styles (both global + practice, so QuizModal from LibraryPage works)
  useEffect(() => {
    let el = document.getElementById("voiceup-styles");
    if (!el) { el = document.createElement("style"); el.id = "voiceup-styles"; document.head.appendChild(el); }
    el.textContent = STYLES;
    let el2 = document.getElementById("voiceup-practice-styles");
    if (!el2) { el2 = document.createElement("style"); el2.id = "voiceup-practice-styles"; document.head.appendChild(el2); }
    el2.textContent = PRACTICE_STYLES;
  }, []);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  if (!onboarded) {
    return <Onboarding onComplete={() => {
      // Reload keys from localStorage after onboarding saves them
      setKeys({
        azureKey:    LS.get(KEY_AZURE_KEY,    ""),
        azureRegion: LS.get(KEY_AZURE_REGION, "eastasia"),
        geminiKey:   LS.get(KEY_GEMINI_KEY,   ""),
      });
      setOnboarded(true);
    }} />;
  }

  const handleStartScenario = (s) => {
    setScenario(s);
    setTab("practice");
  };

  const handleStartCustom = () => {
    setShowCustomModal(true);
  };

  const handleCustomStart = ({ aiRole, userRole, context }) => {
    setShowCustomModal(false);
    const customScenario = {
      id: "custom", emoji: "✏️", name: "自訂場景",
      desc: context, level: "自訂",
      aiRole, userRole, context, customReady: true,
    };
    setScenario(customScenario);
    setTab("practice");
  };

  const handleBackFromPractice = () => {
    setScenario(null);
    setTab("home");
  };

  const NAV_ITEMS = [
    { id: "home",     label: "首頁",   iconComp: Icons.Home },
    { id: "library",  label: "學習庫", iconComp: Icons.Book },
    { id: "progress", label: "進度",   iconComp: Icons.Chart },
    { id: "settings", label: "設定",   iconComp: Icons.Gear },
  ];

  return (
    <div className="app-shell">
      {/* Page content */}
      {tab === "home" && <HomePage keys={keys} onStartScenario={handleStartScenario} onStartCustom={handleStartCustom} />}
      {tab === "library" && <LibraryPage />}
      {tab === "progress" && <ProgressPage />}
      {tab === "settings" && (
        <SettingsPage
          keys={keys}
          setKeys={setKeys}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      {tab === "practice" && scenario && (
        <PracticePage scenario={scenario} keys={keys} onBack={handleBackFromPractice} />
      )}

      {/* Custom scenario setup modal */}
      {showCustomModal && (
        <CustomScenarioModal
          onStart={handleCustomStart}
          onClose={() => setShowCustomModal(false)}
        />
      )}

      {/* Bottom nav (hidden during practice) */}
      {tab !== "practice" && (
        <nav className="bottom-nav">
          {NAV_ITEMS.map(item => {
            const isActive = tab === item.id;
            const IconComp = item.iconComp;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                <IconComp active={isActive} />
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
