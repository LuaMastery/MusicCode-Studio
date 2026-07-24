/**
 * htmlSandbox — segurança para HTMLs criados pelo usuário.
 *
 * Por padrão (modo seguro), o HTML do usuário roda num iframe sandboxed com:
 *  - sandbox="allow-scripts" (apenas scripts; sem mesma origem, sem downloads,
 *    sem popups, sem navegação, sem formulários)
 *  - uma CSP injetada que bloqueia TUDO de rede e recursos remotos
 *    (connect-src 'none', sem scripts/estilos/fontes externos, form-action 'none').
 *
 * Assim o HTML pode usar a Web Audio API (inline) mas NÃO pode: acessar o app,
 * fugir do iframe, baixar arquivos, exfiltrar dados ou carregar código remoto.
 *
 * No "modo sem segurança" (opt-in, com aviso), essas restrições são removidas.
 */

export const SAFE_SANDBOX = "allow-scripts";
export const UNSAFE_SANDBOX =
  "allow-scripts allow-same-origin allow-downloads allow-popups allow-forms allow-modals allow-top-navigation-by-user-activation";

export const SAFE_CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline' blob:",   // permite o JS de áudio do usuário (inline)
  "style-src 'unsafe-inline'",
  "img-src data: blob:",
  "media-src blob: data:",
  "font-src data:",
  "connect-src 'none'",                  // SEM rede
  "frame-src 'none'",
  "child-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",                  // SEM envio de formulários
].join("; ");

export const MAX_HTML_BYTES = 200 * 1024; // 200 KB

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

/** Valida tamanho e regras básicas do HTML do usuário. */
export function validateHtml(code: string): ValidationResult {
  if (!code.trim()) return { ok: false, error: "O HTML não pode estar vazio." };
  if (code.length > MAX_HTML_BYTES) {
    return { ok: false, error: `HTML muito grande (máximo ${MAX_HTML_BYTES / 1024} KB).` };
  }
  return { ok: true };
}

/** Injeta a CSP no <head> do documento (modo seguro). */
export function buildSandboxDoc(code: string, unsafe: boolean): string {
  if (unsafe) return code;
  const meta = `<meta http-equiv="Content-Security-Policy" content="${SAFE_CSP}">`;
  if (/<head[^>]*>/i.test(code)) {
    return code.replace(/<head[^>]*>/i, (m) => m + meta);
  }
  if (/<html[^>]*>/i.test(code)) {
    return code.replace(/<html[^>]*>/i, (m) => m + "<head>" + meta + "</head>");
  }
  return meta + code;
}

export function sandboxAttr(unsafe: boolean): string {
  return unsafe ? UNSAFE_SANDBOX : SAFE_SANDBOX;
}
