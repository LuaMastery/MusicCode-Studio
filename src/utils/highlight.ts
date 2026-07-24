/**
 * highlight.ts — Realce de sintaxe JavaScript (tema Dark+ do VS Code).
 * Retorna HTML com <span>s coloridos, usado como pano de fundo do editor.
 */

const DECL = new Set(["const", "let", "var", "function"]);
const CONTROL = new Set([
  "if", "else", "for", "while", "do", "switch", "case", "break", "continue",
  "return", "try", "catch", "finally", "throw", "await", "async", "yield",
  "new", "class", "extends", "super", "import", "export", "default", "from",
  "of", "in", "typeof", "instanceof", "void", "delete",
]);
const LITERALS = new Set(["true", "false", "null", "undefined", "this", "NaN", "Infinity"]);

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Ordem importa: comentários → strings → números → identificadores → espaços → pontuação.
const TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b0x[0-9a-fA-F]+\b|\b\d[\d_]*\.?\d*(?:e[+-]?\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\w\s])/g;

export function highlightJS(code: string): string {
  let out = "";
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code)) !== null) {
    const [full, comment, str, num, ident, ws, punct] = m;
    if (comment !== undefined) {
      out += `<span class="tok-comment">${escapeHtml(comment)}</span>`;
    } else if (str !== undefined) {
      out += `<span class="tok-string">${escapeHtml(str)}</span>`;
    } else if (num !== undefined) {
      out += `<span class="tok-number">${escapeHtml(num)}</span>`;
    } else if (ident !== undefined) {
      const next = code[TOKEN_RE.lastIndex];
      if (DECL.has(ident)) out += `<span class="tok-keyword">${escapeHtml(ident)}</span>`;
      else if (CONTROL.has(ident)) out += `<span class="tok-control">${escapeHtml(ident)}</span>`;
      else if (LITERALS.has(ident)) out += `<span class="tok-literal">${escapeHtml(ident)}</span>`;
      else if (next === "(") out += `<span class="tok-fn">${escapeHtml(ident)}</span>`;
      else out += escapeHtml(ident);
    } else if (ws !== undefined) {
      out += ws;
    } else if (punct !== undefined) {
      out += `<span class="tok-punct">${escapeHtml(punct)}</span>`;
    } else {
      out += escapeHtml(full);
    }
  }
  return out || escapeHtml(code);
}
