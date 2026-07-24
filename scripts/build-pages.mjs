/**
 * build-pages.mjs — Gera a pasta docs/ pronta para o GitHub Pages.
 *
 * O Vite compila tudo para um único index.html (vite-plugin-singlefile),
 * então a pasta docs/ fica autossuficiente. Adicionamos .nojekyll para
 * garantir que o GitHub Pages sirva os arquivos sem processamento Jekyll.
 */
import { build } from "vite";
import { writeFileSync } from "fs";

const outDir = "docs";

await build({
  configFile: "vite.config.ts",
  build: { outDir, emptyOutDir: true },
});

// .nojekyll desativa o Jekyll no GitHub Pages (boa prática).
writeFileSync(`${outDir}/.nojekyll`, "");

console.log(`\n✅ Build de GitHub Pages gerado em ${outDir}/`);
console.log(`   Para publicar: faça merge para main e aponte Pages -> branch main, pasta /docs`);
