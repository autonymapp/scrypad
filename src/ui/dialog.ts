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
  /** Text boxes to fill in. Their values are written back into each field when the dialog closes. */
  fields?: DialogField[];
}

export interface DialogField {
  label: string;
  value: string;
  placeholder?: string;
  hint?: string;
  /** A tick box instead of a text box: value is 'yes' or 'no' */
  check?: boolean;
  /** Adds a button beside the box; returns what to put in it (shown as `display`) */
  browse?: { label: string; pick: () => Promise<{ value: string; display: string } | null> };
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

    const inputs: { input: HTMLInputElement; field: DialogField; real?: { value: string; display: string } }[] = [];
    (opts.fields || []).forEach((field, n) => {
      if (field.check) {
        const wrap = document.createElement('div');
        wrap.className = 'sp-field sp-check';
        const lab = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = field.value === 'yes';
        lab.append(input, document.createTextNode(field.label));
        wrap.appendChild(lab);
        body.appendChild(wrap);
        inputs.push({ input, field });
        return;
      }
      const wrap = document.createElement('div');
      wrap.className = 'sp-field';
      const lab = document.createElement('label');
      lab.textContent = field.label;
      lab.htmlFor = `sp-field-${n}`;
      const row = document.createElement('div');
      row.className = 'sp-field-row';
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `sp-field-${n}`;
      input.value = field.value;
      input.spellcheck = false;
      if (field.placeholder) input.placeholder = field.placeholder;
      const entry: (typeof inputs)[number] = { input, field };
      // A long embedded picture (data: address) is shown by its short name instead
      if (field.value.startsWith('data:')) { entry.real = { value: field.value, display: 'Embedded picture' }; input.value = entry.real.display; }
      row.appendChild(input);
      if (field.browse) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn-hud btn-hud-ghost';
        b.textContent = field.browse.label;
        b.addEventListener('click', async () => {
          const got = await field.browse!.pick();
          if (got) { entry.real = got; input.value = got.display; }
        });
        row.appendChild(b);
      }
      wrap.append(lab, row);
      if (field.hint) {
        const h2 = document.createElement('small');
        h2.textContent = field.hint;
        wrap.appendChild(h2);
      }
      body.appendChild(wrap);
      inputs.push(entry);
    });

    const actions = document.createElement('div');
    actions.className = 'sp-actions';
    const list = opts.actions && opts.actions.length ? opts.actions : [{ label: 'Close', value: 'close', primary: true }];

    const finish = (value: string) => {
      inputs.forEach((e) => {
        if (e.field.check) { e.field.value = e.input.checked ? 'yes' : 'no'; return; }
        e.field.value = e.real && e.input.value === e.real.display ? e.real.value : e.input.value;
      });
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
      } else if (e.key === 'Enter' && inputs.length && (e.target as HTMLElement)?.tagName === 'INPUT') {
        e.preventDefault();
        const p = list.find((a) => a.primary);
        if (p) finish(p.value);
      } else if (e.key === 'Tab') {
        // keep focus inside the dialog
        const f = Array.from(box.querySelectorAll<HTMLElement>('input, button, textarea, a[href]'));
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
    else if (inputs.length) { inputs[0].input.focus(); if (!inputs[0].field.check) inputs[0].input.select(); }
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
