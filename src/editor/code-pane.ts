import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";

export interface CodeEditorOptions {
  container: HTMLElement;
  initialValue: string;
  onDocChange: (newContent: string) => void;
}

export class CodePane {
  private view: EditorView;
  private isExternalUpdate: boolean = false;

  constructor(options: CodeEditorOptions) {
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && !this.isExternalUpdate) {
        options.onDocChange(this.getValue());
      }
    });

    const customTheme = EditorView.theme({
      "&": {
        height: "100%",
        fontSize: "13px",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace"
      },
      ".cm-scroller": {
        overflow: "auto",
        lineHeight: "1.6"
      },
      ".cm-gutters": {
        backgroundColor: "#0d1017",
        borderRight: "1px solid #1e2638",
        color: "#475569"
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
        oneDark,
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
