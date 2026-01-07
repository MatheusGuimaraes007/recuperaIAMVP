# 📝 Comandos Úteis - Recupera.IA Frontend

Referência rápida de comandos para desenvolvimento.

## 🚀 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar em porta específica
npm run dev -- --port 3000

# Iniciar com host exposto (acessível na rede local)
npm run dev -- --host
```

## 🏗️ Build

```bash
# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Build com análise de bundle
npm run build -- --mode analyze
```

## 🧹 Qualidade de Código

```bash
# Executar ESLint
npm run lint

# ESLint com auto-fix
npm run lint -- --fix

# Formatar código com Prettier
npm run format

# Verificar formatação sem modificar
npx prettier --check src/
```

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test -- --watch

# Executar com UI interativa
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage

# Executar teste específico
npm run test -- nome-do-arquivo
```

## 📦 Dependências

```bash
# Instalar dependências
npm install

# Instalar dependência específica
npm install nome-do-pacote

# Instalar como dev dependency
npm install -D nome-do-pacote

# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated

# Auditar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

## 🔍 Inspeção e Debug

```bash
# Analisar tamanho do bundle
npx vite-bundle-visualizer

# Verificar versões
node --version
npm --version
npx vite --version

# Limpar cache do npm
npm cache clean --force

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json && npm install

# Limpar cache do Vite
rm -rf node_modules/.vite
```

## 🎨 Tailwind CSS

```bash
# Gerar arquivo de configuração completo
npx tailwindcss init --full

# Ver classes Tailwind sendo usadas
npx tailwindcss-debug

# Verificar classes não utilizadas (PurgeCSS)
npx purgecss --css dist/assets/*.css --content dist/**/*.html
```

## 🔧 Git

```bash
# Status
git status

# Adicionar arquivos
git add .

# Commit com mensagem
git commit -m "feat: adiciona nova feature"

# Push
git push origin main

# Pull
git pull origin main

# Criar nova branch
git checkout -b feature/nova-feature

# Ver histórico
git log --oneline

# Ver diferenças
git diff
```

## 🌿 Branches

```bash
# Listar branches
git branch

# Criar e mudar para nova branch
git checkout -b feature/nome

# Mudar para branch existente
git checkout main

# Deletar branch local
git branch -d feature/nome

# Deletar branch remota
git push origin --delete feature/nome
```

## 🔄 Sincronização

```bash
# Fazer fetch das mudanças
git fetch origin

# Rebase com main
git rebase main

# Merge de branch
git merge feature/nome

# Stash mudanças não commitadas
git stash

# Aplicar stash
git stash apply

# Listar stashes
git stash list
```

## 📊 Análise de Código

```bash
# Contar linhas de código
npx cloc src/

# Análise de complexidade
npx complexity-report src/**/*.vue src/**/*.js

# Verificar imports não utilizados
npx unimported

# Verificar dependências não utilizadas
npx depcheck
```

## 🚢 Deploy

```bash
# Deploy na Vercel
vercel --prod

# Deploy na Netlify
netlify deploy --prod

# Deploy manual (depois do build)
# 1. npm run build
# 2. Upload da pasta dist/ para servidor
```

## 🔐 Segurança

```bash
# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades automaticamente
npm audit fix

# Corrigir forçando breaking changes
npm audit fix --force

# Verificar licenças
npx license-checker
```

## 📱 Mobile/Responsivo

```bash
# Testar em dispositivos móveis da rede
npm run dev -- --host

# Acessar de outro dispositivo:
# http://SEU-IP:5173
```

## 🛠️ Utilitários

```bash
# Gerar componente Vue rapidamente
touch src/components/atoms/RNomeDoComponente.vue

# Criar arquivo com conteúdo básico
cat > src/components/atoms/RButton.vue << 'EOF'
<script setup>
// Props e lógica
</script>

<template>
  <!-- Template -->
</template>

<style scoped>
/* Estilos */
</style>
EOF

# Buscar em arquivos
grep -r "texto-para-buscar" src/

# Contar arquivos Vue
find src/ -name "*.vue" | wc -l

# Listar arquivos maiores que 100KB
find src/ -type f -size +100k
```

## 🎯 Atalhos do VS Code

```
Ctrl/Cmd + P          - Quick Open (buscar arquivo)
Ctrl/Cmd + Shift + P  - Command Palette
Ctrl/Cmd + B          - Toggle Sidebar
Ctrl/Cmd + `          - Toggle Terminal
Ctrl/Cmd + /          - Comentar linha
Alt + Shift + F       - Formatar documento
F2                    - Renomear símbolo
Ctrl/Cmd + D          - Selecionar próxima ocorrência
Ctrl/Cmd + F          - Buscar
Ctrl/Cmd + H          - Substituir
```

## 🔥 Atalhos do Navegador (DevTools)

```
F12 ou Ctrl/Cmd + Shift + I  - Abrir DevTools
Ctrl/Cmd + Shift + C          - Inspetor de elementos
Ctrl/Cmd + Shift + J          - Console
Ctrl/Cmd + R                  - Reload
Ctrl/Cmd + Shift + R          - Hard Reload (limpar cache)
```

## 💡 Dicas Úteis

### Limpar tudo e recomeçar

```bash
# Limpar completamente o projeto
rm -rf node_modules dist .vite package-lock.json
npm install
npm run dev
```

### Verificar se porta está em uso

```bash
# Mac/Linux
lsof -i :5173

# Windows
netstat -ano | findstr :5173
```

### Matar processo em porta

```bash
# Mac/Linux
kill -9 $(lsof -t -i:5173)

# Com npx (multiplataforma)
npx kill-port 5173
```

### Ver consumo de recursos

```bash
# Ver tamanho das pastas
du -sh node_modules/
du -sh dist/

# Ver arquivos maiores
find . -type f -size +1M -exec ls -lh {} \;
```

## 📖 Links Úteis

- **Vite**: https://vitejs.dev/
- **Vue 3**: https://vuejs.org/
- **Tailwind**: https://tailwindcss.com/
- **Pinia**: https://pinia.vuejs.org/
- **TanStack Query**: https://tanstack.com/query/latest
- **Vue Router**: https://router.vuejs.org/

---

**💡 Dica**: Adicione aliases no seu `~/.bashrc` ou `~/.zshrc` para comandos frequentes:

```bash
alias dev="npm run dev"
alias build="npm run build"
alias lint="npm run lint"
alias test="npm run test"
```
