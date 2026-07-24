/**
 * runner.ts — Executa o código JavaScript do usuário injetando a API musical.
 *
 * O código é envolvido numa função async anônima, então `await sleep()`
 * funciona no nível superior e loops ficam corretamente espaçados no tempo.
 */

import { engine, AbortRun } from "./engine";
import { buildApi } from "./api";

export interface RunOptions {
  onLog: (...args: unknown[]) => void;
  onPlayingChange: (playing: boolean) => void;
}

let runId = 0;

/** Para qualquer execução em andamento. */
export function stopAll(): void {
  engine.requestStop();
}

/** Executa o código do usuário. Resolve quando termina (ou é abortado). */
export async function runCode(code: string, opts: RunOptions): Promise<void> {
  const myRun = ++runId;
  engine.startRun();
  await engine.resume();

  const api = buildApi({ log: (...args: unknown[]) => opts.onLog(...args) });
  const keys = Object.keys(api);
  const values = Object.values(api) as unknown[];

  // `new Function` injeta as funções da API como variáveis globais do escopo.
  const factory = new Function(
    ...keys,
    `"use strict";\nreturn (async () => {\n${code}\n})();`,
  );

  let endTimer: ReturnType<typeof setTimeout> | null = null;

  opts.onPlayingChange(true);

  try {
    await factory(...values);
    // O código terminou — mas pode haver notas ainda ressoando.
    // Mantemos o indicador aceso até o som realmente acabar.
    const remaining = Math.max(0.4, engine.cursor - engine.now + 0.4);
    endTimer = setTimeout(() => {
      if (myRun === runId) opts.onPlayingChange(false);
    }, remaining * 1000);
  } catch (err) {
    if (err instanceof AbortRun) {
      opts.onPlayingChange(false);
    } else if (err instanceof Error) {
      opts.onLog(`❌ ${err.message}`);
      opts.onPlayingChange(false);
    } else {
      opts.onLog(`❌ ${String(err)}`);
      opts.onPlayingChange(false);
    }
    if (endTimer) clearTimeout(endTimer);
  }
}
