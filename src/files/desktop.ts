// Desktop app (Tauri) file access. The web version never calls these.

export interface DesktopFile {
  path: string;
  name: string;
  content: string;
}

function core(): { invoke: (cmd: string, args?: Record<string, unknown>) => Promise<any> } | null {
  const t = (window as any).__TAURI__;
  return t && t.core && typeof t.core.invoke === 'function' ? t.core : null;
}

export function isDesktop(): boolean {
  return core() !== null;
}

/** Shows the Open dialog. Resolves null if the person cancels. */
export async function desktopOpen(): Promise<DesktopFile | null> {
  return (await core()!.invoke('open_file')) ?? null;
}

/** Writes to a known path. */
export async function desktopWrite(path: string, content: string): Promise<void> {
  await core()!.invoke('write_file', { path, content });
}

/** Shows the Save As dialog and writes. Resolves the new path and name, or null if cancelled. */
export async function desktopSaveAs(suggestedName: string, content: string): Promise<{ path: string; name: string } | null> {
  return (await core()!.invoke('save_file_as', { suggestedName, content })) ?? null;
}

/** Reads a file by its path (File › Recent). */
export async function desktopReadPath(path: string): Promise<DesktopFile> {
  return await core()!.invoke('read_path', { path });
}

/** The .html file ScryPad was opened with (double-click in Explorer), if any. */
export async function desktopLaunchFile(): Promise<DesktopFile | null> {
  const c = core();
  if (!c) return null;
  try {
    return (await c.invoke('launch_file')) ?? null;
  } catch {
    return null;
  }
}
