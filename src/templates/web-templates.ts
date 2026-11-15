export interface WebTemplate {
  id: string;
  name: string;
  category: 'Cards' | 'Components' | 'Layouts' | 'Forms' | 'Dashboards';
  badge: string;
  description: string;
  html: string;
}

export const WEB_TEMPLATES: WebTemplate[] = [
  {
    id: 'pricing-card',
    name: 'Pricing Tier Card',
    category: 'Components',
    badge: 'Component / Pricing',
    description: 'Modern SaaS/Product pricing tier card with price tag, feature checklist, and CTA button.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pricing Tier Card</title>
  <style>
    :root {
      --bg: #070a10;
      --card-bg: #0d1422;
      --border: #203453;
      --accent: #48e0d2;
      --green: #5cff9d;
      --text: #e8eef8;
      --muted: #8d9bb6;
    }
    body {
      margin: 0;
      padding: 40px 20px;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .pricing-card {
      max-width: 380px;
      width: 100%;
      background: linear-gradient(180deg, #122036 0%, #0d1422 100%);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px 28px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      position: relative;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: rgba(72, 224, 210, 0.12);
      color: var(--accent);
      border: 1px solid rgba(72, 224, 210, 0.35);
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 16px;
    }
    h2 {
      margin: 0 0 6px 0;
      font-size: 1.5rem;
      color: #ffffff;
    }
    .desc {
      color: var(--muted);
      font-size: 0.9rem;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    .price-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }
    .price {
      font-size: 2.8rem;
      font-weight: 800;
      color: #ffffff;
    }
    .period {
      color: var(--muted);
      font-size: 0.95rem;
    }
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0 0 28px 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .feature-list li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.92rem;
      color: var(--text);
    }
    .check {
      color: var(--green);
      font-weight: bold;
    }
    .cta-btn {
      display: block;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      background: linear-gradient(135deg, var(--green), var(--accent));
      color: #070a10;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(92, 255, 157, 0.35);
    }
  </style>
</head>
<body>
  <div class="pricing-card">
    <span class="badge">Most Popular</span>
    <h2>Pro Creator Tier</h2>
    <p class="desc">Designed for power users, solo creators, and growing teams.</p>
    <div class="price-row">
      <span class="price">$29</span>
      <span class="period">/ month</span>
    </div>
    <ul class="feature-list">
      <li><span class="check">✓</span> Unlimited live projects &amp; documents</li>
      <li><span class="check">✓</span> Custom domain &amp; SSL export</li>
      <li><span class="check">✓</span> Live palette scanner &amp; replace</li>
      <li><span class="check">✓</span> Priority Discord community access</li>
    </ul>
    <button class="cta-btn">Start 14-Day Free Trial</button>
  </div>
</body>
</html>`
  },
  {
    id: 'profile-card',
    name: 'Profile & Bio Card',
    category: 'Cards',
    badge: 'Card / Bio',
    description: 'Personal portfolio link-in-bio card with avatar badge, bio, skill tags, and action buttons.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Creator Profile Card</title>
  <style>
    :root {
      --bg: #070a10;
      --card-bg: #0c1320;
      --border: #203453;
      --accent: #48e0d2;
      --purple: #a98bff;
      --text: #e8eef8;
      --muted: #8d9bb6;
    }
    body {
      margin: 0;
      padding: 40px 20px;
      background: radial-gradient(circle at 50% 20%, #151f33 0%, #070a10 75%);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .profile-card {
      max-width: 420px;
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 32px 28px;
      text-align: center;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.7);
    }
    .avatar-wrapper {
      position: relative;
      width: 88px;
      height: 88px;
      margin: 0 auto 18px auto;
    }
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--purple));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 800;
      color: #070a10;
      box-shadow: 0 0 20px rgba(72, 224, 210, 0.4);
    }
    .status-dot {
      position: absolute;
      bottom: 2px;
      right: 4px;
      width: 14px;
      height: 14px;
      background: #5cff9d;
      border: 3px solid var(--card-bg);
      border-radius: 50%;
    }
    h1 {
      margin: 0 0 6px 0;
      font-size: 1.45rem;
      color: #fff;
    }
    .role {
      color: var(--accent);
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0 0 16px 0;
    }
    .bio {
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .tags {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 24px;
    }
    .tag {
      font-size: 11px;
      padding: 4px 10px;
      background: #122036;
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--muted);
    }
    .links-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .link-btn {
      display: block;
      padding: 10px 16px;
      background: #122036;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.15s;
    }
    .link-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: #182a47;
    }
  </style>
</head>
<body>
  <div class="profile-card">
    <div class="avatar-wrapper">
      <div class="avatar">AR</div>
      <div class="status-dot" title="Available for projects"></div>
    </div>
    <h1>Alex Vance</h1>
    <div class="role">Creative Technologist &amp; UI Developer</div>
    <p class="bio">Building atmospheric interfaces, tactile generative tools, and interactive fiction across the web.</p>
    <div class="tags">
      <span class="tag">TypeScript</span>
      <span class="tag">WebGL</span>
      <span class="tag">UI Design</span>
      <span class="tag">Tauri</span>
    </div>
    <div class="links-grid">
      <a href="#" class="link-btn">✦ View Selected Works</a>
      <a href="#" class="link-btn">✦ GitHub Repositories</a>
      <a href="#" class="link-btn">✦ Read Development Notes</a>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'newsletter-hero',
    name: 'Newsletter Hero Section',
    category: 'Layouts',
    badge: 'Layout / Hero',
    description: 'Lead generation and newsletter subscription banner with headline, input group, and reassurance text.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter Hero Section</title>
  <style>
    :root {
      --bg: #070a10;
      --card: #0c1320;
      --border: #203453;
      --green: #5cff9d;
      --teal: #48e0d2;
      --text: #e8eef8;
      --muted: #8d9bb6;
    }
    body {
      margin: 0;
      padding: 60px 20px;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .hero-container {
      max-width: 640px;
      width: 100%;
      text-align: center;
      background: linear-gradient(180deg, #101a2c 0%, #0c1320 100%);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 48px 36px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: rgba(92, 255, 157, 0.12);
      color: var(--green);
      border: 1px solid rgba(92, 255, 157, 0.3);
      padding: 5px 14px;
      border-radius: 20px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 2.2rem;
      margin: 0 0 16px 0;
      letter-spacing: -0.02em;
      line-height: 1.25;
      color: #fff;
    }
    .highlight {
      background: linear-gradient(90deg, var(--green), var(--teal));
      -webkit-background-clip: text;
      color: transparent;
    }
    p {
      color: var(--muted);
      font-size: 1.05rem;
      line-height: 1.6;
      margin: 0 0 32px 0;
    }
    .subscribe-form {
      display: flex;
      gap: 8px;
      max-width: 460px;
      margin: 0 auto 16px auto;
    }
    .input-field {
      flex: 1;
      background: #070a10;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 16px;
      color: #fff;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.15s;
    }
    .input-field:focus {
      border-color: var(--teal);
    }
    .submit-btn {
      background: var(--teal);
      color: #070a10;
      font-weight: 700;
      font-size: 0.95rem;
      border: none;
      border-radius: 8px;
      padding: 12px 22px;
      cursor: pointer;
      white-space: nowrap;
      transition: opacity 0.15s;
    }
    .submit-btn:hover {
      opacity: 0.9;
    }
    .disclaimer {
      font-size: 0.8rem;
      color: #627290;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="hero-container">
    <div class="badge">✦ Weekly Engineering Digest</div>
    <h1>Level up your <span class="highlight">frontend artistry</span></h1>
    <p>Join 15,000+ indie developers receiving practical tutorials on modern CSS, canvas shaders, web audio, and tactile user experiences.</p>
    <form class="subscribe-form" onsubmit="event.preventDefault(); alert('Subscribed!');">
      <input type="email" class="input-field" placeholder="Enter your email address..." required>
      <button type="submit" class="submit-btn">Subscribe</button>
    </form>
    <p class="disclaimer">Zero spam. Pure signal. Unsubscribe whenever you wish with one click.</p>
  </div>
</body>
</html>`
  },
  {
    id: 'blog-article',
    name: 'Editorial Article Layout',
    category: 'Layouts',
    badge: 'Layout / Reading',
    description: 'Clean longform blog article reading layout with metadata header, pull quote, and typography.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Editorial Article Layout</title>
  <style>
    :root {
      --bg: #070a10;
      --card: #0c1320;
      --border: #203453;
      --teal: #48e0d2;
      --amber: #ffbf4d;
      --text: #e8eef8;
      --muted: #8d9bb6;
    }
    body {
      margin: 0;
      padding: 40px 20px;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
      display: flex;
      justify-content: center;
      line-height: 1.75;
    }
    .article-wrap {
      max-width: 660px;
      width: 100%;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 44px 36px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.85rem;
      color: var(--muted);
      margin-bottom: 14px;
      font-family: ui-monospace, monospace;
    }
    .category {
      color: var(--teal);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    h1 {
      font-size: 2.1rem;
      margin: 0 0 20px 0;
      color: #ffffff;
      line-height: 1.3;
      letter-spacing: -0.01em;
    }
    .divider {
      height: 1px;
      background: var(--border);
      margin: 24px 0;
    }
    p {
      color: var(--text);
      font-size: 1.05rem;
      margin: 0 0 20px 0;
    }
    blockquote {
      margin: 28px 0;
      padding: 16px 22px;
      background: rgba(18, 32, 54, 0.4);
      border-left: 4px solid var(--amber);
      border-radius: 0 8px 8px 0;
      font-style: italic;
      color: #ffffff;
      font-size: 1.1rem;
    }
    cite {
      display: block;
      margin-top: 8px;
      font-size: 0.85rem;
      color: var(--muted);
      font-style: normal;
    }
  </style>
</head>
<body>
  <article class="article-wrap">
    <div class="meta">
      <span class="category">✦ Design Systems</span>
      <span>•</span>
      <time>November 14, 2026</time>
      <span>•</span>
      <span>5 min read</span>
    </div>
    <h1>The Tactile Web: Designing Beyond Flat Surfaces</h1>
    <div class="divider"></div>
    <p>For more than a decade, web interfaces pursued clinical flatness. Every shadow was softened, every corner standardized, until digital surfaces lost their sense of mechanical presence.</p>
    <p>Tactile design isn't about gratuitous skeuomorphism. It is about physical feedback: responsive bevels that depress with micro-inertia, borders that carry subtle luminescent currents, and layouts that respect deliberate hierarchy.</p>
    <blockquote>
      "When software feels like a crafted physical artifact, user hesitation dissolves into intuition."
      <cite>— Elena Rostova, Systems Architect</cite>
    </blockquote>
    <p>By pairing accessible semantic HTML with custom polygon cutouts and dynamic color swatches, creators can sculpt memorable tools without surrendering performance.</p>
  </article>
</body>
</html>`
  },
  {
    id: 'stats-dashboard',
    name: 'Stats Metric Grid',
    category: 'Dashboards',
    badge: 'Dashboard / Stats',
    description: 'Responsive multi-column analytics grid with KPI numbers, delta indicators, and status meters.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stats Metric Grid</title>
  <style>
    :root {
      --bg: #070a10;
      --panel: #0c1320;
      --card: #122036;
      --border: #203453;
      --green: #5cff9d;
      --teal: #48e0d2;
      --text: #e8eef8;
      --muted: #8d9bb6;
    }
    body {
      margin: 0;
      padding: 40px 20px;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .dashboard-panel {
      max-width: 680px;
      width: 100%;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6);
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #fff;
    }
    .live-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      color: var(--green);
      background: rgba(92, 255, 157, 0.1);
      border: 1px solid rgba(92, 255, 157, 0.3);
      padding: 3px 10px;
      border-radius: 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }
    .stat-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 20px;
    }
    .stat-label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .stat-value {
      font-size: 1.85rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 8px;
    }
    .stat-delta {
      font-size: 0.82rem;
      color: var(--green);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .progress-bar {
      width: 100%;
      height: 6px;
      background: #070a10;
      border-radius: 3px;
      margin-top: 12px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--teal), var(--green));
    }
  </style>
</head>
<body>
  <div class="dashboard-panel">
    <div class="panel-header">
      <h2>Project Overview &amp; Metrics</h2>
      <span class="live-badge">● Live Synced</span>
    </div>
    <div class="grid">
      <div class="stat-card">
        <div class="stat-label">Active Visitors</div>
        <div class="stat-value">28,490</div>
        <div class="stat-delta">▲ +14.2% this week</div>
        <div class="progress-bar"><div class="progress-fill" style="width: 78%;"></div></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Conversion Rate</div>
        <div class="stat-value">4.82%</div>
        <div class="stat-delta">▲ +0.6% vs benchmark</div>
        <div class="progress-bar"><div class="progress-fill" style="width: 62%;"></div></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">API Throughput</div>
        <div class="stat-value">99.98%</div>
        <div class="stat-delta" style="color: var(--teal);">● 18ms latency</div>
        <div class="progress-bar"><div class="progress-fill" style="width: 95%;"></div></div>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'feedback-modal',
    name: 'Interactive Feedback Dialog',
    category: 'Forms',
    badge: 'Modal / Form',
    description: 'Centered dialog card with reaction selector, message textarea, and submission controls.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Feedback Dialog</title>
  <style>
    :root {
      --bg: #070a10;
      --modal: #0d1422;
      --border: #203453;
      --teal: #48e0d2;
      --amber: #ffbf4d;
      --text: #e8eef8;
      --muted: #8d9bb6;
    }
    body {
      margin: 0;
      padding: 20px;
      background: rgba(7, 10, 16, 0.95);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .modal-sheet {
      max-width: 440px;
      width: 100%;
      background: var(--modal);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 30px 26px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 24px rgba(72, 224, 210, 0.1);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    h2 {
      margin: 0;
      font-size: 1.35rem;
      color: #fff;
    }
    .close-btn {
      background: none;
      border: none;
      color: var(--muted);
      font-size: 1.2rem;
      cursor: pointer;
    }
    .desc {
      color: var(--muted);
      font-size: 0.9rem;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }
    .rating-row {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 20px;
    }
    .rate-btn {
      flex: 1;
      padding: 10px 4px;
      background: #122036;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-size: 1.3rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .rate-btn:hover {
      border-color: var(--teal);
      transform: translateY(-2px);
    }
    .textarea {
      width: 100%;
      box-sizing: border-box;
      background: #070a10;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      color: #fff;
      font-size: 0.9rem;
      font-family: inherit;
      resize: vertical;
      min-height: 90px;
      margin-bottom: 22px;
      outline: none;
    }
    .textarea:focus {
      border-color: var(--teal);
    }
    .action-row {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn-secondary {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 9px 18px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-primary {
      background: var(--teal);
      border: none;
      color: #070a10;
      padding: 9px 20px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="modal-sheet">
    <div class="modal-header">
      <h2>Send Feedback</h2>
      <button class="close-btn" onclick="alert('Closed')">✕</button>
    </div>
    <p class="desc">How was your editing session today? Tell us what you loved or what we can polish.</p>
    <div class="rating-row">
      <button class="rate-btn" title="Needs work">🙁</button>
      <button class="rate-btn" title="Okay">😐</button>
      <button class="rate-btn" title="Great">🙂</button>
      <button class="rate-btn" title="Incredible!">🚀</button>
    </div>
    <textarea class="textarea" placeholder="Share your suggestions, bug reports, or feature ideas..."></textarea>
    <div class="action-row">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-primary" onclick="alert('Thank you for your feedback!')">Send Feedback</button>
    </div>
  </div>
</body>
</html>`
  }
];


