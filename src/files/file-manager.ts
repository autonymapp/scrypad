import { ProjectFolder } from './project-folder.ts';

export interface FileState {
  handle: FileSystemFileHandle | null;
  name: string;
  isDirty: boolean;
  projectPath: string | null;
  projectName: string | null;
}

export class FileManager {
  private state: FileState = {
    handle: null,
    name: 'untitled.html',
    isDirty: false,
    projectPath: null,
    projectName: null
  };

  private currentProject: ProjectFolder | null = null;
  private onStateChangeCallbacks: Array<(state: FileState) => void> = [];
  private onProjectChangeCallbacks: Array<(project: ProjectFolder | null) => void> = [];

  constructor() {}

  public subscribe(cb: (state: FileState) => void) {
    this.onStateChangeCallbacks.push(cb);
    cb(this.state);
  }

  public subscribeProject(cb: (project: ProjectFolder | null) => void) {
    this.onProjectChangeCallbacks.push(cb);
    cb(this.currentProject);
  }

  private notify() {
    this.onStateChangeCallbacks.forEach(cb => cb({ ...this.state }));
  }

  private notifyProject() {
    this.onProjectChangeCallbacks.forEach(cb => cb(this.currentProject));
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

  public getProject(): ProjectFolder | null {
    return this.currentProject;
  }

  public setUntitled() {
    this.state = {
      handle: null,
      name: 'untitled.html',
      isDirty: false,
      projectPath: null,
      projectName: this.currentProject ? this.currentProject.name : null
    };
    this.notify();
  }

  /**
   * Open directory / folder
   */
  public async openDirectory(): Promise<ProjectFolder | null> {
    if ('showDirectoryPicker' in window) {
      try {
        const dirHandle = await (window as any).showDirectoryPicker({
          mode: 'readwrite'
        });
        const project = await ProjectFolder.fromDirectoryHandle(dirHandle);
        this.currentProject?.dispose();
        this.currentProject = project;
        this.notifyProject();
        return project;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error opening directory:', err);
        }
        return null;
      }
    }
    return null;
  }

  public setProjectFromFiles(fileList: FileList): ProjectFolder | null {
    if (!fileList || fileList.length === 0) return null;
    ProjectFolder.fromFileList(fileList).then(project => {
      this.currentProject?.dispose();
      this.currentProject = project;
      this.notifyProject();
    });
    return null;
  }

  /**
   * Switch active file inside current project
   */
  public async openProjectFile(relativePath: string): Promise<string | null> {
    if (!this.currentProject) return null;
    const content = await this.currentProject.readFile(relativePath);
    if (content !== null) {
      const entry = this.currentProject.files.get(relativePath);
      this.state = {
        handle: entry?.handle || null,
        name: entry?.name || relativePath,
        isDirty: false,
        projectPath: relativePath,
        projectName: this.currentProject.name
      };
      this.notify();
      return content;
    }
    return null;
  }

  /**
   * Open single file using File System Access API or fallback
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
          isDirty: false,
          projectPath: null,
          projectName: this.currentProject ? this.currentProject.name : null
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
            isDirty: false,
            projectPath: null,
            projectName: this.currentProject ? this.currentProject.name : null
          };
          this.notify();
          resolve(content);
        };
        input.click();
      });
    }
  }

  /**
   * Save file using project handle, existing handle or prompt Save As
   */
  public async saveFile(content: string, forceSaveAs: boolean = false): Promise<boolean> {
    // If currently editing a project file, write directly to project
    if (this.currentProject && this.state.projectPath && !forceSaveAs) {
      const ok = await this.currentProject.saveFile(this.state.projectPath, content);
      if (ok) {
        this.markDirty(false);
        return true;
      }
    }

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
          isDirty: false,
          projectPath: this.state.projectPath,
          projectName: this.state.projectName
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
      this.markDirty(false);
      return true;
    }
  }

  public async resolvePreview(html: string): Promise<string> {
    if (this.currentProject) {
      return await this.currentProject.resolvePreviewAssets(html, this.state.projectPath || '');
    }
    return html;
  }
}
