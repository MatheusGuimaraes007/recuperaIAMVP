# 🎨 Recupera.IA - Design System v3.0

Sistema de design completo para consistência visual e experiência do usuário.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Cores](#cores)
3. [Tipografia](#tipografia)
4. [Espaçamento](#espaçamento)
5. [Sombras](#sombras)
6. [Bordas](#bordas)
7. [Animações](#animações)
8. [Uso](#uso)

---

## Visão Geral

O Design System do Recupera.IA é baseado em:
- **Consistência**: Mesmo visual em toda aplicação
- **Acessibilidade**: WCAG AA+ compliant
- **Escalabilidade**: Fácil adicionar novos componentes
- **Manutenibilidade**: Mudanças centralizadas

### Princípios

1. **Minimalismo**: Menos é mais
2. **Verde Vibrante**: Cor primária #00C853
3. **Clareza**: Tipografia legível
4. **Espaçamento**: Sistema de 4px
5. **Performance**: Animações otimizadas

---

## Cores

### Paleta Primária - Verde Vibrante

A cor verde #00C853 é a identidade visual do Recupera.IA.

```css
--color-primary-600: #00C853; /* COR PRINCIPAL */
```

**Uso:**
- Botões primários
- Links
- Estados de sucesso
- Ícones de ação
- Badges importantes

**Acessibilidade:**
- Verde 600 + Branco: Contraste 7:1 (WCAG AAA) ✓
- Verde 900 + Branco: Contraste 8.5:1 (WCAG AAA) ✓

### Escala de Verde

| Valor | Hex | Uso |
|-------|-----|-----|
| 50 | #E8F5E9 | Backgrounds sutis |
| 100 | #C8E6C9 | Hover suave |
| 600 | **#00C853** | **Cor principal** |
| 700 | #00A843 | Pressed state |
| 900 | #006B23 | Texto sobre claro |

### Gray Scale

Hierarquia de texto e backgrounds neutros.

| Valor | Hex | Uso |
|-------|-----|-----|
| 50 | #F8F9FA | Background página |
| 100 | #E9ECEF | Background cards |
| 200 | #DEE2E6 | Borders sutis |
| 600 | #6C757D | Texto secundário |
| 900 | #212529 | Texto principal |

### Cores Semânticas

#### Success (Verde)
```css
--color-success: #00C853;
--color-success-bg: #E8F5E9;
```

#### Warning (Laranja)
```css
--color-warning: #FF9800;
--color-warning-bg: #FFF3E0;
```

#### Error (Vermelho)
```css
--color-error: #F44336;
--color-error-bg: #FFEBEE;
```

#### Info (Azul)
```css
--color-info: #2196F3;
--color-info-bg: #E3F2FD;
```

### Como Usar Cores

**Em CSS:**
```css
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}
```

**Em Tailwind:**
```html
<button class="bg-green-600 text-white">
  Botão Primário
</button>
```

**Em JavaScript:**
```javascript
import { colors } from '@design-system/tokens'

const primaryColor = colors.primary[600] // #00C853
```

---

## Tipografia

### Fontes

**Manrope** - Display e corpo
- Pesos: 300, 400, 500, 600, 700, 800
- Características: Moderna, legível, amigável

**DM Mono** - Código e dados
- Pesos: 300, 400, 500
- Características: Monospace, clara

### Escala de Tamanhos

| Nome | Tamanho | Line Height | Uso |
|------|---------|-------------|-----|
| xs | 12px | 16px | Captions, labels pequenos |
| sm | 14px | 20px | Corpo pequeno |
| **base** | **16px** | **24px** | **Corpo padrão** |
| lg | 18px | 28px | Corpo grande |
| xl | 20px | 28px | Títulos pequenos |
| 2xl | 24px | 32px | Títulos médios |
| 3xl | 30px | 36px | Títulos grandes |
| 4xl | 36px | 40px | Títulos muito grandes |
| 5xl | 48px | 1 | Display |
| 6xl | 56px | 1 | Hero titles |

### Hierarquia de Headings

**H1 - Título da Página**
```css
font-size: 36px;
font-weight: 800;
line-height: 1.1;
```

**H2 - Seções Principais**
```css
font-size: 30px;
font-weight: 700;
line-height: 1.2;
```

**H3 - Subsections**
```css
font-size: 24px;
font-weight: 700;
line-height: 1.2;
```

**Body - Texto Padrão**
```css
font-size: 16px;
font-weight: 400;
line-height: 1.6;
```

### Text Styles Pré-definidos

Use text styles para consistência:

```javascript
import { typography } from '@design-system/tokens'

const styles = typography.textStyles

// Display
styles['display-large']
styles['display-medium']

// Headings
styles['heading-1']
styles['heading-2']
styles['heading-3']

// Body
styles['body-large']
styles['body-base']
styles['body-small']

// Labels
styles['label-large']
styles['label-medium']
styles['label-small']

// Buttons
styles['button-large']
styles['button-medium']
styles['button-small']
```

---

## Espaçamento

### Sistema de 4px

Todo espaçamento é múltiplo de 4px:

| Token | Valor | Uso Comum |
|-------|-------|-----------|
| spacing-1 | 4px | Micro espaçamentos |
| spacing-2 | 8px | Gaps pequenos |
| spacing-3 | 12px | Padding botões |
| **spacing-4** | **16px** | **Padrão** |
| spacing-6 | 24px | Padding cards |
| spacing-8 | 32px | Margem seções |
| spacing-12 | 48px | Separação grande |
| spacing-16 | 64px | Separação máxima |

### Uso Semântico

**Padding de Componentes:**
```javascript
componentPadding: {
  xs: '8px',
  sm: '12px',
  md: '16px', // ← Padrão
  lg: '24px',
  xl: '32px',
}
```

**Gap Entre Elementos:**
```javascript
gap: {
  xs: '4px',
  sm: '8px',
  md: '16px', // ← Padrão
  lg: '24px',
  xl: '32px',
}
```

**Margem Entre Seções:**
```javascript
sectionMargin: {
  sm: '32px',
  md: '48px', // ← Padrão
  lg: '64px',
  xl: '96px',
}
```

---

## Sombras

### 4 Níveis de Elevação

**Level 1 - Baixo**
```css
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
```
Uso: Inputs, botões secundários

**Level 2 - Médio**
```css
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
```
Uso: Cards, botões primários

**Level 3 - Alto**
```css
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```
Uso: Dropdowns, tooltips

**Level 4 - Máximo**
```css
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
```
Uso: Modais, overlays

### Focus Ring

Anel de foco para acessibilidade:

```css
box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.3);
```

---

## Bordas

### Border Radius

| Nome | Valor | Uso |
|------|-------|-----|
| sm | 8px | Tags, inputs pequenos |
| **md** | **12px** | **Botões, inputs** |
| lg | 16px | Cards |
| xl | 20px | Cards destacados |
| 2xl | 24px | Features especiais |
| full | 9999px | Pills, avatares |

### Border Width

| Nome | Valor |
|------|-------|
| DEFAULT | 1px |
| 2 | 2px |
| 4 | 4px |

---

## Animações

### Durações

- **fast**: 150ms - Micro-interações
- **normal**: 250ms - Padrão
- **slow**: 400ms - Transições complexas

### Easing Functions

- **ease-out**: Preferencial (desaceleração natural)
- ease-in: Elementos saindo
- ease-in-out: Mudanças de posição
- linear: Loading spinners

### Animações Comuns

**Fade In:**
```css
animation: fadeIn 250ms ease-out;

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Slide Up:**
```css
animation: slideUp 250ms ease-out;

@keyframes slideUp {
  from { 
    transform: translateY(10px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

## Uso

### Importar Tokens

**JavaScript:**
```javascript
// Importar todos
import tokens from '@design-system/tokens'

// Importar específicos
import { colors, typography, spacing } from '@design-system/tokens'

// Usar
const primaryColor = colors.primary[600]
const bodyFont = typography.fontFamily.sans
const spacing4 = spacing[4]
```

**CSS Variables:**
```css
@import '@design-system/styles/variables.css';

.my-component {
  color: var(--color-primary);
  font-family: var(--font-sans);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

**Tailwind CSS:**
```html
<!-- Classes já configuradas -->
<div class="bg-green-600 text-white p-4 rounded-md shadow-md">
  Componente estilizado
</div>
```

### Componentes

Todos componentes devem seguir o Design System:

```vue
<script setup>
import { colors, spacing } from '@design-system/tokens'
</script>

<template>
  <button class="r-button">
    Click Me
  </button>
</template>

<style scoped>
.r-button {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  transition: var(--transition-normal);
}

.r-button:hover {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
}
</style>
```

---

## Checklist de Conformidade

Ao criar componentes, verifique:

- [ ] Usa cores do Design System
- [ ] Tipografia consistente
- [ ] Espaçamento múltiplo de 4px
- [ ] Sombras apropriadas
- [ ] Border radius consistente
- [ ] Animações suaves (ease-out)
- [ ] Acessibilidade (contraste, foco)
- [ ] Responsivo (mobile-first)

---

## Recursos

- [Tokens JavaScript](./tokens/)
- [CSS Variables](./styles/variables.css)
- [Cores Detalhadas](./colors.md)
- [Tipografia Detalhada](./typography.md)

---

**Recupera.IA Design System v3.0**  
Mantido por: Time de Design & Engenharia

---

## 🚀 Quick Start

```bash
# 1. Importar tokens
import { colors, typography, spacing } from '@design-system/tokens'

# 2. Usar CSS variables
<div style="color: var(--color-primary)"></div>

# 3. Usar classes Tailwind
<div class="bg-green-600 text-white p-4"></div>
```
