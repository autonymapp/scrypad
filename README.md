# ScryPad `< 👁️ >`

> **Sci-Fantasy Tools for Everyday Adventurers**  
> An indie web tool by [Interstatus Lab](https://lab.interstatus.app).

ScryPad is a distraction-free, ultra-snappy live WYSIWYG & HTML code editor built for indie hackers, creative writers, and developers who are tired of wrestling with bloated, confusing IDEs just to tweak a few lines of copy or change a color.

Modern IDEs are great for complex software architectures, but when all you want to do is change text or preview a page layout, they're overwhelming. ScryPad brings back the simplicity of a plain Notepad, with the page right next to your code.

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

## ✦ Design

* **Look**: Artificer's Forge. Slanted buttons, cut corners, a soft forge glow only on active things, and a calm code pane you can stare at for hours.
* **Colors**: Arcane Violet (`#c56bff`), lilac (`#d896ff`), Moonsilver (`#d9e2f2`) and gold strings (`#f2d27a`) on `#0f0b16`.
* **Type**: Chakra Petch (headings), Figtree (body), Fira Code (code and labels), all self-hosted.
* **Icons**: Lucide only, no emoji in the UI.
* **Wisp**: ScryPad's Wisp burns in the Dusk flame and only appears on the Blank Page screen and in About.

## ✦ Scry Your Own Code

Use ScryPad on your own pages and pages you have the rights to, and respect other people's work.

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
