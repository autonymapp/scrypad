/**
 * Scans HTML source for color literals (Hex, RGB, RGBA, HSL, HSLA) and provides replace utilities.
 */

export interface ColorSwatch {
  color: string;
  normalized: string;
  count: number;
}

export function extractPalette(html: string): ColorSwatch[] {
  const colorMap = new Map<string, { original: string; count: number }>();

  // Regex patterns for hex, rgb, rgba, hsl, hsla
  // Hex: #333, #333333, #333333aa
  const hexRegex = /#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
  // RGB/RGBA: rgb(0, 0, 0), rgba(255, 255, 255, 0.5)
  const rgbRegex = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)/gi;
  // HSL/HSLA: hsl(120, 100%, 50%), hsla(...)
  const hslRegex = /hsla?\(\s*\d+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+\s*)?\)/gi;

  const matches = [
    ...(html.match(hexRegex) || []),
    ...(html.match(rgbRegex) || []),
    ...(html.match(hslRegex) || [])
  ];

  for (const raw of matches) {
    const trimmed = raw.trim();
    const normalized = trimmed.toLowerCase();
    
    // Ignore short meaningless hex like #12 or #0
    if (normalized.startsWith('#') && (normalized.length !== 4 && normalized.length !== 5 && normalized.length !== 7 && normalized.length !== 9)) {
      continue;
    }

    const existing = colorMap.get(normalized);
    if (existing) {
      existing.count += 1;
    } else {
      colorMap.set(normalized, { original: trimmed, count: 1 });
    }
  }

  const result: ColorSwatch[] = [];
  colorMap.forEach((val, key) => {
    result.push({
      color: val.original,
      normalized: key,
      count: val.count
    });
  });

  // Sort by occurrence count descending
  return result.sort((a, b) => b.count - a.count);
}

export function replaceColor(html: string, targetColor: string, newColor: string): string {
  if (!targetColor || !newColor) return html;
  
  // Escape regex special chars if any
  const escaped = targetColor.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  // Match case-insensitively
  const regex = new RegExp(escaped, 'gi');
  return html.replace(regex, newColor);
}
