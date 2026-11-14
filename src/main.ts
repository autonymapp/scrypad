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
  X,
  Palette,
  Sun,
  Moon,
  SlidersHorizontal,
  ClipboardCopy,
  Check
} from 'lucide';
import { CodePane } from './editor/code-pane.ts';
import { PreviewPane, ActiveElementInfo } from './preview/preview-pane.ts';
import { FileManager, FileState } from './files/file-manager.ts';
import { SyncCoordinator } from './sync/sync-coordinator.ts';
import { CDN_LIBRARIES, injectSnippetIntoHtml } from './libraries/cdn-catalog.ts';
import { extractPalette, replaceColor, ColorSwatch } from './tools/palette-scanner.ts';
import { detectUnlinkedFonts, injectGoogleFont, UnlinkedFont } from './tools/font-detector.ts';
import { findUnembeddedImages, inlineImageInHtml, fileToDataUrl, UnembeddedImage } from './tools/image-inliner.ts';
import { extractCleanBody } from './tools/body-exporter.ts';

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
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
        <li><strong>Style Drawer:</strong> Click any element and use CSS sliders for padding, radius, and colors.</li>
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
      X,
      Palette,
      Sun,
      Moon,
      SlidersHorizontal,
      ClipboardCopy,
      Check
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

  // Style Drawer Elements
  const styleDrawer = document.getElementById('style-drawer')!;
  const btnToggleStyles = document.getElementById('btn-toggle-styles')!;
  const btnCloseStyleDrawer = document.getElementById('btn-close-style-drawer')!;
  const drawerElementTag = document.getElementById('drawer-element-tag')!;
  const sliderFontSize = document.getElementById('slider-font-size') as HTMLInputElement;
  const valFontSize = document.getElementById('val-font-size')!;
  const sliderPadding = document.getElementById('slider-padding') as HTMLInputElement;
  const valPadding = document.getElementById('val-padding')!;
  const sliderMargin = document.getElementById('slider-margin') as HTMLInputElement;
  const valMargin = document.getElementById('val-margin')!;
  const sliderRadius = document.getElementById('slider-radius') as HTMLInputElement;
  const valRadius = document.getElementById('val-radius')!;
  const sliderSpacing = document.getElementById('slider-spacing') as HTMLInputElement;
  const valSpacing = document.getElementById('val-spacing')!;
  const sliderOpacity = document.getElementById('slider-opacity') as HTMLInputElement;
  const valOpacity = document.getElementById('val-opacity')!;
  const pickerTextColor = document.getElementById('picker-text-color') as HTMLInputElement;
  const valTextColor = document.getElementById('val-text-color')!;
  const pickerBgColor = document.getElementById('picker-bg-color') as HTMLInputElement;
  const valBgColor = document.getElementById('val-bg-color')!;

  // Theme Simulator Elements
  const btnThemeSim = document.getElementById('btn-theme-sim')!;
  const themeSimLabel = document.getElementById('theme-sim-label')!;
  const btnBakeTheme = document.getElementById('btn-bake-theme')!;

  // Toast Helper
  const hudToast = document.getElementById('hud-toast')!;
  const hudToastMsg = document.getElementById('hud-toast-msg')!;
  let toastTimeout: any;

  function showToast(message: string, durationMs = 2600) {
    if (toastTimeout) clearTimeout(toastTimeout);
    hudToastMsg.textContent = message;
    hudToast.classList.remove('hidden');
    toastTimeout = setTimeout(() => {
      hudToast.classList.add('hidden');
    }, durationMs);
  }

  let coordinator: SyncCoordinator;

  // Initialize Code Editor
  const codePane = new CodePane({
    container: codeMount,
    initialValue: STARTER_HTML,
    onDocChange: (code) => {
      if (coordinator) coordinator.handleCodeChange(code);
      checkDocumentIntegrity(code);
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
    },
    onActiveElementChange: (info: ActiveElementInfo | null) => {
      if (!info) return;
      populateStyleDrawer(info);
    },
    onImageDropped: (_dataUrl, fileName) => {
      showToast(`✦ Embedded image: ${fileName}`);
      coordinator.updateStats();
      fileManager.markDirty(true);
    }
  });

  // Coordinator
  coordinator = new SyncCoordinator(codePane, previewPane, fileManager);

  // Initial preview render
  previewPane.render(STARTER_HTML);

  // Smart Helper Action Bar & Inputs
  const smartHelperBanner = document.getElementById('smart-helper-banner')!;
  const smartHelperMsg = document.getElementById('smart-helper-msg')!;
  const btnHelperActionCss = document.getElementById('btn-helper-action-css')!;
  const btnHelperActionImg = document.getElementById('btn-helper-action-img')!;
  const btnHelperActionFont = document.getElementById('btn-helper-action-font')!;
  const btnDismissHelper = document.getElementById('btn-dismiss-helper')!;
  const cssFileInput = document.getElementById('css-file-input') as HTMLInputElement;
  const imgFileInput = document.getElementById('img-file-input') as HTMLInputElement;

  let currentPendingTargetImgSrc: string | null = null;
  let currentPendingFont: UnlinkedFont | null = null;

  function checkDocumentIntegrity(code: string) {
    if (!smartHelperBanner || !smartHelperMsg) return;

    // Reset helper buttons
    btnHelperActionCss.classList.add('hidden');
    btnHelperActionCss.style.display = 'none';
    btnHelperActionImg.classList.add('hidden');
    btnHelperActionImg.style.display = 'none';
    btnHelperActionFont.classList.add('hidden');
    btnHelperActionFont.style.display = 'none';

    // 1. Check relative stylesheet link
    const cssRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["'](?!https?:\/\/|\/\/)([^"']+)["'][^>]*>/i;
    const cssMatch = code.match(cssRegex);
    if (cssMatch) {
      const href = cssMatch[1];
      smartHelperMsg.innerHTML = `Unlinked stylesheet: <code class="text-white bg-[#070a10] px-1.5 py-0.5 rounded border border-[#203453]">${href}</code>. In a web sandbox, relative files cannot load unless embedded.`;
      btnHelperActionCss.classList.remove('hidden');
      btnHelperActionCss.style.display = 'inline-flex';
      smartHelperBanner.classList.remove('hidden');
      smartHelperBanner.style.display = 'flex';
      return;
    }

    // 2. Check unembedded local images
    const unembeddedImages: UnembeddedImage[] = findUnembeddedImages(code);
    if (unembeddedImages.length > 0) {
      currentPendingTargetImgSrc = unembeddedImages[0].src;
      smartHelperMsg.innerHTML = `Local image detected: <code class="text-white bg-[#070a10] px-1.5 py-0.5 rounded border border-[#203453]">${currentPendingTargetImgSrc}</code>. Convert it to a Base64 data URI to display it anywhere!`;
      btnHelperActionImg.classList.remove('hidden');
      btnHelperActionImg.style.display = 'inline-flex';
      smartHelperBanner.classList.remove('hidden');
      smartHelperBanner.style.display = 'flex';
      return;
    }

    // 3. Check unlinked Google Fonts
    const unlinkedFonts: UnlinkedFont[] = detectUnlinkedFonts(code);
    if (unlinkedFonts.length > 0) {
      currentPendingFont = unlinkedFonts[0];
      smartHelperMsg.innerHTML = `Google Font <strong class="text-white">${currentPendingFont.fontName}</strong> used in CSS without a linked Google stylesheet.`;
      btnHelperActionFont.classList.remove('hidden');
      btnHelperActionFont.style.display = 'inline-flex';
      smartHelperBanner.classList.remove('hidden');
      smartHelperBanner.style.display = 'flex';
      return;
    }

    // All good
    smartHelperBanner.classList.add('hidden');
    smartHelperBanner.style.display = 'none';
  }

  btnDismissHelper.addEventListener('click', () => {
    smartHelperBanner.classList.add('hidden');
    smartHelperBanner.style.display = 'none';
  });

  // Action: Embed Local CSS
  btnHelperActionCss.addEventListener('click', () => {
    cssFileInput.click();
  });

  cssFileInput.addEventListener('change', async () => {
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
    checkDocumentIntegrity(currentCode);
    showToast(`✦ Inlined stylesheet: ${file.name}`);
  });

  // Action: Embed Local Image
  btnHelperActionImg.addEventListener('click', () => {
    imgFileInput.click();
  });

  imgFileInput.addEventListener('change', async () => {
    const file = imgFileInput.files?.[0];
    if (!file || !currentPendingTargetImgSrc) return;
    try {
      const dataUri = await fileToDataUrl(file);
      const currentCode = codePane.getValue();
      const updatedCode = inlineImageInHtml(currentCode, currentPendingTargetImgSrc, dataUri);
      codePane.setValue(updatedCode);
      previewPane.render(updatedCode);
      coordinator.updateStats();
      fileManager.markDirty(true);
      checkDocumentIntegrity(updatedCode);
      showToast(`✦ Embedded image: ${file.name}`);
    } catch (err) {
      console.error(err);
    }
  });

  // Action: Inject Google Font
  btnHelperActionFont.addEventListener('click', () => {
    if (!currentPendingFont) return;
    const currentCode = codePane.getValue();
    const updatedCode = injectGoogleFont(currentCode, currentPendingFont.fontName, currentPendingFont.query);
    codePane.setValue(updatedCode);
    previewPane.render(updatedCode);
    coordinator.updateStats();
    fileManager.markDirty(true);
    checkDocumentIntegrity(updatedCode);
    showToast(`✦ Injected Google Font: ${currentPendingFont.fontName}`);
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
      showToast('✦ File saved to disk');
    }
  });

  // Open File Button
  document.getElementById('btn-open')?.addEventListener('click', async () => {
    const content = await fileManager.openFile();
    if (content !== null) {
      codePane.setValue(content);
      previewPane.render(content);
      coordinator.updateStats();
      checkDocumentIntegrity(content);
      showToast('✦ File loaded into ScryPad');
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
    checkDocumentIntegrity(STARTER_HTML);
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
    showToast('✦ HTML formatted and aligned');
  });

  // Feature: Copy Clean Body
  document.getElementById('btn-copy-body')?.addEventListener('click', async () => {
    const rawHtml = codePane.getValue();
    const cleanBody = extractCleanBody(rawHtml);
    try {
      await navigator.clipboard.writeText(cleanBody);
      showToast('✦ Body HTML copied to clipboard (ready for CMS/React)!');
    } catch {
      // Fallback prompt
      window.prompt('Copy clean body HTML:', cleanBody);
    }
  });

  // Feature: Theme Simulator (Auto -> Dark -> Light -> Auto)
  btnThemeSim.addEventListener('click', () => {
    const current = previewPane.getThemeSimulation();
    let next: 'auto' | 'dark' | 'light' = 'auto';
    if (current === 'auto') next = 'dark';
    else if (current === 'dark') next = 'light';
    else next = 'auto';

    previewPane.setThemeSimulation(next);
    themeSimLabel.textContent = `Theme: ${next.charAt(0).toUpperCase() + next.slice(1)}`;
    if (next === 'auto') {
      btnBakeTheme.classList.add('hidden');
    } else {
      btnBakeTheme.classList.remove('hidden');
    }
  });

  btnBakeTheme.addEventListener('click', () => {
    previewPane.bakeThemeSimulation();
    previewPane.setThemeSimulation('auto');
    themeSimLabel.textContent = 'Theme: Auto';
    btnBakeTheme.classList.add('hidden');
    showToast('✦ Theme class baked into HTML source');
  });

  // Feature: Visual Style Drawer (CSS Quick-Sliders)
  btnToggleStyles.addEventListener('click', () => {
    styleDrawer.classList.toggle('hidden');
  });

  btnCloseStyleDrawer.addEventListener('click', () => {
    styleDrawer.classList.add('hidden');
  });

  function parsePxValue(valStr: string, defaultNum = 0): number {
    const match = valStr.match(/(-?[\d.]+)px/i);
    return match ? parseFloat(match[1]) : defaultNum;
  }

  function rgbToHex(rgbStr: string): string {
    const match = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return '#ffffff';
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  function populateStyleDrawer(info: ActiveElementInfo) {
    drawerElementTag.textContent = `<${info.tagName}${info.id ? '#' + info.id : ''}${info.className ? '.' + info.className.trim().split(/\s+/)[0] : ''}>`;

    // Font size
    const fontSizeNum = Math.round(parsePxValue(info.styles.fontSize, 16));
    sliderFontSize.value = String(Math.min(64, Math.max(10, fontSizeNum)));
    valFontSize.textContent = `${sliderFontSize.value}px`;

    // Padding
    const paddingNum = Math.round(parsePxValue(info.styles.padding, 16));
    sliderPadding.value = String(Math.min(64, Math.max(0, paddingNum)));
    valPadding.textContent = `${sliderPadding.value}px`;

    // Margin
    const marginNum = Math.round(parsePxValue(info.styles.margin, 0));
    sliderMargin.value = String(Math.min(64, Math.max(0, marginNum)));
    valMargin.textContent = `${sliderMargin.value}px`;

    // Radius
    const radiusNum = Math.round(parsePxValue(info.styles.borderRadius, 0));
    sliderRadius.value = String(Math.min(48, Math.max(0, radiusNum)));
    valRadius.textContent = `${sliderRadius.value}px`;

    // Spacing
    const spacingNum = Math.round(parsePxValue(info.styles.letterSpacing, 0));
    sliderSpacing.value = String(Math.min(10, Math.max(-2, spacingNum)));
    valSpacing.textContent = `${sliderSpacing.value}px`;

    // Opacity
    const opacityNum = Math.round(parseFloat(info.styles.opacity || '1') * 100);
    sliderOpacity.value = String(Math.min(100, Math.max(10, opacityNum)));
    valOpacity.textContent = `${sliderOpacity.value}%`;

    // Colors
    if (info.styles.color) {
      const hex = info.styles.color.startsWith('#') ? info.styles.color : rgbToHex(info.styles.color);
      pickerTextColor.value = hex;
      valTextColor.textContent = hex;
    }
    if (info.styles.backgroundColor && !info.styles.backgroundColor.includes('rgba(0, 0, 0, 0)')) {
      const hex = info.styles.backgroundColor.startsWith('#') ? info.styles.backgroundColor : rgbToHex(info.styles.backgroundColor);
      pickerBgColor.value = hex;
      valBgColor.textContent = hex;
    }
  }

  // Wire Style Drawer Slider Inputs
  sliderFontSize.addEventListener('input', () => {
    valFontSize.textContent = `${sliderFontSize.value}px`;
    previewPane.updateActiveElementStyle('fontSize', `${sliderFontSize.value}px`);
  });

  sliderPadding.addEventListener('input', () => {
    valPadding.textContent = `${sliderPadding.value}px`;
    previewPane.updateActiveElementStyle('padding', `${sliderPadding.value}px`);
  });

  sliderMargin.addEventListener('input', () => {
    valMargin.textContent = `${sliderMargin.value}px`;
    previewPane.updateActiveElementStyle('margin', `${sliderMargin.value}px`);
  });

  sliderRadius.addEventListener('input', () => {
    valRadius.textContent = `${sliderRadius.value}px`;
    previewPane.updateActiveElementStyle('borderRadius', `${sliderRadius.value}px`);
  });

  sliderSpacing.addEventListener('input', () => {
    valSpacing.textContent = `${sliderSpacing.value}px`;
    previewPane.updateActiveElementStyle('letterSpacing', `${sliderSpacing.value}px`);
  });

  sliderOpacity.addEventListener('input', () => {
    valOpacity.textContent = `${sliderOpacity.value}%`;
    const opacityDec = (parseInt(sliderOpacity.value) / 100).toFixed(2);
    previewPane.updateActiveElementStyle('opacity', opacityDec);
  });

  pickerTextColor.addEventListener('input', () => {
    valTextColor.textContent = pickerTextColor.value;
    previewPane.updateActiveElementStyle('color', pickerTextColor.value);
  });

  pickerBgColor.addEventListener('input', () => {
    valBgColor.textContent = pickerBgColor.value;
    previewPane.updateActiveElementStyle('backgroundColor', pickerBgColor.value);
  });

  // Feature: Global Palette Swatches & Replace Modal
  const modalPalette = document.getElementById('modal-palette')!;
  const btnPaletteToggle = document.getElementById('btn-palette-toggle')!;
  const btnClosePalette = document.getElementById('btn-close-palette')!;
  const btnPaletteDone = document.getElementById('btn-palette-done')!;
  const paletteSwatches = document.getElementById('palette-swatches')!;
  const replaceTargetLabel = document.getElementById('replace-target-label')!;
  const replaceNewColorPicker = document.getElementById('replace-new-color-picker') as HTMLInputElement;
  const replaceNewColorText = document.getElementById('replace-new-color-text') as HTMLInputElement;
  const btnReplaceColorAll = document.getElementById('btn-replace-color-all')!;
  const btnCopyColor = document.getElementById('btn-copy-color')!;
  const paletteSummaryCount = document.getElementById('palette-summary-count')!;

  let activeTargetColor: string | null = null;

  function renderPalette() {
    const code = codePane.getValue();
    const swatches: ColorSwatch[] = extractPalette(code);
    paletteSummaryCount.textContent = `${swatches.length} unique colors detected`;

    if (swatches.length === 0) {
      paletteSwatches.innerHTML = `<div class="col-span-full py-6 text-center text-xs text-[#8d9bb6]">No colors detected in document styles.</div>`;
      return;
    }

    paletteSwatches.innerHTML = swatches.map((s) => `
      <button class="swatch-card p-2 bg-[#122036] hover:bg-[#1b2f4f] border ${activeTargetColor === s.color ? 'border-[#5cff9d]' : 'border-[#203453]'} rounded flex items-center gap-2.5 transition text-left" data-color="${s.color}">
        <span class="w-6 h-6 rounded shadow border border-white/20 shrink-0" style="background-color: ${s.color};"></span>
        <div class="flex-1 min-w-0">
          <div class="text-[11px] font-['IBM_Plex_Mono'] text-white font-bold truncate">${s.color}</div>
          <div class="text-[10px] text-[#8d9bb6]">${s.count} ${s.count === 1 ? 'match' : 'matches'}</div>
        </div>
      </button>
    `).join('');

    paletteSwatches.querySelectorAll('.swatch-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        const color = (e.currentTarget as HTMLElement).getAttribute('data-color');
        if (!color) return;
        activeTargetColor = color;
        replaceTargetLabel.textContent = color;
        btnCopyColor.classList.remove('hidden');

        // If hex, set to picker
        if (color.startsWith('#') && (color.length === 7 || color.length === 4)) {
          const hex7 = color.length === 4 
            ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}` 
            : color;
          replaceNewColorPicker.value = hex7;
          replaceNewColorText.value = hex7;
        } else {
          replaceNewColorText.value = color;
        }

        renderPalette();
      });
    });
  }

  btnPaletteToggle.addEventListener('click', () => {
    renderPalette();
    modalPalette.classList.remove('hidden');
  });

  btnClosePalette.addEventListener('click', () => {
    modalPalette.classList.add('hidden');
  });

  btnPaletteDone.addEventListener('click', () => {
    modalPalette.classList.add('hidden');
  });

  modalPalette.addEventListener('click', (e) => {
    if (e.target === modalPalette) modalPalette.classList.add('hidden');
  });

  replaceNewColorPicker.addEventListener('input', () => {
    replaceNewColorText.value = replaceNewColorPicker.value;
  });

  replaceNewColorText.addEventListener('input', () => {
    if (/^#[0-9a-fA-F]{6}$/.test(replaceNewColorText.value)) {
      replaceNewColorPicker.value = replaceNewColorText.value;
    }
  });

  btnCopyColor.addEventListener('click', async () => {
    if (!activeTargetColor) return;
    await navigator.clipboard.writeText(activeTargetColor);
    showToast(`✦ Copied color ${activeTargetColor}`);
  });

  btnReplaceColorAll.addEventListener('click', () => {
    if (!activeTargetColor) {
      alert('Please click a color swatch first to select it.');
      return;
    }
    const newColor = replaceNewColorText.value.trim();
    if (!newColor) return;

    const currentCode = codePane.getValue();
    const updatedCode = replaceColor(currentCode, activeTargetColor, newColor);
    codePane.setValue(updatedCode);
    previewPane.render(updatedCode);
    coordinator.updateStats();
    fileManager.markDirty(true);
    showToast(`✦ Replaced ${activeTargetColor} with ${newColor}`);
    activeTargetColor = newColor;
    replaceTargetLabel.textContent = newColor;
    renderPalette();
  });

  // Responsive Viewports
  const viewportBtns = document.querySelectorAll('.viewport-btn');
  viewportBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      viewportBtns.forEach((b) => {
        b.className = 'viewport-btn px-2 py-0.5 rounded text-[#8d9bb6] hover:bg-[#122036] hover:text-[#e8eef8]';
      });
      btn.className = 'viewport-btn px-2 py-0.5 rounded bg-[#122036] text-[#48e0d2] border border-[#2e4d75]';
      const width = btn.getAttribute('data-width') || '100%';
      previewPane.setViewportWidth(width);
    });
  });

  // View Modes (Split / Code / Preview) & Resizable Gutter
  const codePaneContainer = document.getElementById('code-pane-container')!;
  const previewPaneContainer = document.getElementById('preview-pane-container')!;
  const paneResizer = document.getElementById('pane-resizer')!;
  let splitRatio = 50;
  let isDraggingResizer = false;

  paneResizer.addEventListener('pointerdown', (e) => {
    isDraggingResizer = true;
    paneResizer.setPointerCapture(e.pointerId);
    document.body.classList.add('select-none');
    const previewIframe = previewMount.querySelector('iframe');
    if (previewIframe) previewIframe.style.pointerEvents = 'none';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDraggingResizer) return;
    const workspace = document.getElementById('workspace')!;
    const rect = workspace.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(15, Math.min(85, (x / rect.width) * 100));
    splitRatio = pct;
    codePaneContainer.style.width = `${pct}%`;
    previewPaneContainer.style.width = `${100 - pct}%`;
  });

  const stopResizerDrag = (e: PointerEvent) => {
    if (!isDraggingResizer) return;
    isDraggingResizer = false;
    try { paneResizer.releasePointerCapture(e.pointerId); } catch {}
    document.body.classList.remove('select-none');
    const previewIframe = previewMount.querySelector('iframe');
    if (previewIframe) previewIframe.style.pointerEvents = 'auto';
  };

  window.addEventListener('pointerup', stopResizerDrag);
  window.addEventListener('pointercancel', stopResizerDrag);

  // Double click resets to 50/50
  paneResizer.addEventListener('dblclick', () => {
    splitRatio = 50;
    codePaneContainer.style.width = '50%';
    previewPaneContainer.style.width = '50%';
    showToast('✦ Split layout reset to 50 / 50');
  });

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
      codePaneContainer.style.width = `${splitRatio}%`;
      previewPaneContainer.style.display = 'flex';
      previewPaneContainer.style.width = `${100 - splitRatio}%`;
      paneResizer.style.display = 'flex';
    } else if (mode === 'code') {
      codePaneContainer.style.display = 'flex';
      codePaneContainer.style.width = '100%';
      previewPaneContainer.style.display = 'none';
      paneResizer.style.display = 'none';
    } else {
      codePaneContainer.style.display = 'none';
      previewPaneContainer.style.display = 'flex';
      previewPaneContainer.style.width = '100%';
      paneResizer.style.display = 'none';
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

        showToast(`✦ Injected library: ${lib.name}`);
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

  // Run initial integrity check
  checkDocumentIntegrity(STARTER_HTML);
});
