# 🚀 Como Publicar o MusicCode Studio no GitHub Pages

Guia completo para hospedar o site no GitHub Pages **sem erros de pasta**.

---

## ✅ Por que não há problema de pastas?

O MusicCode Studio usa o plugin **`vite-plugin-singlefile`**, que compila **todo o site em um único arquivo `index.html`** — sem subpastas, sem arquivos JS separados, sem arquivos CSS separados. Tudo fica embutido (inline) dentro do `index.html`.

Quando você rodar `npm run build`, a pasta `dist/` terá apenas:

```
dist/
└── index.html   ← tudo dentro deste único arquivo
```

Isso é **100% compatível com o GitHub Pages**.

---

## ✅ Método recomendado — Pasta `/docs`

Este método mantém o código-fonte limpo (o `npm run dev` segue funcionando) e publica
o site pronto a partir da pasta `/docs`. É o método mais simples e confiável.

### 1. Gerar o build de Pages

```bash
npm run build:pages      # gera a pasta docs/ (index.html autossuficiente + .nojekyll)
```

> Esse comando compila o app num único `docs/index.html` e adiciona o `.nojekyll`.

### 2. Apontar o GitHub Pages para a pasta `/docs`

1. No repositório, vá em **Settings → Pages**
2. Em **Source → Deploy from a branch**:
   - **Branch:** `main` (após o merge do PR) — *ou* `arena/019f9607-musiccode-studio` para ver agora
   - **Pasta:** selecione **`/docs`** (não `/root`)
3. Clique em **Save**

> ⚠️ Importante: a configuração antiga apontava para **`/` (root)**, que serve o
> `index.html` fonte (não executável) — por isso o site ficava em branco.
> Usar a pasta **`/docs`** resolve isso.

### 3. Aguardar o build

Em 1–2 minutos o site estará no ar em:

```
https://luamastery.github.io/MusicCode-Studio/
```

---

## 📋 Passo a Passo

### 1. Instalar as dependências

```bash
npm install
```

### 2. Gerar o build de produção

```bash
npm run build
```

Isso gera a pasta `dist/` com o `index.html` completo.

### 3. Criar um repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"**
3. Nomeie o repositório (ex: `musiccode-studio`)
4. Deixe como **público**
5. Clique em **"Create repository"**

### 4. Enviar os arquivos para o GitHub

No terminal, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "🎵 MusicCode Studio — primeiro deploy"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/musiccode-studio.git
git push -u origin main
```

### 5. Ativar o GitHub Pages

1. No repositório, clique em **Settings** (Configurações)
2. No menu lateral, clique em **Pages**
3. Em **"Source"**, selecione:
   - Branch: `main`
   - Pasta: `/ (root)` — **NÃO selecione `/docs`**
4. Clique em **Save**

> ⚠️ **Importante:** Como o `vite-plugin-singlefile` gera tudo em um único `index.html`, você deve publicar o conteúdo da pasta `dist/` na raiz do repositório, **ou** usar o método abaixo com a branch `gh-pages`.

---

## 🔄 Método Recomendado — Branch `gh-pages`

Este método mantém o código-fonte na branch `main` e o build na branch `gh-pages`:

### 1. Instalar o pacote `gh-pages`

```bash
npm install -D gh-pages
```

### 2. Adicionar script no `package.json`

Abra o `package.json` e adicione em `"scripts"`:

```json
"deploy": "npm run build && gh-pages -d dist"
```

### 3. Fazer o deploy

```bash
npm run deploy
```

Isso vai:
- Rodar `npm run build` automaticamente
- Publicar o conteúdo de `dist/` na branch `gh-pages`

### 4. Configurar o GitHub Pages para usar `gh-pages`

1. Vá em **Settings → Pages**
2. Em **"Source"**, selecione:
   - Branch: `gh-pages`
   - Pasta: `/ (root)`
3. Clique em **Save**

### 5. Aguardar o deploy

Em alguns minutos o site estará disponível em:

```
https://SEU_USUARIO.github.io/musiccode-studio/
```

---

## 📁 Estrutura final do `dist/` (após build)

```
dist/
└── index.html   ← Site completo em um único arquivo (JS + CSS + HTML inline)
```

Sem subpastas. Sem arquivos extras. **Apenas o `index.html`.**

---

## ⚙️ Arquivos de suporte para GitHub Pages

O projeto já inclui os seguintes arquivos necessários:

| Arquivo | Função |
|---------|--------|
| `.nojekyll` | Desativa o processamento Jekyll do GitHub Pages |
| `404.html` | Redireciona rotas desconhecidas para o `index.html` (SPA support) |
| `index.html` | Script de redirect do sessionStorage para navegação SPA |

---

## ❓ Problemas Comuns

### Site em branco após deploy
- Verifique se a branch e pasta corretas estão selecionadas no GitHub Pages
- Aguarde alguns minutos após o deploy — o GitHub Pages pode demorar

### Erro 404 ao acessar o site
- Certifique-se de que o arquivo `.nojekyll` está na raiz do repositório
- Verifique se o `index.html` está na raiz (não dentro de uma pasta)

### Erros de build
```bash
npm install
npm run build
```
Rode esses comandos novamente e verifique o log de erros.

#### `Cannot find module @rollup/rollup-linux-x64-gnu`
Bug conhecido do npm com dependências opcionais. Solução rápida:
```bash
npm i @rollup/rollup-linux-x64-gnu --no-save
npm run build
```
(Ou simplesmente rode `npm install` novamente.)

#### `vite: Permission denied`
Os binários em `node_modules/.bin` podem ficar sem permissão de execução. Rode o build via Node:
```bash
node node_modules/vite/bin/vite.js build
```

---

## 📱 Publicar como aplicativo nativo (Capacitor)

O mesmo projeto vira um app **Android (.apk)** ou **iOS**. Pré-requisitos:
**Android Studio** (+ JDK) para Android, **Xcode no macOS** para iOS.

### 1. Instalar as plataformas (uma vez)
```bash
npm i -D @capacitor/android @capacitor/ios
```

### 2. Gerar o build web
```bash
npm run build
```

### 3. Adicionar a plataforma
```bash
npx cap add android   # ou: npx cap add ios
npx cap sync          # copia o dist/ para o projeto nativo
```

### 4. Abrir e compilar
```bash
npx cap open android  # abre no Android Studio
# No Android Studio: Build → Build Bundle(s)/APK(s) → Build APK(s)
```

O `capacitor.config.ts` já está configurado (`webDir: "dist"`, `appId`, `appName`).
Como o `vite-plugin-singlefile` gera um `index.html` autossuficiente, o app funciona
offline no WebView sem precisar de servidor.

---

## 👤 Criado por

**Rhuan De Cillo Silva**  
MusicCode Studio — Crie músicas com programação 🎵
