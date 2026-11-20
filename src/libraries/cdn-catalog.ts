export interface CdnLibrary {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  snippet: string;
}

export const CDN_LIBRARIES: CdnLibrary[] = [
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'CSS Framework',
    badge: 'Utility',
    description: 'Utility-first CSS framework (JIT runtime via CDN)',
    snippet: '<script src="https://cdn.tailwindcss.com"></script>'
  },
  {
    id: 'pico',
    name: 'Pico CSS',
    category: 'CSS Framework',
    badge: 'Classless',
    description: 'Styles plain HTML tags, no classes needed',
    snippet: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">'
  },
  {
    id: 'lucide',
    name: 'Lucide Icons',
    category: 'Icons',
    badge: 'SVG Icons',
    description: 'Icon pack: write the icon name and it swaps in the picture',
    snippet: '<script src="https://unpkg.com/lucide@latest"></script>\n<script>window.addEventListener("DOMContentLoaded", () => { if (window.lucide) window.lucide.createIcons(); });</script>'
  },
  {
    id: 'confetti',
    name: 'Canvas Confetti',
    category: 'Animation',
    badge: 'FX',
    description: 'Confetti bursts for buttons and celebrations',
    snippet: '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>'
  },
  {
    id: 'font-inter',
    name: 'Google Fonts: Inter',
    category: 'Typography',
    badge: 'Font',
    description: 'Easy-to-read sans-serif for menus and body text',
    snippet: '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n<style>body { font-family: "Inter", sans-serif; }</style>'
  },
  {
    id: 'font-jetbrains',
    name: 'Google Fonts: JetBrains Mono',
    category: 'Typography',
    badge: 'Monospace',
    description: 'Monospace font made for code',
    snippet: '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">\n<style>code, pre, .mono { font-family: "JetBrains Mono", monospace; }</style>'
  },
  {
    id: 'alpine',
    name: 'Alpine.js',
    category: 'Micro-Framework',
    badge: 'Reactivity',
    description: 'Small script that adds interactivity right in your HTML attributes',
    snippet: '<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>'
  }
];

export function injectSnippetIntoHtml(html: string, snippet: string): string {
  if (html.includes('</head>')) {
    return html.replace('</head>', `  ${snippet}\n</head>`);
  }
  if (html.includes('<body')) {
    return html.replace('<body', `${snippet}\n<body`);
  }
  return `${snippet}\n${html}`;
}
