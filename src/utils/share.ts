/**
 * share.ts — publica/importa HTMLs via código (sem backend).
 *
 * "Público" = compartilhável: o instrumento é codificado num código/curto
 * (base64) que pode ser enviado por link. Quem recebe cola o código (ou abre
 * o link) e o instrumento é importado para a aba "HTMLs públicos".
 *
 * A imagem não é incluída no código (muito grande); só nome, ícone,
 * descrição, código e permissão de cópia.
 */

export interface SharePayload {
  v: 1;
  n: string;   // nome
  i: string;   // ícone
  d?: string;  // descrição
  c: string;   // código HTML
  cp: boolean; // permite copiar o código
}

export function encodeShare(p: SharePayload): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(p))));
}

/** Decodifica a partir de um código puro OU de um link contendo #s=... */
export function decodeShare(input: string): SharePayload | null {
  try {
    let s = (input || "").trim();
    const m = s.match(/[#&?]s=([^&\s]+)/);
    if (m) s = decodeURIComponent(m[1]);
    s = s.replace(/\s/g, "");
    const j = JSON.parse(decodeURIComponent(escape(atob(s))));
    if (j && typeof j.c === "string") {
      return {
        v: 1,
        n: String(j.n || "HTML"),
        i: String(j.i || "📦"),
        d: j.d ? String(j.d) : undefined,
        c: j.c,
        cp: !!j.cp,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function shareLink(code: string): string {
  const base = location.origin + location.pathname;
  // ?html=1 faz o App.tsx abrir a página HTML ao carregar o link
  return base + "?html=1#s=" + encodeURIComponent(code);
}
