import { 
  createIcons, 
  FilePlus, 
  FolderOpen, 
  Save, 
  FileCode, 
  BookCopy, 
  Sparkles, 
  MousePointerClick, 
  Code, 
  Eye, 
  AlertTriangle,
  X 
} from 'lucide';
import { CodePane } from './editor/code-pane.ts';
import { PreviewPane } from './preview/preview-pane.ts';
import { FileManager, FileState } from './files/file-manager.ts';
import { SyncCoordinator } from './sync/sync-coordinator.ts';
import { CDN_LIBRARIES, injectSnippetIntoHtml } from './libraries/cdn-catalog.ts';

// Initial Starter HTML (ScryPad's Own Interactive Explainer)
const STARTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ScryPad ✦ Live HTML Editor</title>
  <style>
    :root {
      --void: #070a10;
      --panel: #0c1320;
      --line: #203453;
      --ink: #e8eef8;
      --dim: #8d9bb6;
      --bio-green: #5cff9d;
      --hud-teal: #48e0d2;
    }
    body {
      margin: 0;
      padding: 44px 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: radial-gradient(circle at 50% 20%, #122036 0%, #070a10 70%);
      color: var(--ink);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
    }
    .hud-card {
      max-width: 540px;
      width: 100%;
      background: linear-gradient(180deg, rgba(18, 32, 54, 0.85) 0%, rgba(12, 19, 32, 0.95) 100%);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 34px 30px;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6), 0 0 20px rgba(72, 224, 210, 0.1);
      text-align: center;
      position: relative;
    }
    .hud-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: rgba(92, 255, 157, 0.12);
      color: var(--bio-green);
      border: 1px solid rgba(92, 255, 157, 0.35);
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 18px;
    }
    h1 {
      font-size: 2.1rem;
      margin: 0 0 12px 0;
      color: #ffffff;
      letter-spacing: -0.02em;
    }
    p {
      color: var(--dim);
      font-size: 1.02rem;
      line-height: 1.6;
      margin: 0 0 22px 0;
    }
    .features-list {
      text-align: left;
      background: rgba(7, 10, 16, 0.6);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
      font-size: 0.9rem;
      color: var(--dim);
    }
    .features-list li {
      margin-bottom: 8px;
      line-height: 1.5;
    }
    .features-list li:last-child {
      margin-bottom: 0;
    }
    .features-list strong {
      color: var(--hud-teal);
    }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, var(--bio-green), var(--hud-teal));
      color: #070a10;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 12px 30px;
      border-radius: 6px;
      text-decoration: none;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 0 16px rgba(92, 255, 157, 0.3);
    }
    .cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 24px rgba(92, 255, 157, 0.5);
    }
  </style>
</head>
<body>
  <div class="hud-card">
    <div class="hud-badge">✦ Welcome to ScryPad</div>
    <h1>Web Editing, Simplified</h1>
    <p>You're viewing this live document inside ScryPad right now. Click on any text to edit it, or write raw code on the left without IDE clutter.</p>
    
    <div class="features-list">
      <ul style="margin: 0; padding-left: 18px;">
        <li><strong>Click &amp; Tweak Text:</strong> Click anywhere on this page and start typing to update the copy.</li>
        <li><strong>Dual-Sync Code:</strong> Changes update the raw HTML on the left instantly, and vice versa.</li>
        <li><strong>Save Locally:</strong> Press <code>Ctrl + S</code> to save changes straight to your local file.</li>
      </ul>
    </div>

    <a href="#" class="cta-btn">Click &amp; Edit This Button Text</a>
  </div>
</body>
</html>`;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Render Lucide Icons (Tree-shaken)
  createIcons({
    icons: {
      FilePlus,
      FolderOpen,
      Save,
      FileCode,
      BookCopy,
      Sparkles,
      MousePointerClick,
      Code,
      Eye,
      AlertTriangle,
      X
    }
  });

  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('PWA service worker registration failed:', err);
      });
    });
  }

  // File Manager
  const fileManager = new FileManager();

  // Elements
  const codeMount = document.getElementById('code-mount')!;
  const previewMount = document.getElementById('preview-mount')!;
  const activeFilename = document.getElementById('active-filename')!;
  const dirtyIndicator = document.getElementById('dirty-indicator')!;
  const toggleVisualEdit = document.getElementById('toggle-visual-edit') as HTMLInputElement;
  const previewModeTag = document.getElementById('preview-mode-tag')!;
  const quickColor = document.getElementById('quick-color') as HTMLInputElement;

  let coordinator: SyncCoordinator;

  // Initialize Code Editor
  const codePane = new CodePane({
    container: codeMount,
    initialValue: STARTER_HTML,
    onDocChange: (code) => {
      if (coordinator) coordinator.handleCodeChange(code);
      checkRelativeCss(code);
    }
  });

  // Initialize Preview Pane
  const previewPane = new PreviewPane({
    container: previewMount,
    onVisualDocChange: (html) => {
      if (coordinator) coordinator.handleVisualChange(html);
    },
    onSelectElement: (domPath) => {
      if (coordinator) coordinator.handleDomPathSelect(domPath);
    }
  });

  // Coordinator
  coordinator = new SyncCoordinator(codePane, previewPane, fileManager);

  // Initial preview render
  previewPane.render(STARTER_HTML);

  // Relative CSS Link Detection & Embedding
  const relativeCssBanner = document.getElementById('relative-css-banner');
  const relativeCssMsg = document.getElementById('relative-css-msg');
  const btnEmbedCss = document.getElementById('btn-embed-css');
  const btnDismissCssBanner = document.getElementById('btn-dismiss-css-banner');
  const cssFileInput = document.getElementById('css-file-input') as HTMLInputElement;

  function checkRelativeCss(code: string) {
    if (!relativeCssBanner || !relativeCssMsg) return;
    const regex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["'](?!https?:\/\/|\/\/)([^"']+)["'][^>]*>/i;
    const match = code.match(regex);
    if (match) {
      const href = match[1];
      relativeCssMsg.innerHTML = `Local stylesheet link detected: <code class="text-white bg-[#070a10] px-1.5 py-0.5 rounded border border-[#203453]">${href}</code>. In a web sandbox, relative files cannot load unless embedded.`;
      relativeCssBanner.classList.remove('hidden');
    } else {
      relativeCssBanner.classList.add('hidden');
    }
  }

  btnDismissCssBanner?.addEventListener('click', () => {
    relativeCssBanner?.classList.add('hidden');
  });

  btnEmbedCss?.addEventListener('click', () => {
    cssFileInput?.click();
  });

  cssFileInput?.addEventListener('change', async () => {
    const file = cssFileInput.files?.[0];
    if (!file) return;
    const cssText = await file.text();
    let currentCode = codePane.getValue();
    const regex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["'](?!https?:\/\/|\/\/)([^"']+)["'][^>]*>/i;
    if (currentCode.match(regex)) {
      currentCode = currentCode.replace(regex, `<style>\n/* --- Inlined ${file.name} --- */\n${cssText}\n</style>`);
    } else {
      currentCode = `<style>\n/* --- Inlined ${file.name} --- */\n${cssText}\n</style>\n${currentCode}`;
    }
    codePane.setValue(currentCode);
    previewPane.render(currentCode);
    coordinator.updateStats();
    fileManager.markDirty(true);
    checkRelativeCss(currentCode);
  });

  // File Manager UI Subscription
  fileManager.subscribe((state: FileState) => {
    activeFilename.textContent = state.name;
    if (state.isDirty) {
      dirtyIndicator.classList.remove('hidden');
      document.title = `* ${state.name} ✦ ScryPad`;
    } else {
      dirtyIndicator.classList.add('hidden');
      document.title = `${state.name} ✦ ScryPad`;
    }
  });

  // Save File Button
  document.getElementById('btn-save')?.addEventListener('click', async () => {
    const success = await fileManager.saveFile(codePane.getValue());
    if (success) {
      const saveLabel = document.getElementById('save-label');
      if (saveLabel) {
        saveLabel.textContent = 'Saved!';
        setTimeout(() => { saveLabel.textContent = 'Save HTML'; }, 1500);
      }
    }
  });

  // Open File Button
  document.getElementById('btn-open')?.addEventListener('click', async () => {
    const content = await fileManager.openFile();
    if (content !== null) {
      codePane.setValue(content);
      previewPane.render(content);
      coordinator.updateStats();
      checkRelativeCss(content);
    }
  });

  // New File Button
  document.getElementById('btn-new')?.addEventListener('click', () => {
    if (fileManager.isDirty()) {
      if (!confirm('You have unsaved changes. Create a new document?')) {
        return;
      }
    }
    fileManager.setUntitled();
    codePane.setValue(STARTER_HTML);
    previewPane.render(STARTER_HTML);
    coordinator.updateStats();
    checkRelativeCss(STARTER_HTML);
  });

  // Keyboard shortcut Ctrl+S / Cmd+S
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      document.getElementById('btn-save')?.click();
    }
  });

  // Visual Edit Toggle
  toggleVisualEdit.addEventListener('change', () => {
    const active = toggleVisualEdit.checked;
    previewPane.setVisualEditMode(active);
    previewModeTag.textContent = active ? 'Direct Tweak Active' : 'Read-only Preview';
    previewModeTag.className = active ? 'text-[#48e0d2]' : 'text-[#8d9bb6]';
  });

  // Quick Format Bar
  document.getElementById('btn-bold')?.addEventListener('click', () => {
    previewPane.applyStyleCommand('bold');
  });
  document.getElementById('btn-italic')?.addEventListener('click', () => {
    previewPane.applyStyleCommand('italic');
  });
  quickColor.addEventListener('input', (e) => {
    const val = (e.target as HTMLInputElement).value;
    previewPane.applyStyleCommand('foreColor', val);
  });

  // Clean Code / Beautify
  document.getElementById('btn-beautify')?.addEventListener('click', () => {
    codePane.formatHtml();
    previewPane.render(codePane.getValue());
    coordinator.updateStats();
  });

  // Responsive Viewports
  const viewportBtns = document.querySelectorAll('.viewport-btn');
  viewportBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      viewportBtns.forEach((b) => {
        b.className = 'viewport-btn px-2.5 py-0.5 rounded text-[#8d9bb6] hover:bg-[#122036] hover:text-[#e8eef8]';
      });
      btn.className = 'viewport-btn px-2.5 py-0.5 rounded bg-[#122036] text-[#48e0d2] border border-[#2e4d75]';
      const width = btn.getAttribute('data-width') || '100%';
      previewPane.setViewportWidth(width);
    });
  });

  // View Modes (Split / Code / Preview)
  const codePaneContainer = document.getElementById('code-pane-container')!;
  const previewPaneContainer = document.getElementById('preview-pane-container')!;

  const modeButtons = {
    split: document.getElementById('mode-split')!,
    code: document.getElementById('mode-code')!,
    preview: document.getElementById('mode-preview')!
  };

  function setViewMode(mode: 'split' | 'code' | 'preview') {
    Object.entries(modeButtons).forEach(([m, btn]) => {
      if (m === mode) {
        btn.className = "px-2.5 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded bg-[#122036] text-[#48e0d2] border border-[#2e4d75]";
      } else {
        btn.className = "px-2.5 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded text-[#8d9bb6] hover:text-[#e8eef8]";
      }
    });

    if (mode === 'split') {
      codePaneContainer.style.display = 'flex';
      codePaneContainer.style.width = '50%';
      previewPaneContainer.style.display = 'flex';
      previewPaneContainer.style.width = '50%';
    } else if (mode === 'code') {
      codePaneContainer.style.display = 'flex';
      codePaneContainer.style.width = '100%';
      previewPaneContainer.style.display = 'none';
    } else {
      codePaneContainer.style.display = 'none';
      previewPaneContainer.style.display = 'flex';
      previewPaneContainer.style.width = '100%';
    }
  }

  modeButtons.split.addEventListener('click', () => setViewMode('split'));
  modeButtons.code.addEventListener('click', () => setViewMode('code'));
  modeButtons.preview.addEventListener('click', () => setViewMode('preview'));

  // CDN Library Injector Modal
  const modalLibrary = document.getElementById('modal-library')!;
  const libraryList = document.getElementById('library-list')!;
  const btnLibraryToggle = document.getElementById('btn-library-toggle')!;
  const btnCloseModal = document.getElementById('btn-close-modal')!;
  const btnModalDone = document.getElementById('btn-modal-done')!;

  // Render library list
  libraryList.innerHTML = CDN_LIBRARIES.map((lib) => `
    <div class="hud-frame p-3 rounded flex items-center justify-between gap-3 hover:border-[#48e0d2] transition">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <span class="font-['Rajdhani'] font-bold text-white text-sm tracking-wide">${lib.name}</span>
          <span class="text-[10px] font-['IBM_Plex_Mono'] uppercase px-1.5 py-0.2 bg-[#122036] text-[#48e0d2] border border-[#203453] rounded">${lib.badge}</span>
        </div>
        <p class="text-xs text-[#8d9bb6] mt-0.5">${lib.description}</p>
      </div>
      <button class="btn-hud btn-hud-ghost btn-inject text-xs whitespace-nowrap" data-lib-id="${lib.id}">
        <span>+ Inject</span>
      </button>
    </div>
  `).join('');

  // Wire inject buttons
  libraryList.querySelectorAll('.btn-inject').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const libId = target.getAttribute('data-lib-id');
      const lib = CDN_LIBRARIES.find((l) => l.id === libId);
      if (lib) {
        const currentCode = codePane.getValue();
        const updatedCode = injectSnippetIntoHtml(currentCode, lib.snippet);
        codePane.setValue(updatedCode);
        previewPane.render(updatedCode);
        coordinator.updateStats();

        target.innerHTML = '<span>✦ Injected!</span>';
        target.classList.remove('btn-hud-ghost');
        target.classList.add('btn-hud-primary');
        setTimeout(() => {
          target.innerHTML = '<span>+ Inject</span>';
          target.classList.remove('btn-hud-primary');
          target.classList.add('btn-hud-ghost');
        }, 1500);
      }
    });
  });

  btnLibraryToggle.addEventListener('click', () => {
    modalLibrary.classList.remove('hidden');
  });
  btnCloseModal.addEventListener('click', () => {
    modalLibrary.classList.add('hidden');
  });
  btnModalDone.addEventListener('click', () => {
    modalLibrary.classList.add('hidden');
  });
  modalLibrary.addEventListener('click', (e) => {
    if (e.target === modalLibrary) modalLibrary.classList.add('hidden');
  });
});
