import { CodePane } from '../editor/code-pane.ts';
import { PreviewPane } from '../preview/preview-pane.ts';
import { FileManager } from '../files/file-manager.ts';

export class SyncCoordinator {
  private codePane: CodePane;
  private previewPane: PreviewPane;
  private fileManager: FileManager;

  private isCodeUpdating: boolean = false;
  private isVisualUpdating: boolean = false;
  private debounceTimer: number | null = null;

  // Status elements
  private elDomPath: HTMLElement | null = null;
  private elFileSize: HTMLElement | null = null;
  private elLineCount: HTMLElement | null = null;
  private elSyncStatus: HTMLElement | null = null;

  constructor(codePane: CodePane, previewPane: PreviewPane, fileManager: FileManager) {
    this.codePane = codePane;
    this.previewPane = previewPane;
    this.fileManager = fileManager;

    this.elDomPath = document.getElementById('status-tagpath');
    this.elFileSize = document.getElementById('status-filesize');
    this.elLineCount = document.getElementById('status-lines');
    this.elSyncStatus = document.getElementById('status-sync');

    this.updateStats();
  }

  public handleCodeChange(newCode: string) {
    if (this.isVisualUpdating) return;

    this.isCodeUpdating = true;
    this.fileManager.markDirty(true);
    this.setSyncing(true);

    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(async () => {
      const resolved = await this.fileManager.resolvePreview(newCode);
      this.previewPane.render(resolved);
      this.updateStats();
      this.setSyncing(false);
      this.isCodeUpdating = false;
    }, 120);
  }

  public handleVisualChange(newHtml: string) {
    if (this.isCodeUpdating) return;

    this.isVisualUpdating = true;
    this.fileManager.markDirty(true);
    this.setSyncing(true);

    this.codePane.setValue(newHtml);
    this.updateStats();

    setTimeout(() => {
      this.setSyncing(false);
      this.isVisualUpdating = false;
    }, 50);
  }

  public handleDomPathSelect(path: string) {
    if (this.elDomPath) {
      this.elDomPath.textContent = path;
    }
  }

  public updateStats() {
    const code = this.codePane.getValue();
    const bytes = new Blob([code]).size;
    const formattedBytes = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

    if (this.elFileSize) {
      this.elFileSize.textContent = formattedBytes;
    }
    if (this.elLineCount) {
      this.elLineCount.textContent = `Lines: ${this.codePane.getLineCount()}`;
    }
  }

  private setSyncing(syncing: boolean) {
    if (!this.elSyncStatus) return;
    if (syncing) {
      this.elSyncStatus.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5 animate-ping"></span>Updating';
      this.elSyncStatus.className = 'text-amber-400 text-xs font-mono flex items-center';
    } else {
      this.elSyncStatus.innerHTML = '<span class="inline-block w-2 h-2 rounded-full bg-[var(--forge-hi)] mr-1.5"></span>Live Preview On';
      this.elSyncStatus.className = 'text-[var(--forge-hi)] text-xs font-mono flex items-center';
    }
  }
}
