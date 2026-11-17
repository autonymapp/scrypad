import { EditorView, basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { html, autoCloseTags } from "@codemirror/lang-html";
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// Forge syntax colors: violet tags, moonsilver attributes, gold strings, calm everything else
const forgeHighlight = HighlightStyle.define([
  { tag: [t.tagName, t.keyword, t.definitionKeyword, t.modifier], color: "var(--forge-hi)" },
  { tag: [t.attributeName, t.propertyName], color: "var(--moonsilver)" },
  { tag: [t.string, t.special(t.string), t.attributeValue], color: "var(--gold)" },
  { tag: [t.number, t.bool, t.atom, t.color, t.unit], color: "var(--blue)" },
  { tag: [t.comment, t.lineComment, t.blockComment], color: "var(--faint)", fontStyle: "italic" },
  { tag: [t.angleBracket, t.punctuation, t.separator, t.bracket], color: "var(--dim)" },
  { tag: [t.function(t.variableName), t.className], color: "var(--forge-soft)" },
  { tag: [t.variableName, t.name], color: "var(--ink)" },
  { tag: t.invalid, color: "var(--red)" },
]);
import { keymap } from "@codemirror/view";
import { indentWithTab, undo, redo } from "@codemirror/commands";
import { 
  search, 
  SearchQuery, 
  setSearchQuery, 
  findNext, 
  findPrevious, 
  replaceNext, 
  replaceAll, 
  SearchCursor 
} from "@codemirror/search";

export interface CodeEditorOptions {
  container: HTMLElement;
  initialValue: string;
  onDocChange: (newContent: string) => void;
  /** Every change, typed or set by ScryPad (opening a file, New File...). */
  onAnyChange?: (newContent: string) => void;
}

export class CodePane {
  private wrapCompartment = new Compartment();
  private wrapOn = false;

  private view: EditorView;
  private isExternalUpdate: boolean = false;

  constructor(options: CodeEditorOptions) {
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && !this.isExternalUpdate) {
        options.onDocChange(this.getValue());
      }
      if (update.docChanged) options.onAnyChange?.(this.getValue());
    });

    const customTheme = EditorView.theme({
      "&": {
        height: "100%",
        fontSize: "13px",
        fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace"
      },
      ".cm-scroller": {
        overflow: "auto",
        lineHeight: "1.6"
      },
      ".cm-gutters": {
        backgroundColor: "var(--deep)",
        borderRight: "1px solid var(--line)",
        color: "var(--faint2)"
      },
      "&.cm-focused": {
        outline: "none"
      }
    });

    const state = EditorState.create({
      doc: options.initialValue,
      extensions: [
        basicSetup,
        html(),
        autoCloseTags,
        search({ top: false }),
        oneDarkTheme,
        this.wrapCompartment.of([]),
        syntaxHighlighting(forgeHighlight),
        customTheme,
        keymap.of([indentWithTab]),
        updateListener
      ]
    });

    this.view = new EditorView({
      state,
      parent: options.container
    });
  }

  public setWordWrap(on: boolean) {
    this.wrapOn = on;
    this.view.dispatch({ effects: this.wrapCompartment.reconfigure(on ? EditorView.lineWrapping : []) });
  }

  public isWordWrap(): boolean {
    return this.wrapOn;
  }

  public getValue(): string {
    return this.view.state.doc.toString();
  }

  public setValue(newCode: string) {
    if (this.getValue() === newCode) return;
    this.isExternalUpdate = true;
    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.length,
        insert: newCode
      }
    });
    this.isExternalUpdate = false;
  }

  public getLineCount(): number {
    return this.view.state.doc.lines;
  }

  public focus() {
    this.view.focus();
  }

  // --- Undo & Redo ---
  public undo(): boolean {
    return undo(this.view);
  }

  public redo(): boolean {
    return redo(this.view);
  }

  // --- Find & Search & Replace ---
  public setSearch(
    queryText: string, 
    replaceText: string = '', 
    caseSensitive: boolean = false, 
    regexp: boolean = false
  ): { total: number; current: number } {
    const query = new SearchQuery({
      search: queryText,
      replace: replaceText,
      caseSensitive,
      regexp
    });

    this.view.dispatch({
      effects: setSearchQuery.of(query)
    });

    if (!queryText) {
      return { total: 0, current: 0 };
    }

    // Calculate match count & active match index
    let total = 0;
    let current = 0;
    const doc = this.view.state.doc;
    const selection = this.view.state.selection.main;

    try {
      const cursor = new SearchCursor(
        doc,
        queryText,
        0,
        doc.length,
        caseSensitive ? undefined : (s: string) => s.toLowerCase()
      );

      while (!cursor.next().done) {
        total++;
        if (cursor.value.from <= selection.from && selection.to <= cursor.value.to) {
          current = total;
        }
      }
    } catch {
      // Ignore cursor errors (e.g. malformed regex)
    }

    return { total, current };
  }

  public findNext(): boolean {
    return findNext(this.view);
  }

  public findPrevious(): boolean {
    return findPrevious(this.view);
  }

  public replaceNext(): boolean {
    return replaceNext(this.view);
  }

  public replaceAll(): boolean {
    return replaceAll(this.view);
  }

  // --- Insert Snippet / Tag ---
  public insertSnippet(snippet: string) {
    const selection = this.view.state.selection.main;
    this.view.dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: snippet
      },
      selection: {
        anchor: selection.from + snippet.length
      }
    });
    this.view.focus();
  }

  public formatHtml() {
    const code = this.getValue();
    let formatted = '';
    let indent = '';
    const tab = '  ';
    
    // Clean formatted HTML serializer
    code.split(/>\s*</).forEach(node => {
      if (node.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }
      formatted += indent + '<' + node + '>\r\n';
      if (
        node.match(/^<?\w[^>]*[^\/]$/) &&
        !node.startsWith("input") &&
        !node.startsWith("img") &&
        !node.startsWith("br") &&
        !node.startsWith("hr") &&
        !node.startsWith("meta") &&
        !node.startsWith("link")
      ) {
        indent += tab;
      }
    });

    formatted = formatted.substring(1, formatted.length - 3);
    this.setValue(formatted);
  }
}
