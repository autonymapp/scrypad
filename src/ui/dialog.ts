// ScryPad's own dialogs, in place of the browser's grey confirm / alert / prompt boxes.

export interface DialogAction {
  label: string;
  value: string;
  primary?: boolean;
}

export interface DialogOptions {
  title: string;
  /** Trusted HTML written by ScryPad itself (never user content). */
  bodyHtml?: string;
  actions?: DialogAction[];
  wide?: boolean;
  /** Text shown in a read-only box with a Copy button (for copy fallbacks). */
  copyText?: string;
}

let open = false;

export function showDialog(opts: DialogOptions): Promise<string> {
  return new Promise((resolve) => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const backdrop = document.createElement('div');
    backdrop.className = 'sp-dialog-backdrop';
    const box = document.createElement('div');
    box.className = 'sp-dialog' + (opts.wide ? ' wide' : '');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');

    const h = document.createElement('h2');
    h.id = 'sp-dialog-title';
    h.textContent = opts.title;
    box.setAttribute('aria-labelledby', h.id);
    box.appendChild(h);

    const body = document.createElement('div');
    body.className = 'sp-body';
    if (opts.bodyHtml) body.innerHTML = opts.bodyHtml;
    box.appendChild(body);

    let area: HTMLTextAreaElement | null = null;
    if (opts.copyText !== undefined) {
      area = document.createElement('textarea');
      area.readOnly = true;
      area.value = opts.copyText;
      area.setAttribute('aria-label', opts.title);
      body.appendChild(area);
    }

    const actions = document.createElement('div');
    actions.className = 'sp-actions';
    const list = opts.actions && opts.actions.length ? opts.actions : [{ label: 'Close', value: 'close', primary: true }];

    const finish = (value: string) => {
      document.removeEventListener('keydown', onKey, true);
      backdrop.remove();
      open = false;
      prevFocus?.focus?.();
      resolve(value);
    };

    if (area) {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn-hud btn-hud-ghost';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', async () => {
        area!.select();
        try {
          await navigator.clipboard.writeText(area!.value);
          copyBtn.textContent = 'Copied!';
        } catch {
          // Clipboard blocked: the text is selected, so Ctrl+C works
          copyBtn.textContent = 'Press Ctrl+C';
        }
      });
      actions.appendChild(copyBtn);
    }

    let primaryBtn: HTMLButtonElement | null = null;
    list.forEach((a) => {
      const b = document.createElement('button');
      b.className = 'btn-hud ' + (a.primary ? 'btn-hud-primary' : 'btn-hud-ghost');
      b.textContent = a.label;
      b.addEventListener('click', () => finish(a.value));
      if (a.primary) primaryBtn = b;
      actions.appendChild(b);
    });
    box.appendChild(actions);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        finish('cancel');
      } else if (e.key === 'Tab') {
        // keep focus inside the dialog
        const f = Array.from(box.querySelectorAll<HTMLElement>('button, textarea, a[href]'));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);
    backdrop.addEventListener('mousedown', (e) => { if (e.target === backdrop) finish('cancel'); });

    backdrop.appendChild(box);
    document.body.appendChild(backdrop);
    open = true;
    if (area) { area.focus(); area.select(); }
    else (primaryBtn ?? actions.querySelector('button'))?.focus();
  });
}

export function isDialogOpen(): boolean {
  return open;
}

/** Yes / no question. Resolves true when the primary choice is picked. */
export async function confirmDialog(title: string, bodyHtml: string, okLabel: string, cancelLabel = 'Cancel'): Promise<boolean> {
  const v = await showDialog({
    title,
    bodyHtml,
    actions: [
      { label: cancelLabel, value: 'cancel' },
      { label: okLabel, value: 'ok', primary: true },
    ],
  });
  return v === 'ok';
}

/** Copy to the clipboard; if the browser blocks it, show the text so it can be copied by hand. */
export async function copyOrShow(text: string, title: string, onCopied: () => void): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    onCopied();
  } catch {
    await showDialog({ title, bodyHtml: '<p>Your browser blocked copying. Select the text below and press Ctrl+C.</p>', copyText: text, wide: true });
  }
}
