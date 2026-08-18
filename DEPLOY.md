# 🚀 Como Publicar a Sonora no GitHub Pages

Guia completo para hospedar o site no GitHub Pages **sem erros de pasta**.

---

## ✅ Por que não há problema de pastas?

A Sonora usa o plugin **`vite-plugin-singlefile`**, que compila **todo o site em um único arquivo `index.html`** — sem subpastas, sem arquivos JS separados, sem arquivos CSS separados. Tudo fica embutido (inline) dentro do `index.html`.

Quando você rodar `npm run build`, a pasta `dist/` terá apenas:

```
dist/
└── index.html   ← tudo dentro deste único arquivo
```

Isso é **100% compatível com o GitHub Pages**.

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
3. Nomeie o repositório (ex: `sonora`)
4. Deixe como **público**
5. Clique em **"Create repository"**

### 4. Enviar os arquivos para o GitHub

No terminal, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "🎵 Sonora — primeiro deploy"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/sonora.git
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
https://SEU_USUARIO.github.io/sonora/
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

---

## 👤 Criado por

**Rhuan De Cillo Silva**  
Sonora — Crie músicas com programação 🎵
