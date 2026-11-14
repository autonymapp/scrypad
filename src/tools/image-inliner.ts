/**
 * Detects local/relative image references (<img src="...">) and provides inlining with Base64 data URIs.
 */

export interface UnembeddedImage {
  src: string;
  tag: string;
  count: number;
}

export function findUnembeddedImages(html: string): UnembeddedImage[] {
  const images: UnembeddedImage[] = [];
  const imgRegex = /<img[^>]+src=["'](?!https?:\/\/|\/\/|data:|blob:)([^"']+)["'][^>]*>/gi;

  const foundMap = new Map<string, { tag: string; count: number }>();
  let match: RegExpExecArray | null;

  while ((match = imgRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const src = match[1];
    
    if (src.startsWith('#') || src.trim() === '') continue;

    const existing = foundMap.get(src);
    if (existing) {
      existing.count += 1;
    } else {
      foundMap.set(src, { tag: fullTag, count: 1 });
    }
  }

  foundMap.forEach((val, src) => {
    images.push({
      src,
      tag: val.tag,
      count: val.count
    });
  });

  return images;
}

export function inlineImageInHtml(html: string, targetSrc: string, base64DataUri: string): string {
  if (!targetSrc || !base64DataUri) return html;

  // Escape targetSrc for regex
  const escaped = targetSrc.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  // Match src="targetSrc" or src='targetSrc'
  const regex = new RegExp(`(src=["'])${escaped}(["'])`, 'g');
  return html.replace(regex, `$1${base64DataUri}$2`);
}

/**
 * Converts a browser File to base64 Data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to Data URL.'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
