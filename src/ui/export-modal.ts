// Export & Publish: one pop-up with three tabs (GitHub Pages, Site Zip, One HTML File).
import { createElement, Globe, FolderArchive, FileCode, Eye, Check, X, LoaderCircle, ExternalLink } from 'lucide';
import type { FileManager } from '../files/file-manager.ts';
import { collectSite, makeZip, bundleOneFile, saveBytes } from '../tools/site-export.ts';
import { publishToPages, savedToken, rememberToken, lastRepo, cleanRepoName, GitHubError } from '../tools/github-publish.ts';
import { confirmDialog } from './dialog.ts';

export type ExportTab = 'github' | 'zip' | 'single';

interface ExportDeps {
  fileManager: FileManager;
  getCode: () => string;
  showToast: (msg: string) => void;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const icon = (node: Parameters<typeof createElement>[0]) => createElement(node).outerHTML;
const size = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`);

let openNow = false;
export function isExportOpen(): boolean { return openNow; }

export async function openExportModal(deps: ExportDeps, tab: ExportTab = 'github'): Promise<void> {
  if (openNow) return;
  openNow = true;
  const prevFocus = document.activeElement as HTMLElement | null;
  const site = await collectSite(deps.fileManager, deps.getCode());
  const totalBytes = site.entries.reduce((n, e) => n + e.data.length, 0);
  const isFolder = !!deps.fileManager.getProject();

  const backdrop = document.createElement('div');
  backdrop.className = 'sp-dialog-backdrop';
  const box = document.createElement('div');
  box.className = 'sp-dialog wide sp-export';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', 'sp-export-title');
  box.innerHTML = `
    <div class="ex-head">
      <h2 id="sp-export-title">Export &amp; Publish</h2>
      <button class="ex-close" aria-label="Close">${icon(X)}</button>
    </div>
    <div class="ex-tabs" role="tablist">
      <button role="tab" data-tab="github">${icon(Globe)}<span>GitHub Pages</span></button>
      <button role="tab" data-tab="zip">${icon(FolderArchive)}<span>Site Zip</span></button>
      <button role="tab" data-tab="single">${icon(FileCode)}<span>One HTML File</span></button>
    </div>

    <section class="ex-panel" data-panel="github">
      <p class="ex-lead">Put your site online for free. ScryPad makes the repository, uploads your files and turns on GitHub Pages.</p>
      <div class="sp-field">
        <label for="ex-token">GitHub Token</label>
        <div class="sp-field-row">
          <input id="ex-token" type="password" autocomplete="off" spellcheck="false" placeholder="ghp_… or github_pat_…" value="${esc(savedToken())}">
          <button class="btn-hud btn-hud-ghost ex-eye" type="button" title="Show or hide the token" aria-label="Show or hide the token">${icon(Eye)}</button>
        </div>
        <small><a href="https://github.com/settings/tokens/new?scopes=repo&amp;description=ScryPad" target="_blank" rel="noopener">Make a token on GitHub</a> (the repo box is already ticked). It's only sent to GitHub.</small>
      </div>
      <div class="ex-row">
        <label class="ex-check"><input type="checkbox" id="ex-remember" ${savedToken() ? 'checked' : ''}> Remember on this device</label>
        <button type="button" class="blank-link ex-forget ${savedToken() ? '' : 'hidden'}">Forget Saved Token</button>
      </div>
      <div class="sp-field">
        <label for="ex-repo">Repository Name</label>
        <input id="ex-repo" type="text" spellcheck="false" value="${esc(lastRepo() || site.name)}">
        <small>Your site will live at yourname.github.io/this-name. New or existing both work.</small>
      </div>
      <button class="btn-hud btn-hud-primary ex-go" data-go="github">${icon(Globe)}<span>Publish</span></button>
      <div class="ex-log hidden" aria-live="polite"></div>
      <div class="ex-done hidden"></div>
    </section>

    <section class="ex-panel" data-panel="zip">
      <p class="ex-lead">Your whole site in one zip, ready for Neocities, Nekoweb or any host.</p>
      <div class="ex-stats">
        <div><b>${site.entries.length}</b><span>${site.entries.length === 1 ? 'File' : 'Files'}</span></div>
        <div><b>${size(totalBytes)}</b><span>Size</span></div>
        <div><b>${site.hasIndex ? 'Yes' : 'No'}</b><span>Has index.html</span></div>
      </div>
      ${site.hasIndex ? '' : '<p class="ex-warn">Hosts show <code>index.html</code> as your front page, so rename your main page to that before uploading.</p>'}
      ${isFolder ? '' : '<p class="ex-note">Using a stylesheet or pictures from other files? Open the whole folder first (File › Open Folder) so they come along.</p>'}
      <p class="ex-note"><b>To upload:</b> unzip it, then drag everything into your Neocities dashboard or Nekoweb file manager.</p>
      <button class="btn-hud btn-hud-primary ex-go" data-go="zip">${icon(FolderArchive)}<span>Download Zip</span></button>
    </section>

    <section class="ex-panel" data-panel="single">
      <p class="ex-lead">One page with its styles, scripts and pictures tucked inside. Open it anywhere or share it as a single file.</p>
      <div class="ex-actions">
        <button class="btn-hud btn-hud-primary ex-go" data-go="single">${icon(FileCode)}<span>Download</span></button>
        <button class="btn-hud btn-hud-ghost ex-go" data-go="copy"><span>Copy HTML</span></button>
      </div>
      <div class="ex-done ex-single-note hidden"></div>
    </section>
  `;
  backdrop.appendChild(box);
  document.body.appendChild(backdrop);

  const $ = <T extends HTMLElement>(sel: string) => box.querySelector(sel) as T;
  const tokenInput = $<HTMLInputElement>('#ex-token');
  const repoInput = $<HTMLInputElement>('#ex-repo');
  const remember = $<HTMLInputElement>('#ex-remember');

  const show = (t: ExportTab) => {
    tab = t;
    box.querySelectorAll<HTMLElement>('[data-tab]').forEach((b) => {
      const on = b.dataset.tab === t;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', String(on));
    });
    box.querySelectorAll<HTMLElement>('[data-panel]').forEach((p) => p.classList.toggle('hidden', p.dataset.panel !== t));
    if (t === 'github') (tokenInput.value ? repoInput : tokenInput).focus();
    else box.querySelector<HTMLElement>(`[data-panel="${t}"] .ex-go`)?.focus();
  };
  box.querySelectorAll<HTMLElement>('[data-tab]').forEach((b) => b.addEventListener('click', () => show(b.dataset.tab as ExportTab)));

  const close = () => {
    document.removeEventListener('keydown', onKey, true);
    backdrop.remove();
    openNow = false;
    prevFocus?.focus?.();
  };
  $('.ex-close').addEventListener('click', close);
  backdrop.addEventListener('mousedown', (e) => { if (e.target === backdrop) close(); });
  function onKey(e: KeyboardEvent) {
    if (document.querySelector('.sp-dialog-backdrop:last-child') !== backdrop) return; // a question is open on top
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === 'Tab') {
      const items = Array.from(box.querySelectorAll<HTMLElement>('button, input, a[href]')).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  document.addEventListener('keydown', onKey, true);

  $('.ex-eye').addEventListener('click', () => { tokenInput.type = tokenInput.type === 'password' ? 'text' : 'password'; });
  $('.ex-forget').addEventListener('click', () => {
    rememberToken(null);
    tokenInput.value = '';
    remember.checked = false;
    $('.ex-forget').classList.add('hidden');
    deps.showToast('✦ Saved token forgotten');
  });

  // --- GitHub ---
  const log = $('.ex-log');
  const done = $<HTMLElement>('[data-panel="github"] .ex-done');
  const addStep = (msg: string, state: 'run' | 'ok' | 'err') => {
    log.querySelector('.ex-step.run')?.classList.replace('run', 'ok');
    log.querySelectorAll('.ex-step.ok svg').forEach((s) => s.replaceWith(createElement(Check)));
    const row = document.createElement('div');
    row.className = `ex-step ${state}`;
    row.append(createElement(state === 'err' ? X : state === 'ok' ? Check : LoaderCircle));
    const span = document.createElement('span');
    span.textContent = msg;
    row.appendChild(span);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  };
  const publish = async (btn: HTMLButtonElement) => {
    const token = tokenInput.value.trim();
    if (!token) { tokenInput.focus(); deps.showToast('✦ Paste your GitHub token first'); return; }
    rememberToken(remember.checked ? token : null);
    $('.ex-forget').classList.toggle('hidden', !remember.checked);
    btn.disabled = true;
    log.innerHTML = '';
    log.classList.remove('hidden');
    done.classList.add('hidden');
    try {
      const res = await publishToPages(token, cleanRepoName(repoInput.value), site.entries,
        (msg) => addStep(msg, 'run'),
        (full) => confirmDialog('Update This Repository?', `<p><b>${esc(full)}</b> already exists. Publishing adds your files and replaces ones with the same name.</p>`, 'Update It', 'Cancel'));
      if (!res) { log.classList.add('hidden'); return; }
      addStep(res.created ? 'Published!' : 'Updated!', 'ok');
      done.innerHTML = `<b>${res.created ? 'Your site is published!' : 'Your site is updated!'}</b> GitHub takes about a minute to put it online.
        <a class="ex-live" href="${esc(res.siteUrl)}" target="_blank" rel="noopener"><span>${esc(res.siteUrl)}</span>${icon(ExternalLink)}</a>
        <a href="${esc(res.repoUrl)}" target="_blank" rel="noopener">See the repository</a>`;
      done.classList.remove('hidden');
      deps.showToast('✦ Published to GitHub Pages!');
    } catch (e) {
      const msg = e instanceof GitHubError ? e.message : 'Something went wrong while publishing.';
      addStep(msg, 'err');
      if (e instanceof GitHubError && (e.status === 401 || e.status === 403)) addStep('Check that the token has the repo permission and hasn\'t expired.', 'err');
    } finally {
      btn.disabled = false;
    }
  };

  // --- Buttons ---
  box.querySelectorAll<HTMLButtonElement>('.ex-go').forEach((btn) => btn.addEventListener('click', async () => {
    const go = btn.dataset.go;
    if (go === 'github') return publish(btn);
    if (go === 'zip') {
      if (await saveBytes(`${site.name}.zip`, makeZip(site.entries), 'zip')) deps.showToast(`✦ Saved ${site.name}.zip`);
      return;
    }
    const { html, missing } = await bundleOneFile(deps.fileManager, deps.getCode());
    const note = $<HTMLElement>('.ex-single-note');
    note.classList.toggle('hidden', !missing.length);
    if (missing.length) note.innerHTML = `ScryPad couldn't find ${missing.length === 1 ? 'this file' : 'these files'}, so ${missing.length === 1 ? 'it stays' : 'they stay'} as a link: ${missing.slice(0, 8).map((m) => `<code>${esc(m)}</code>`).join(' ')}. Open the whole folder so ScryPad can tuck ${missing.length === 1 ? 'it' : 'them'} in.`;
    if (go === 'copy') {
      try { await navigator.clipboard.writeText(html); deps.showToast('✦ HTML copied'); }
      catch { deps.showToast('✦ Your browser blocked copying. Try Download instead'); }
      return;
    }
    const name = (deps.fileManager.getFilename() || 'index.html').replace(/\.html?$/i, '') + '-one-file.html';
    if (await saveBytes(name, new TextEncoder().encode(html), 'html')) deps.showToast(`✦ Saved ${name}`);
  }));

  show(tab);
}
