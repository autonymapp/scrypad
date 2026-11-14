export interface PreviewOptions {
  container: HTMLElement;
  onVisualDocChange: (newHtml: string) => void;
  onSelectElement: (domPath: string) => void;
}

export class PreviewPane {
  private iframe: HTMLIFrameElement;
  private visualEditMode: boolean = true;
  private onVisualDocChange: (newHtml: string) => void;
  private onSelectElement: (domPath: string) => void;
  private isWritingToIframe: boolean = false;

  constructor(options: PreviewOptions) {
    this.onVisualDocChange = options.onVisualDocChange;
    this.onSelectElement = options.onSelectElement;

    this.iframe = document.createElement('iframe');
    this.iframe.className = "w-full h-full bg-white rounded shadow-2xl border border-slate-800 transition-all duration-150";
    this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-modals');
    options.container.appendChild(this.iframe);
  }

  public setVisualEditMode(enabled: boolean) {
    this.visualEditMode = enabled;
    const doc = this.getDoc();
    if (doc && doc.body) {
      doc.body.contentEditable = enabled ? "true" : "false";
    }
  }

  public isVisualEditActive(): boolean {
    return this.visualEditMode;
  }

  public setViewportWidth(width: string) {
    this.iframe.style.width = width;
  }

  public render(html: string) {
    this.isWritingToIframe = true;
    const doc = this.getDoc();
    if (!doc) return;

    doc.open();
    doc.write(html);
    doc.close();

    this.attachIframeEvents(doc);
    this.isWritingToIframe = false;
  }

  public applyStyleCommand(command: string, value: string | null = null) {
    const win = this.iframe.contentWindow;
    if (win) {
      win.document.execCommand(command, false, value as any);
    }
  }

  private getDoc(): Document | null {
    try {
      return this.iframe.contentDocument || this.iframe.contentWindow?.document || null;
    } catch {
      return null;
    }
  }

  private attachIframeEvents(doc: Document) {
    if (!doc.body) return;

    // Apply current visual edit mode
    doc.body.contentEditable = this.visualEditMode ? "true" : "false";

    // Track selection changes for breadcrumbs
    doc.addEventListener('selectionchange', () => {
      const win = this.iframe.contentWindow;
      const sel = win?.getSelection();
      if (sel && sel.anchorNode) {
        const el = sel.anchorNode.nodeType === Node.TEXT_NODE
          ? sel.anchorNode.parentElement
          : (sel.anchorNode as HTMLElement);
        if (el) {
          const path = this.computeDomPath(el);
          this.onSelectElement(path);
        }
      }
    });

    // Track mouse hover for subtle DOM breadcrumbs when moving around
    doc.addEventListener('mousemove', (e) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName) {
        // Only update if no active text selection
        const sel = this.iframe.contentWindow?.getSelection();
        if (!sel || sel.isCollapsed) {
          this.onSelectElement(this.computeDomPath(target));
        }
      }
    });

    // Listen to direct text typing / mutations inside the iframe
    doc.body.addEventListener('input', () => {
      if (this.isWritingToIframe) return;
      const docType = doc.doctype ? `<!DOCTYPE ${doc.doctype.name}>\n` : '<!DOCTYPE html>\n';
      const serialized = docType + doc.documentElement.outerHTML;
      this.onVisualDocChange(serialized);
    });
  }

  private computeDomPath(el: HTMLElement): string {
    const path: string[] = [];
    let curr: HTMLElement | null = el;
    while (curr && curr.tagName && curr.tagName.toUpperCase() !== 'HTML') {
      let segment = curr.tagName.toLowerCase();
      if (curr.id) {
        segment += `#${curr.id}`;
      } else if (curr.className && typeof curr.className === 'string') {
        const first = curr.className.trim().split(/\s+/)[0];
        if (first && !first.includes(':') && !first.includes('[')) {
          segment += `.${first}`;
        }
      }
      path.unshift(segment);
      curr = curr.parentElement;
    }
    return path.join(' > ') || 'body';
  }
}
