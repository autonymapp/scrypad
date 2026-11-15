export interface AutonymTemplate {
  id: string;
  name: string;
  project: 'Wisp' | 'Grimoire' | 'Conlang' | 'Interstatus' | 'Godot';
  badge: string;
  description: string;
  html: string;
}

export const AUTONYM_TEMPLATES: AutonymTemplate[] = [
  {
    id: 'wisp-note',
    name: 'Wisp Note Card',
    project: 'Wisp',
    badge: 'Desktop / Note',
    description: 'Clean reading layout with metadata header, shelf tags, and typography matching Wisp desktop.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Wisp Note ✦ Midnight Musings</title>
  <style>
    :root {
      --void: #070a10;
      --panel: #0d1422;
      --line: #203453;
      --ink: #e8eef8;
      --dim: #8d9bb6;
      --bio-green: #5cff9d;
      --hud-teal: #48e0d2;
    }
    body {
      margin: 0;
      padding: 40px 24px;
      background: var(--void);
      color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: flex;
      justify-content: center;
    }
    .note-sheet {
      max-width: 620px;
      width: 100%;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 36px 32px;
      box-shadow: 0 16px 36px rgba(0,0,0,0.5);
    }
    .note-shelf-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--hud-teal);
      background: rgba(72, 224, 210, 0.1);
      border: 1px solid rgba(72, 224, 210, 0.3);
      padding: 3px 10px;
      border-radius: 14px;
      margin-bottom: 14px;
    }
    h1 {
      margin: 0 0 16px 0;
      font-size: 1.9rem;
      letter-spacing: -0.01em;
      color: #fff;
    }
    .note-date {
      font-size: 12px;
      color: var(--dim);
      font-family: ui-monospace, monospace;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 12px;
    }
    p {
      line-height: 1.7;
      color: var(--ink);
      font-size: 1.05rem;
      margin-bottom: 18px;
    }
  </style>
</head>
<body>
  <article class="note-sheet">
    <span class="note-shelf-tag">Shelf ✦ Ideas</span>
    <h1>The Solitary Beacon</h1>
    <div class="note-date">Recorded: November 14, 2026 ✦ Wisp v0.1</div>
    <p>A quiet afternoon settled over the spire. The soft hum of the crystal conduits pulsed through the wooden floorboards, keeping rhythm with the rain outside.</p>
    <p>Click anywhere to continue writing your thoughts, or tweak the styling in ScryPad.</p>
  </article>
</body>
</html>`
  },

  {
    id: 'grimoire-spell',
    name: 'Grimoire Spell Tome',
    project: 'Grimoire',
    badge: 'RPG / Fantasy',
    description: 'Spellbook entry with elemental affinity badge, mana cost gauge, rune framing, and flavor lore.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grimoire ✦ Astral Flare</title>
  <style>
    :root {
      --void: #070a10;
      --panel: #0d1422;
      --line: #203453;
      --amber: #ffbf4d;
      --violet: #a98bff;
      --bio-green: #5cff9d;
    }
    body {
      margin: 0;
      padding: 40px 20px;
      background: radial-gradient(circle at 50% 20%, #151b28 0%, #070a10 80%);
      color: #e8eef8;
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
    }
    .spell-card {
      max-width: 480px;
      width: 100%;
      background: linear-gradient(180deg, #101826 0%, #0a0f18 100%);
      border: 2px solid var(--violet);
      border-radius: 12px;
      padding: 28px;
      box-shadow: 0 0 25px rgba(169, 139, 255, 0.25);
      position: relative;
    }
    .spell-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .element-tag {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      background: rgba(169, 139, 255, 0.15);
      color: var(--violet);
      border: 1px solid var(--violet);
      padding: 4px 10px;
      border-radius: 4px;
    }
    .mana-cost {
      font-family: ui-monospace, monospace;
      font-size: 13px;
      font-weight: 700;
      color: var(--amber);
    }
    h2 {
      margin: 0 0 8px 0;
      font-size: 1.6rem;
      color: #fff;
    }
    .rune-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--violet), transparent);
      margin: 16px 0;
    }
    p {
      color: #b0bfd4;
      line-height: 1.6;
      font-size: 0.95rem;
    }
    blockquote {
      margin: 16px 0 0 0;
      padding: 10px 14px;
      background: rgba(7, 10, 16, 0.6);
      border-left: 3px solid var(--amber);
      font-style: italic;
      color: #8d9bb6;
      font-size: 0.88rem;
    }
  </style>
</head>
<body>
  <div class="spell-card">
    <div class="spell-header">
      <span class="element-tag">✦ Astral Weave</span>
      <span class="mana-cost">35 MP</span>
    </div>
    <h2>Astral Flare</h2>
    <div class="rune-divider"></div>
    <p>Conjures a lance of celestial starlight that pierces darkness, illuminating hidden wards and blinding adversaries for 3 turns.</p>
    <blockquote>"The stars do not merely guide; they incinerate that which lurks in deceit." — Archmage Solas</blockquote>
  </div>
</body>
</html>`
  },

  {
    id: 'conlang-matrix',
    name: 'Conlang Phonetic Matrix',
    project: 'Conlang',
    badge: 'Linguistics / Tool',
    description: 'Consonant & vowel phoneme chart with IPA notation, romanization keys, and example word cards.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Conlang ✦ Phonology Matrix</title>
  <style>
    :root {
      --void: #070a10;
      --panel: #0d1422;
      --line: #203453;
      --bio-green: #5cff9d;
      --hud-teal: #48e0d2;
      --ink: #e8eef8;
    }
    body {
      margin: 0;
      padding: 36px 20px;
      background: var(--void);
      color: var(--ink);
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .chart-container {
      max-width: 640px;
      width: 100%;
    }
    h1 {
      font-size: 1.8rem;
      margin: 0 0 6px 0;
      color: #fff;
    }
    .subtitle {
      color: #8d9bb6;
      font-size: 0.9rem;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    th, td {
      padding: 10px 14px;
      text-align: center;
      border: 1px solid var(--line);
      font-size: 13px;
    }
    th {
      background: #121c2e;
      color: var(--hud-teal);
      font-family: ui-monospace, monospace;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.05em;
    }
    .ipa {
      font-family: "Lucida Sans Unicode", "Segoe UI", sans-serif;
      font-weight: 700;
      color: var(--bio-green);
      font-size: 16px;
    }
    .glyph-box {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px 20px;
    }
    .sample-word {
      font-size: 1.4rem;
      font-weight: bold;
      color: var(--hud-teal);
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <div class="chart-container">
    <h1>Aethelian Consonant Matrix</h1>
    <div class="subtitle">Interstatus Conlang Laboratory ✦ IPA Phonology Chart</div>
    <table>
      <thead>
        <tr><th>Class</th><th>Bilabial</th><th>Alveolar</th><th>Velar</th><th>Glottal</th></tr>
      </thead>
      <tbody>
        <tr><td>Nasal</td><td class="ipa">m</td><td class="ipa">n</td><td class="ipa">ŋ</td><td>—</td></tr>
        <tr><td>Plosive</td><td class="ipa">p · b</td><td class="ipa">t · d</td><td class="ipa">k · g</td><td class="ipa">ʔ</td></tr>
        <tr><td>Fricative</td><td class="ipa">ɸ · β</td><td class="ipa">s · z</td><td class="ipa">x · ɣ</td><td class="ipa">h</td></tr>
        <tr><td>Approximant</td><td class="ipa">w</td><td class="ipa">l · r</td><td class="ipa">j</td><td>—</td></tr>
      </tbody>
    </table>

    <div class="glyph-box">
      <div class="sample-word">aethel /aɪ'θɛl/</div>
      <p style="margin:0; color:#8d9bb6; font-size:13px;">n. The luminous mist that settles upon sacred ancient groves at dawn.</p>
    </div>
  </div>
</body>
</html>`
  },

  {
    id: 'godot-dialogue',
    name: 'Godot Dialogue Card & BBCode',
    project: 'Godot',
    badge: 'Game Dev / BBCode',
    description: 'Dialogue box with animated [wave], [shake], and [rainbow] tags. Convert to Godot BBCode with 1 click!',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Godot 4 ✦ Dialogue Card</title>
  <style>
    :root {
      --void: #070a10;
      --panel: #0d1422;
      --line: #203453;
      --bio-green: #5cff9d;
      --hud-teal: #48e0d2;
      --amber: #ffbf4d;
    }
    body {
      margin: 0;
      padding: 40px 20px;
      background: radial-gradient(circle at 50% 30%, #151e2e 0%, #070a10 80%);
      color: #e8eef8;
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
    }
    .dialogue-box {
      max-width: 580px;
      width: 100%;
      background: rgba(13, 20, 34, 0.95);
      border: 2px solid var(--hud-teal);
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 0 20px rgba(72, 224, 210, 0.2);
      position: relative;
    }
    .speaker-name {
      display: inline-block;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: var(--hud-teal);
      color: #070a10;
      padding: 4px 12px;
      border-radius: 4px;
      margin-bottom: 12px;
    }
    .dialogue-text {
      font-size: 1.15rem;
      line-height: 1.6;
      margin: 0 0 20px 0;
      color: #fff;
    }

    /* Godot BBCode Live Previews */
    .wave {
      display: inline-block;
      animation: waveEffect 1.5s ease-in-out infinite;
      color: var(--hud-teal);
      font-weight: bold;
    }
    .shake {
      display: inline-block;
      animation: shakeEffect 0.2s ease-in-out infinite alternate;
      color: #ff6b6b;
      font-weight: bold;
    }
    .rainbow {
      background: linear-gradient(90deg, #ff6b6b, #ffbf4d, #5cff9d, #48e0d2, #a98bff, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 200% auto;
      animation: rainbowEffect 3s linear infinite;
      font-weight: bold;
    }

    @keyframes waveEffect {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    @keyframes shakeEffect {
      0% { transform: translate(-1px, 1px); }
      100% { transform: translate(1px, -1px); }
    }
    @keyframes rainbowEffect {
      to { background-position: 200% center; }
    }

    .choice-group {
      display: flex;
      gap: 10px;
    }
    .choice-btn {
      background: #142238;
      border: 1px solid var(--line);
      color: var(--bio-green);
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.15s;
    }
    .choice-btn:hover {
      background: var(--bio-green);
      color: #070a10;
    }
  </style>
</head>
<body>
  <div class="dialogue-box">
    <div class="speaker-name">Navigator Lyra</div>
    <div class="dialogue-text">
      The hyperdrive conduit is <span class="wave">fluctuating gently</span>, but the sensors detect a <span class="shake">critical anomaly</span> right ahead! Behold the <span class="rainbow">Legendary Nebula</span>!
    </div>
    <div class="choice-group">
      <button class="choice-btn">1. Engage Thrusters</button>
      <button class="choice-btn">2. Scan Radiation</button>
    </div>
  </div>
</body>
</html>`
  },

  {
    id: 'godot-web-shell',
    name: 'Godot HTML5 Web Shell',
    project: 'Godot',
    badge: 'Game Dev / Web',
    description: 'Responsive canvas harness for Godot 4 Web exports with custom HUD loading bar and fullscreen toggle.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Godot 4 ✦ Web Export Harness</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #070a10;
      color: #e8eef8;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    #game-container {
      position: relative;
      width: 800px;
      max-width: 95vw;
      aspect-ratio: 16 / 9;
      background: #0c1320;
      border: 2px solid #203453;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(72, 224, 210, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
    #hud-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px 16px;
      background: linear-gradient(180deg, transparent, rgba(7, 10, 16, 0.85));
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-family: ui-monospace, monospace;
      color: #8d9bb6;
    }
    .hud-title {
      color: #5cff9d;
      font-weight: bold;
    }
    .hud-btn {
      background: #122036;
      border: 1px solid #203453;
      color: #48e0d2;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
    }
    .hud-btn:hover {
      background: #48e0d2;
      color: #070a10;
    }
  </style>
</head>
<body>
  <div id="game-container">
    <canvas id="canvas"></canvas>
    <div id="hud-overlay">
      <span class="hud-title">✦ Godot 4 Web Engine</span>
      <div>
        <button class="hud-btn" onclick="document.getElementById('game-container').requestFullscreen()">[⛶ Fullscreen]</button>
      </div>
    </div>
  </div>
  <p style="color:#8d9bb6; font-size:12px; margin-top:12px; font-family:ui-monospace,monospace;">
    Replace with your exported Godot .js / .wasm script or test canvas interactions here.
  </p>
</body>
</html>`
  }
];
