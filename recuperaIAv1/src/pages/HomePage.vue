<script setup>
/**
 * HomePage - Visualização de Componentes
 * 
 * Showcase de todos os Atoms e Molecules implementados
 */

import { ref } from 'vue'
import { toast } from 'vue-sonner'

// Atoms - Buttons
import RButton from '@components/atoms/buttons/RButton.vue'
import RIconButton from '@components/atoms/buttons/RIconButton.vue'
import RButtonGroup from '@components/atoms/buttons/RButtonGroup.vue'

// Atoms - Inputs
import RInput from '@components/atoms/inputs/RInput.vue'
import RTextarea from '@components/atoms/inputs/RTextArea.vue'
import RCheckbox from '@components/atoms/inputs/RCheckbox.vue'
import RRadio from '@components/atoms/inputs/RRadio.vue'
import RSwitch from '@components/atoms/inputs/RSwitch.vue'

// Atoms - Typography
import RHeading from '@components/atoms/typography/RHeading.vue'
import RText from '@components/atoms/typography/RText.vue'
import RCode from '@components/atoms/typography/RCode.vue'
import RLink from '@components/atoms/typography/RLink.vue'

// Atoms - Feedback
import RSpinner from '@components/atoms/feedback/RSpinner.vue'
import RBadge from '@components/atoms/feedback/RBadge.vue'
import RAvatar from '@components/atoms/feedback/RAvatar.vue'
import RProgress from '@components/atoms/feedback/RProgress.vue'
import RStatusDot from '@components/atoms/feedback/RStatusDot.vue'

// Atoms - Layout
import RDivider from '@components/atoms/layout/RDivider.vue'
import RContainer from '@components/atoms/layout/RContainer.vue'

// Molecules
import RCard from '@components/molecules/cards/RCard.vue'
import RSearchBar from '@components/molecules/forms/RSearchBar.vue'

// State
const searchQuery = ref('')
const inputValue = ref('')
const textareaValue = ref('')
const checkboxValue = ref(false)
const radioValue = ref('option1')
const switchValue = ref(false)
const progressValue = ref(65)

// Handlers
const handleSearch = (query) => {
  toast.success(`Buscando por: ${query}`)
}

const handleButtonClick = (variant) => {
  toast.info(`Botão ${variant} clicado!`, {
    description: 'Componente RButton funcionando perfeitamente'
  })
}

const handleCardClick = () => {
  toast('Card clicado!', {
    action: {
      label: 'Desfazer',
      onClick: () => toast.info('Ação desfeita')
    }
  })
}
</script>

<template>
  <div class="demo-page">
    <!-- Header -->
    <div class="demo-header">
      <RContainer>
        <div class="demo-header__content">
          <div>
            <RHeading level="1" color="primary">
              🎨 Recupera.IA Design System
            </RHeading>
            <RText size="lg" color="secondary" class="mt-2">
              Visualização de componentes Atoms e Molecules
            </RText>
          </div>
          
          <div class="demo-header__badges">
            <RBadge variant="success">v3.0.0</RBadge>
            <RBadge variant="info">28 Atoms</RBadge>
            <RBadge variant="primary">15+ Molecules</RBadge>
          </div>
        </div>
      </RContainer>
    </div>

    <RContainer class="demo-content">
      <!-- Search Bar Demo -->
      <section class="demo-section">
        <RHeading level="2">🔍 Search Bar</RHeading>
        <RText color="secondary" class="mb-4">Molecule: RSearchBar</RText>
        <RSearchBar
          v-model="searchQuery"
          placeholder="Buscar componentes..."
          @search="handleSearch"
        />
      </section>

      <RDivider />

      <!-- Buttons -->
      <section class="demo-section">
        <RHeading level="2">🔘 Buttons</RHeading>
        <RText color="secondary" class="mb-4">Atom: RButton</RText>
        
        <div class="demo-group">
          <RText weight="semibold" class="mb-2">Variantes:</RText>
          <RButtonGroup spacing="md">
            <RButton variant="primary" @click="handleButtonClick('primary')">
              Primary
            </RButton>
            <RButton variant="secondary" @click="handleButtonClick('secondary')">
              Secondary
            </RButton>
            <RButton variant="outline" @click="handleButtonClick('outline')">
              Outline
            </RButton>
            <RButton variant="ghost" @click="handleButtonClick('ghost')">
              Ghost
            </RButton>
            <RButton variant="danger" @click="handleButtonClick('danger')">
              Danger
            </RButton>
          </RButtonGroup>
        </div>

        <div class="demo-group">
          <RText weight="semibold" class="mb-2">Tamanhos:</RText>
          <RButtonGroup spacing="md">
            <RButton size="sm">Small</RButton>
            <RButton size="md">Medium</RButton>
            <RButton size="lg">Large</RButton>
          </RButtonGroup>
        </div>

        <div class="demo-group">
          <RText weight="semibold" class="mb-2">Estados:</RText>
          <RButtonGroup spacing="md">
            <RButton :loading="true">Loading</RButton>
            <RButton :disabled="true">Disabled</RButton>
            <RButton icon-left="👈">With Icon</RButton>
          </RButtonGroup>
        </div>

        <div class="demo-group">
          <RText weight="semibold" class="mb-2">Icon Buttons:</RText>
          <RButtonGroup spacing="sm">
            <RIconButton variant="primary" aria-label="Settings">⚙️</RIconButton>
            <RIconButton variant="secondary" aria-label="Search">🔍</RIconButton>
            <RIconButton variant="ghost" aria-label="Menu">☰</RIconButton>
          </RButtonGroup>
        </div>
      </section>

      <RDivider />

      <!-- Inputs -->
      <section class="demo-section">
        <RHeading level="2">📝 Inputs</RHeading>
        <RText color="secondary" class="mb-4">Atoms: RInput, RTextarea, RCheckbox, RRadio, RSwitch</RText>
        
        <div class="demo-grid">
          <div>
            <RInput
              v-model="inputValue"
              label="Nome completo"
              placeholder="Digite seu nome..."
              help-text="Como você gostaria de ser chamado?"
              required
            />
          </div>

          <div>
            <RInput
              v-model="inputValue"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              icon-left="📧"
            />
          </div>

          <div>
            <RTextarea
              v-model="textareaValue"
              label="Mensagem"
              placeholder="Digite sua mensagem..."
              :rows="4"
            />
          </div>

          <div class="demo-checks">
            <RCheckbox v-model="checkboxValue" label="Aceito os termos" />
            
            <div>
              <RText weight="medium" size="sm" class="mb-2">Escolha uma opção:</RText>
              <div class="space-y-2">
                <RRadio v-model="radioValue" value="option1" name="demo-radio" label="Opção 1" />
                <RRadio v-model="radioValue" value="option2" name="demo-radio" label="Opção 2" />
                <RRadio v-model="radioValue" value="option3" name="demo-radio" label="Opção 3" />
              </div>
            </div>

            <RSwitch v-model="switchValue" label="Notificações ativadas" />
          </div>
        </div>
      </section>

      <RDivider />

      <!-- Typography -->
      <section class="demo-section">
        <RHeading level="2">📖 Typography</RHeading>
        <RText color="secondary" class="mb-4">Atoms: RHeading, RText, RCode, RLink</RText>
        
        <div class="space-y-4">
          <div>
            <RHeading level="1">Heading 1 - Extra Large</RHeading>
            <RHeading level="2">Heading 2 - Large</RHeading>
            <RHeading level="3">Heading 3 - Medium</RHeading>
            <RHeading level="4">Heading 4 - Small</RHeading>
          </div>

          <div class="space-y-2">
            <RText size="lg">Large text - Ideal para introduções e destaques</RText>
            <RText size="base">Base text - Tamanho padrão para corpo de texto</RText>
            <RText size="sm" color="secondary">Small text - Textos secundários e legendas</RText>
          </div>

          <div>
            <RText>
              Exemplo de texto com <RCode>código inline</RCode> e um 
              <RLink href="https://recupera.ia" :external="true">link externo</RLink>.
            </RText>
          </div>
        </div>
      </section>

      <RDivider />

      <!-- Feedback -->
      <section class="demo-section">
        <RHeading level="2">💫 Feedback</RHeading>
        <RText color="secondary" class="mb-4">Atoms: RSpinner, RBadge, RAvatar, RProgress, RStatusDot</RText>
        
        <div class="demo-grid">
          <div>
            <RText weight="semibold" class="mb-2">Spinners:</RText>
            <div class="flex items-center gap-4">
              <RSpinner size="sm" />
              <RSpinner size="md" />
              <RSpinner size="lg" />
              <RSpinner size="xl" />
            </div>
          </div>

          <div>
            <RText weight="semibold" class="mb-2">Badges:</RText>
            <div class="flex flex-wrap gap-2">
              <RBadge variant="primary">Primary</RBadge>
              <RBadge variant="success">Success</RBadge>
              <RBadge variant="warning">Warning</RBadge>
              <RBadge variant="error">Error</RBadge>
              <RBadge variant="info">Info</RBadge>
              <RBadge :pill="true">Pill Badge</RBadge>
            </div>
          </div>

          <div>
            <RText weight="semibold" class="mb-2">Avatars:</RText>
            <div class="flex items-center gap-2">
              <RAvatar name="João Silva" size="sm" />
              <RAvatar name="Maria Santos" size="md" />
              <RAvatar name="Pedro Costa" size="lg" />
              <RAvatar name="Ana Oliveira" size="xl" />
            </div>
          </div>

          <div>
            <RText weight="semibold" class="mb-2">Progress:</RText>
            <RProgress :value="progressValue" :show-label="true" size="md" variant="primary" />
            <RProgress :value="85" size="sm" variant="success" class="mt-2" />
          </div>

          <div>
            <RText weight="semibold" class="mb-2">Status Dots:</RText>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <RStatusDot status="success" :pulse="true" />
                <RText size="sm">Online</RText>
              </div>
              <div class="flex items-center gap-2">
                <RStatusDot status="warning" />
                <RText size="sm">Away</RText>
              </div>
              <div class="flex items-center gap-2">
                <RStatusDot status="error" />
                <RText size="sm">Offline</RText>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RDivider />

      <!-- Cards -->
      <section class="demo-section">
        <RHeading level="2">🃏 Cards</RHeading>
        <RText color="secondary" class="mb-4">Molecule: RCard</RText>
        
        <div class="demo-cards-grid">
          <RCard
            title="Card Simples"
            subtitle="Com título e conteúdo"
          >
            <RText>
              Este é um card básico com título, subtítulo e conteúdo.
              Perfeito para exibir informações organizadas.
            </RText>
          </RCard>

          <RCard
            title="Card Interativo"
            subtitle="Clique para testar"
            :clickable="true"
            :hoverable="true"
            @click="handleCardClick"
          >
            <template #actions>
              <RBadge variant="info" size="sm">New</RBadge>
            </template>
            
            <RText>
              Este card tem efeito hover e é clicável.
              Experimente passar o mouse e clicar!
            </RText>

            <template #footer>
              <RButton size="sm" variant="outline">Cancelar</RButton>
              <RButton size="sm" variant="primary">Confirmar</RButton>
            </template>
          </RCard>

          <RCard padding="lg">
            <template #header>
              <div class="flex items-center gap-3">
                <RAvatar name="Maria Santos" size="md" />
                <div>
                  <RHeading level="5">Maria Santos</RHeading>
                  <RText size="sm" color="secondary">Designer UI/UX</RText>
                </div>
              </div>
            </template>

            <RText>
              Card com header customizado usando slots.
              Ideal para perfis de usuário e cards personalizados.
            </RText>
          </RCard>
        </div>
      </section>

      <!-- Footer -->
      <div class="demo-footer">
        <RDivider />
        <div class="demo-footer__content">
          <RText color="secondary" align="center">
            Feito com Vue 3 + Vite + Tailwind CSS
          </RText>
          <RText size="sm" color="tertiary" align="center">
            Recupera.IA Design System v3.0 • 2026
          </RText>
        </div>
      </div>
    </RContainer>
  </div>
</template>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, var(--color-primary-50) 0%, var(--bg-secondary) 300px);
  padding-bottom: var(--spacing-16);
}

.demo-header {
  padding: var(--spacing-12) 0 var(--spacing-8);
  margin-bottom: var(--spacing-8);
}

.demo-header__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.demo-header__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.demo-content {
  padding-top: var(--spacing-8);
}

.demo-section {
  margin-bottom: var(--spacing-12);
}

.demo-group {
  margin-bottom: var(--spacing-6);
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.demo-checks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.demo-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.demo-footer {
  margin-top: var(--spacing-16);
}

.demo-footer__content {
  padding-top: var(--spacing-8);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

/* Utilities */
.mt-2 { margin-top: var(--spacing-2); }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mt-2 { margin-top: var(--spacing-2); }

.space-y-2 > * + * { margin-top: var(--spacing-2); }
.space-y-4 > * + * { margin-top: var(--spacing-4); }

.flex { display: flex; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.gap-2 { gap: var(--spacing-2); }
.gap-3 { gap: var(--spacing-3); }
.gap-4 { gap: var(--spacing-4); }

@media (min-width: 768px) {
  .demo-header__content {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}
</style>
