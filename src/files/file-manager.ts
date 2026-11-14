export interface FileState {
  handle: FileSystemFileHandle | null;
  name: string;
  isDirty: boolean;
}

export class FileManager {
  private state: FileState = {
    handle: null,
    name: 'untitled.html',
    isDirty: false
  };

  private onStateChangeCallbacks: Array<(state: FileState) => void> = [];

  constructor() {}

  public subscribe(cb: (state: FileState) => void) {
    this.onStateChangeCallbacks.push(cb);
    cb(this.state);
  }

  private notify() {
    this.onStateChangeCallbacks.forEach(cb => cb({ ...this.state }));
  }

  public markDirty(dirty: boolean = true) {
    if (this.state.isDirty !== dirty) {
      this.state.isDirty = dirty;
      this.notify();
    }
  }

  public getFilename(): string {
    return this.state.name;
  }

  public isDirty(): boolean {
    return this.state.isDirty;
  }

  public setUntitled() {
    this.state = {
      handle: null,
      name: 'untitled.html',
      isDirty: false
    };
    this.notify();
  }

  /**
   * Open file using File System Access API or fallback
   */
  public async openFile(): Promise<string | null> {
    if ('showOpenFilePicker' in window) {
      try {
        const [handle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: 'HTML Files',
              accept: { 'text/html': ['.html', '.htm'] }
            }
          ],
          multiple: false
        });
        const file = await handle.getFile();
        const content = await file.text();
        this.state = {
          handle,
          name: file.name,
          isDirty: false
        };
        this.notify();
        return content;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error opening file via File System Access:', err);
        }
        return null;
      }
    } else {
      return new Promise<string | null>((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.html,.htm';
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) {
            resolve(null);
            return;
          }
          const content = await file.text();
          this.state = {
            handle: null,
            name: file.name,
            isDirty: false
          };
          this.notify();
          resolve(content);
        };
        input.click();
      });
    }
  }

  /**
   * Save file using existing handle or prompt Save As
   */
  public async saveFile(content: string, forceSaveAs: boolean = false): Promise<boolean> {
    if ('showSaveFilePicker' in window) {
      try {
        let handle = this.state.handle;
        if (!handle || forceSaveAs) {
          handle = await (window as any).showSaveFilePicker({
            suggestedName: this.state.name || 'index.html',
            types: [
              {
                description: 'HTML File',
                accept: { 'text/html': ['.html'] }
              }
            ]
          });
        }
        if (!handle) return false;

        const writable = await (handle as any).createWritable();
        await writable.write(content);
        await writable.close();

        this.state = {
          handle,
          name: handle.name,
          isDirty: false
        };
        this.notify();
        return true;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Save failed via File System Access:', err);
        }
        return false;
      }
    } else {
      // Fallback: Download blob
      const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.state.name || 'index.html';
      a.click();
      URL.revokeObjectURL(url);
      this.state.isDirty = false;
      this.notify();
      return true;
    }
  }
}
