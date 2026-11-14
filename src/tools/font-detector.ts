/**
 * Detects Google Fonts used in CSS font-family rules that lack a <link> or @import tag.
 */

export const POPULAR_GOOGLE_FONTS: Record<string, string> = {
  'Rajdhani': 'Rajdhani:wght@400;500;600;700',
  'IBM Plex Sans': 'IBM+Plex+Sans:wght@300;400;500;600;700',
  'IBM Plex Mono': 'IBM+Plex+Mono:wght@400;500;600',
  'Cinzel': 'Cinzel:wght@400;600;700;800',
  'Inter': 'Inter:wght@300;400;500;600;700',
  'Roboto': 'Roboto:wght@300;400;500;700',
  'Poppins': 'Poppins:wght@300;400;500;600;700',
  'Montserrat': 'Montserrat:wght@400;500;600;700',
  'Outfit': 'Outfit:wght@400;500;600;700',
  'Plus Jakarta Sans': 'Plus+Jakarta+Sans:wght@400;500;600;700',
  'Fira Code': 'Fira+Code:wght@400;500;600;700',
  'JetBrains Mono': 'JetBrains+Mono:wght@400;500;700',
  'Playfair Display': 'Playfair+Display:ital,wght@0,400;0,700;1,400',
  'Space Grotesk': 'Space+Grotesk:wght@400;500;600;700',
  'Press Start 2P': 'Press+Start+2P',
  'Syne': 'Syne:wght@400;600;700;800',
  'Lora': 'Lora:ital,wght@0,400;0,600;1,400',
  'Merriweather': 'Merriweather:ital,wght@0,400;0,700;1,400',
  'Open Sans': 'Open+Sans:wght@400;600;700',
  'Lato': 'Lato:wght@400;700',
  'Oswald': 'Oswald:wght@400;600;700',
  'Raleway': 'Raleway:wght@400;600;700'
};

export interface UnlinkedFont {
  fontName: string;
  query: string;
}

export function detectUnlinkedFonts(html: string): UnlinkedFont[] {
  const unlinked: UnlinkedFont[] = [];
  
  // Check if fonts.googleapis.com is already imported or linked
  const hasGoogleFontsLink = /fonts\.googleapis\.com/i.test(html);

  // Extract CSS from style tags and inline styles
  const styleBlockMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const inlineStyleMatches = html.match(/style=["'][^"']*["']/gi) || [];
  const allCss = [...styleBlockMatches, ...inlineStyleMatches].join('\n');

  // Extract all font-family declarations
  const fontDeclarations = allCss.match(/font-family\s*:\s*([^;}{"'>]+)/gi) || [];

  for (const [fontName, query] of Object.entries(POPULAR_GOOGLE_FONTS)) {
    for (const decl of fontDeclarations) {
      // Ignore Roboto when used merely as an OS fallback in standard system stacks
      if (fontName === 'Roboto' && /(-apple-system|BlinkMacSystemFont|system-ui)/i.test(decl)) {
        continue;
      }

      // Match fontName surrounded by quotes, commas, or start/end
      const escaped = fontName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const fontMatch = new RegExp(`(^|[,\\s"'])${escaped}([,\\s"']|$)`, 'i');

      if (fontMatch.test(decl)) {
        const fontSpecificRegex = new RegExp(`family=${query.split(':')[0]}`, 'i');
        if (!hasGoogleFontsLink || !fontSpecificRegex.test(html)) {
          if (!unlinked.some(u => u.fontName === fontName)) {
            unlinked.push({ fontName, query });
          }
        }
      }
    }
  }

  return unlinked;
}

export function injectGoogleFont(html: string, fontName: string, query: string): string {
  const fontComment = `  <!-- Google Font: ${fontName} -->\n`;
  const preconnectHtml = `  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n`;
  const fontLink = `  <link href="https://fonts.googleapis.com/css2?family=${query}&display=swap" rel="stylesheet">\n`;

  // Check if preconnect already exists
  const hasPreconnect = /href=["']https:\/\/fonts\.googleapis\.com["']/i.test(html);
  const snippetToInject = fontComment + (hasPreconnect ? '' : preconnectHtml) + fontLink;

  if (html.includes('</head>')) {
    return html.replace('</head>', `${snippetToInject}</head>`);
  } else if (html.includes('<head>')) {
    return html.replace('<head>', `<head>\n${snippetToInject}`);
  } else if (html.includes('<!DOCTYPE html>')) {
    return html.replace('<!DOCTYPE html>', `<!DOCTYPE html>\n<head>\n${snippetToInject}</head>`);
  } else {
    return `<head>\n${snippetToInject}</head>\n${html}`;
  }
}
