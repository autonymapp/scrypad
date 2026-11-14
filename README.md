# ScryPad `< 👁️ >`

> **Sci-Fantasy Tools for Everyday Adventurers**  
> An indie web tool by [Interstatus Lab](https://lab.interstatus.app).

ScryPad is a distraction-free, ultra-snappy live WYSIWYG & HTML code editor built for indie hackers, creative writers, and developers who are tired of burning LLM tokens or wrestling with bloated IDEs just to tweak a few lines of copy or change a color.

Inspired by classic 90s/2000s tools like CoffeeCup HTML Editor, redesigned with a cyberpunk laboratory HUD aesthetic (inspired by the FF7R interface).

---

## ✦ Features

* **`< 👁️ >` Dual-View Live Sync**: Edit raw HTML on the left (powered by CodeMirror 6) with syntax highlighting, line numbers, and clean indentation; watch your changes render instantly in the live sandbox on the right.
* **✍️ Click & Tweak Text**: Click anywhere in the live preview to edit text, headlines, and buttons directly on the page like a word processor. Visual edits automatically re-serialize back into clean raw HTML without losing your place.
* **💾 Local File System Access (`Ctrl + S`)**: Built with the modern Web File System Access API. Open `.html` files directly from your hard drive and press `Ctrl + S` to save changes straight back to disk without needing a server.
* **📦 1-Click CDN Library Injector**: Inject popular indie libraries into your document's `<head>` with a single click:
  * **Tailwind CSS** (Instant utility styling)
  * **Pico CSS** (Semantic, clean, classless CSS)
  * **Lucide Icons** (Clean vector icon set)
  * **Canvas Confetti** (Delightful celebration particles)
  * **Google Fonts: Inter & JetBrains Mono** (Modern UI & monospace typography)
  * **Alpine.js** (Lightweight reactive state)
* **📱 Responsive Viewports**: Test your layout in Desktop (100%), Tablet (768px), and Mobile (390px) viewports with one click.
* **✨ Clean Code**: Single-click HTML beautifier and indentation formatter.
* **⚡ Progressive Web App (PWA)**: Installable directly to your desktop or mobile home screen with offline caching.

---

## ✦ Interstatus Lab Design DNA

* **Look**: Cyberpunk laboratory, sleek first, futuristic second.
* **Palette**: Void (`#070a10`), Panel Hi (`#122036`), Bio Green (`#5cff9d`), HUD Teal (`#48e0d2`), and Ink (`#e8eef8`).
* **Typography**: Self-hosted Rajdhani (Headings), IBM Plex Sans (Body), and IBM Plex Mono / JetBrains Mono (Code).
* **Icons**: Lucide icons exclusively (no emoji in the UI).

---

## ✦ Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## ✦ License

Open source under the MIT License. Crafted with care by Graves Ghostly at Interstatus Lab.
