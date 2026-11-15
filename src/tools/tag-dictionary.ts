export interface TagInfo {
  tag: string;
  name: string;
  category: 'Structure' | 'Text' | 'Interactive' | 'Media' | 'Lists & Tables' | 'Code & Meta';
  analogy: string;
  description: string;
  snippet: string;
  commonAttributes: string[];
}

export const HTML_TAG_DICTIONARY: TagInfo[] = [
  // Structure & Layout
  {
    tag: 'div',
    name: 'Division Container',
    category: 'Structure',
    analogy: 'The Invisible Sorting Box',
    description: 'A generic block container used to group elements together for positioning, layouts (flex/grid), and styling without adding semantic meaning.',
    snippet: '<div class="card">\n  <h2>Title</h2>\n  <p>Content goes here.</p>\n</div>',
    commonAttributes: ['class', 'id', 'style']
  },
  {
    tag: 'section',
    name: 'Themed Section',
    category: 'Structure',
    analogy: 'The Chapter Realm',
    description: 'Represents a standalone thematic portion of a page, such as a feature showcase, testimonial block, or chapter.',
    snippet: '<section class="features">\n  <h2>Key Features</h2>\n</section>',
    commonAttributes: ['class', 'id']
  },
  {
    tag: 'header',
    name: 'Intro Deck / Header',
    category: 'Structure',
    analogy: 'The Crest & Banner',
    description: 'Contains introductory content, site titles, branding, and top navigational landmarks.',
    snippet: '<header>\n  <h1>Quest Title</h1>\n  <nav><!-- Links --></nav>\n</header>',
    commonAttributes: ['class', 'id']
  },
  {
    tag: 'nav',
    name: 'Navigation Bar',
    category: 'Structure',
    analogy: 'The Map Room',
    description: 'Designates a section containing primary navigation links or menus across your project.',
    snippet: '<nav>\n  <a href="#home">Home</a>\n  <a href="#about">About</a>\n</nav>',
    commonAttributes: ['class', 'aria-label']
  },
  {
    tag: 'main',
    name: 'Main Content',
    category: 'Structure',
    analogy: 'The Main Quest',
    description: 'Encloses the primary, unique content of the document. Each HTML page should have only one <main> element.',
    snippet: '<main>\n  <h1>Today\'s Mission</h1>\n</main>',
    commonAttributes: ['class', 'id']
  },
  {
    tag: 'footer',
    name: 'Page Footer',
    category: 'Structure',
    analogy: 'The Quest Epilogue',
    description: 'Appears at the bottom of a section or page, holding copyright notices, author credits, and footnote links.',
    snippet: '<footer>\n  <p>&copy; 2026 Interstatus Lab. All rights reserved.</p>\n</footer>',
    commonAttributes: ['class', 'id']
  },
  {
    tag: 'article',
    name: 'Self-Contained Article',
    category: 'Structure',
    analogy: 'The Standalone Lore Scroll',
    description: 'Represents a complete, self-contained piece of content that could theoretically be shared or syndicated on its own (like a blog post or news card).',
    snippet: '<article class="post">\n  <h2>The Technomage Odyssey</h2>\n  <p>Read the tale...</p>\n</article>',
    commonAttributes: ['class', 'id']
  },

  // Text & Typography
  {
    tag: 'h1',
    name: 'Primary Heading',
    category: 'Text',
    analogy: 'The Grand Quest Title',
    description: 'The highest level title on the page. Use one primary <h1> per page for search engines and screen readers.',
    snippet: '<h1>Welcome to ScryPad</h1>',
    commonAttributes: ['class', 'id']
  },
  {
    tag: 'h2',
    name: 'Secondary Heading',
    category: 'Text',
    analogy: 'The Chapter Header',
    description: 'Sub-heading dividing main sections of your document.',
    snippet: '<h2>Mission Briefing</h2>',
    commonAttributes: ['class', 'id']
  },
  {
    tag: 'p',
    name: 'Paragraph',
    category: 'Text',
    analogy: 'The Story Paragraph',
    description: 'Standard block of narrative text. Automatically handles line height and bottom paragraph spacing.',
    snippet: '<p>A swift breeze stirred the leaves of the great oak as dusk descended.</p>',
    commonAttributes: ['class', 'id']
  },
  {
    tag: 'span',
    name: 'Inline Text Span',
    category: 'Text',
    analogy: 'The Highlighter',
    description: 'An inline container used to style or target a specific word or phrase inside a sentence without breaking onto a new line.',
    snippet: '<span class="text-[#48e0d2]">glowing rune</span>',
    commonAttributes: ['class', 'style']
  },
  {
    tag: 'strong',
    name: 'Strong Importance',
    category: 'Text',
    analogy: 'The Bold Emphasis Rune',
    description: 'Indicates high importance, seriousness, or urgency. Renders in bold text by default.',
    snippet: '<strong>Warning: Mana reserves critical!</strong>',
    commonAttributes: ['class']
  },
  {
    tag: 'em',
    name: 'Emphasis / Italic',
    category: 'Text',
    analogy: 'The Whispered Tone',
    description: 'Marks text that has stress emphasis, altering the spoken inflection. Renders in italics by default.',
    snippet: '<em>Could it truly be the legendary artifact?</em>',
    commonAttributes: ['class']
  },
  {
    tag: 'blockquote',
    name: 'Quotation Block',
    category: 'Text',
    analogy: 'The Elder\'s Inscription',
    description: 'An extended quotation from an external source, typically indented with distinct styling.',
    snippet: '<blockquote>\n  "Any sufficiently advanced magic is indistinguishable from technology."\n</blockquote>',
    commonAttributes: ['cite', 'class']
  },

  // Interactive Elements
  {
    tag: 'a',
    name: 'Anchor / Hyperlink',
    category: 'Interactive',
    analogy: 'The Dimensional Portal',
    description: 'Connects to another webpage, a file, a section anchor on the same page (#id), or an email address.',
    snippet: '<a href="https://example.com" target="_blank" rel="noopener">Open Gateway</a>',
    commonAttributes: ['href', 'target', 'rel', 'class']
  },
  {
    tag: 'button',
    name: 'Action Button',
    category: 'Interactive',
    analogy: 'The Spell Trigger',
    description: 'A clickable control used to invoke scripts, submit forms, or trigger UI state changes.',
    snippet: '<button type="button" class="btn-hud">Cast Spell</button>',
    commonAttributes: ['type', 'disabled', 'class', 'id']
  },
  {
    tag: 'input',
    name: 'Input Field',
    category: 'Interactive',
    analogy: 'The Data Inscriber',
    description: 'Accepts player input of various types: text, password, checkbox, radio, color, range slider, or number.',
    snippet: '<input type="text" placeholder="Enter hero name..." class="input-hud" />',
    commonAttributes: ['type', 'value', 'placeholder', 'name', 'id']
  },
  {
    tag: 'form',
    name: 'Form Container',
    category: 'Interactive',
    analogy: 'The Dispatch Courier',
    description: 'Groups interactive input controls together to submit user data in a single payload.',
    snippet: '<form action="/submit" method="POST">\n  <input type="text" name="character" />\n  <button type="submit">Deploy</button>\n</form>',
    commonAttributes: ['action', 'method', 'class']
  },
  {
    tag: 'label',
    name: 'Input Label',
    category: 'Interactive',
    analogy: 'The Nameplate Rune',
    description: 'Provides a user-friendly caption for an input control. Clicking the label focuses or toggles the input.',
    snippet: '<label for="mana-toggle">\n  <input type="checkbox" id="mana-toggle" /> Enable Mana Shield\n</label>',
    commonAttributes: ['for', 'class']
  },

  // Media
  {
    tag: 'img',
    name: 'Image Display',
    category: 'Media',
    analogy: 'The Holo-Projection',
    description: 'Embeds an image into the document. Always include an alt attribute for accessibility.',
    snippet: '<img src="/assets/hero.png" alt="A technomage standing atop a crystal spire" class="w-full" />',
    commonAttributes: ['src', 'alt', 'width', 'height', 'loading']
  },
  {
    tag: 'svg',
    name: 'Vector Graphic',
    category: 'Media',
    analogy: 'The Geometric Sigil',
    description: 'Resolution-independent vector artwork defined with XML paths. Scales crisply to any display size.',
    snippet: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">\n  <circle cx="12" cy="12" r="10" />\n</svg>',
    commonAttributes: ['viewBox', 'width', 'height', 'fill', 'stroke']
  },
  {
    tag: 'iframe',
    name: 'Inline Frame',
    category: 'Media',
    analogy: 'The Scrying Mirror',
    description: 'Embeds an entire secondary HTML document or interactive widget (like a YouTube video or map) into the current page.',
    snippet: '<iframe src="https://example.com" width="100%" height="400" frameborder="0"></iframe>',
    commonAttributes: ['src', 'title', 'width', 'height', 'allow']
  },

  // Lists & Tables
  {
    tag: 'ul',
    name: 'Unordered List',
    category: 'Lists & Tables',
    analogy: 'The Adventure Satchel',
    description: 'A bulleted list of items where the sequence does not strictly matter.',
    snippet: '<ul>\n  <li>Health Potion</li>\n  <li>Mana Crystal</li>\n  <li>Scrying Orb</li>\n</ul>',
    commonAttributes: ['class']
  },
  {
    tag: 'ol',
    name: 'Ordered List',
    category: 'Lists & Tables',
    analogy: 'The Quest Steps',
    description: 'A numbered sequential list of items or directions where sequence matters.',
    snippet: '<ol>\n  <li>Gather astral dust</li>\n  <li>Inscribe the circle</li>\n  <li>Ignite the flame</li>\n</ol>',
    commonAttributes: ['start', 'reversed', 'class']
  },
  {
    tag: 'table',
    name: 'Data Table',
    category: 'Lists & Tables',
    analogy: 'The Stat Matrix',
    description: 'Presents structured tabular data in two-dimensional rows (<tr>) and columns/cells (<td>/<th>).',
    snippet: '<table>\n  <thead>\n    <tr><th>Spell</th><th>Mana</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Fireball</td><td>25 MP</td></tr>\n  </tbody>\n</table>',
    commonAttributes: ['class', 'border']
  },

  // Code & Meta
  {
    tag: 'code',
    name: 'Inline Code',
    category: 'Code & Meta',
    analogy: 'The Sacred Monospace Rune',
    description: 'Represents a snippet of computer code, command name, or file path. Formatted with monospace typography.',
    snippet: '<code>git status</code>',
    commonAttributes: ['class']
  },
  {
    tag: 'pre',
    name: 'Preformatted Text',
    category: 'Code & Meta',
    analogy: 'The Preserved Scroll',
    description: 'Preserves whitespace, line breaks, and exact formatting as written in the source code.',
    snippet: '<pre><code>const spell = "lumos";\nconsole.log(spell);</code></pre>',
    commonAttributes: ['class']
  },
  {
    tag: 'style',
    name: 'Style Sheet Block',
    category: 'Code & Meta',
    analogy: 'The Glamour Weave',
    description: 'Contains internal CSS rules that dictate the visual appearance, layout, animations, and colors of your HTML.',
    snippet: '<style>\n  .magic-glow {\n    box-shadow: 0 0 15px #48e0d2;\n  }\n</style>',
    commonAttributes: []
  },
  {
    tag: 'script',
    name: 'Script Automaton',
    category: 'Code & Meta',
    analogy: 'The Logic Automaton',
    description: 'Embeds executable JavaScript code to add dynamic interactivity, reactions, and logic to your document.',
    snippet: '<script>\n  console.log("HUD Online!");\n</script>',
    commonAttributes: ['src', 'type', 'defer']
  }
];

export function findTagInfo(tagName: string): TagInfo | undefined {
  const cleanTag = tagName.toLowerCase().replace(/[<>]/g, '').trim();
  return HTML_TAG_DICTIONARY.find(t => t.tag === cleanTag);
}
