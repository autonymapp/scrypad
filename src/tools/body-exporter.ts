/**
 * Extracts clean <body> inner HTML stripped of runtime artifacts, contenteditable tags,
 * and temporary wrappers for pasting into CMSs, Webflow, Notion, or React apps.
 */

export function extractCleanBody(html: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Clean up contenteditable and scrypad attributes from all elements
    const allElements = doc.body.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
      // Remove any data-scrypad-* attributes
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name.startsWith('data-scrypad')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    doc.body.removeAttribute('contenteditable');
    doc.body.removeAttribute('spellcheck');

    // Return trimmed innerHTML
    return doc.body.innerHTML.trim();
  } catch (err) {
    // Fallback regex if DOMParser fails
    const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (match) {
      return match[1].replace(/\scontenteditable=["'][^"']*["']/gi, '').trim();
    }
    return html;
  }
}
