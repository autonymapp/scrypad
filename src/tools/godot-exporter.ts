/**
 * Godot BBCode Converter for ScryPad
 * Converts HTML markup into Godot RichTextLabel BBCode format.
 * Supports: [b], [i], [u], [s], [code], [color=#hex], [url=...],
 * plus Godot 4 text effects: [wave], [shake], [rainbow], [fade].
 */

export function htmlToGodotBBCode(html: string): string {
  // Extract body if full document
  let content = html;
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    content = bodyMatch[1];
  }

  // Remove <style>, <script>, and <svg> blocks
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');

  // Bold
  content = content.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '[b]$2[/b]');

  // Italic
  content = content.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '[i]$2[/i]');

  // Underline
  content = content.replace(/<u[^>]*>([\s\S]*?)<\/u>/gi, '[u]$1[/u]');

  // Strikethrough
  content = content.replace(/<(s|strike|del)[^>]*>([\s\S]*?)<\/\1>/gi, '[s]$2[/s]');

  // Code
  content = content.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '[code]$1[/code]');

  // Headings -> bold centered or enlarged
  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n[font_size=28][b]$1[/b][/font_size]\n');
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n[font_size=22][b]$1[/b][/font_size]\n');
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n[font_size=18][b]$1[/b][/font_size]\n');

  // Godot Text Effects (wave, shake, rainbow, fade)
  content = content.replace(/<span[^>]*class=["'][^"']*wave[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi, '[wave amp=50.0 freq=5.0 connected=1]$1[/wave]');
  content = content.replace(/<span[^>]*class=["'][^"']*shake[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi, '[shake rate=20.0 level=5 connected=1]$1[/shake]');
  content = content.replace(/<span[^>]*class=["'][^"']*rainbow[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi, '[rainbow freq=1.0 sat=0.8 val=0.8]$1[/rainbow]');
  content = content.replace(/<span[^>]*class=["'][^"']*fade[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi, '[fade start=4 length=14]$1[/fade]');

  // Colors: <span style="color: #hex"> or <font color="#hex">
  content = content.replace(/<span[^>]*style=["'][^"']*color:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi, '[color=$1]$2[/color]');
  content = content.replace(/<font[^>]*color=["']([^"']+)["'][^>]*>([\s\S]*?)<\/font>/gi, '[color=$1]$2[/color]');

  // Links: <a href="...">
  content = content.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[url=$1]$2[/url]');

  // Lists: <li> -> • item
  content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '  • $1\n');
  content = content.replace(/<\/?(ul|ol)[^>]*>/gi, '\n');

  // Paragraphs & Divs & Line Breaks
  content = content.replace(/<br\s*\/?>/gi, '\n');
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');
  content = content.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1\n');

  // Strip remaining HTML tags
  content = content.replace(/<[^>]+>/g, '');

  // Decode common HTML entities
  content = content.replace(/&amp;/g, '&');
  content = content.replace(/&lt;/g, '<');
  content = content.replace(/&gt;/g, '>');
  content = content.replace(/&quot;/g, '"');
  content = content.replace(/&#39;/g, "'");
  content = content.replace(/&nbsp;/g, ' ');

  // Clean extra blank lines
  content = content.replace(/\n{3,}/g, '\n\n');

  return content.trim();
}
