<template>
  <div class="r-auth-layout">
    <!-- Background Pattern (opcional) -->
    <div class="auth-background"></div>

    <!-- Container Principal -->
    <div class="auth-container">
      <div class="auth-card-wrapper">
        <!-- Logo Section -->
        <div class="auth-logo-section">
          <RLogo class="auth-logo" />
        </div>

        <!-- Card Principal -->
        <RCard class="auth-card" elevation="lg">
          <!-- Botão Voltar (opcional) -->
          <button
              v-if="showBackButton"
              @click="handleBack"
              class="back-button"
              type="button"
              :disabled="disabled"
          >
            <RIcon name="arrow-left" :size="20" />
            <span class="back-text">Voltar</span>
          </button>

          <!-- Header -->
          <div class="auth-header">
            <slot name="header" />
          </div>

          <!-- Content -->
          <div class="auth-content">
            <slot name="content" />
          </div>

          <!-- Footer (dentro do card) -->
          <div v-if="$slots['card-footer']" class="auth-card-footer">
            <slot name="card-footer" />
          </div>
        </RCard>

        <!-- Footer (fora do card) -->
        <div v-if="$slots.footer" class="auth-footer">
          <slot name="footer" />
        </div>

        <!-- Copyright -->
        <div class="auth-copyright">
          <RText size="xs" class="copyright-text">
            © {{ currentYear }} Recupera.IA. Todos os direitos reservados.
          </RText>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// Components
import RCard from '@/components/atoms/layout/RCard.vue'
import RLogo from '@/components/atoms/icons/RLogo.vue'
import RIcon from '@/components/atoms/icons/RIcon.vue'
import RText from '@/components/atoms/typography/RText.vue'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  /**
   * Exibir botão voltar
   */
  showBackButton: {
    type: Boolean,
    default: false
  },

  /**
   * Rota de volta customizada
   */
  backRoute: {
    type: [String, Object],
    default: '/login'
  },

  /**
   * Desabilitar interações
   */
  disabled: {
    type: Boolean,
    default: false
  }
})

// ============================================================================
// SETUP
// ============================================================================

const router = useRouter()

// ============================================================================
// COMPUTED
// ============================================================================

const currentYear = computed(() => new Date().getFullYear())

// ============================================================================
// METHODS
// ============================================================================

/**
 * Handler do botão voltar
 */
const handleBack = () => {
  if (props.disabled) return

  if (typeof props.backRoute === 'string') {
    router.push(props.backRoute)
  } else {
    router.push(props.backRoute)
  }
}
</script>

<style scoped>
/* =============================================================================
   LAYOUT BASE
   ============================================================================= */

.r-auth-layout {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  background: linear-gradient(
      135deg,
      var(--bg-secondary) 0%,
      var(--bg-primary) 100%
  );
}

/* Background Pattern */
.auth-background {
  position: absolute;
  inset: 0;
  background-image:
      radial-gradient(circle at 25% 25%, rgba(0, 200, 83, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(0, 200, 83, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

/* =============================================================================
   CONTAINER
   ============================================================================= */

.auth-container {
  position: relative;
  width: 100%;
  max-width: 480px;
  z-index: 1;
}

.auth-card-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  animation: fadeInUp var(--duration-normal) var(--easing-out);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =============================================================================
   LOGO SECTION
   ============================================================================= */

.auth-logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
}

.auth-logo {
  width: 64px;
  height: 64px;
  transition: var(--transition-normal);
}

.auth-logo:hover {
  transform: scale(1.05);
}

.brand-text {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: var(--letter-spacing-tight);
  user-select: none;
}

.brand-name {
  color: var(--text-primary);
}

.brand-highlight {
  color: var(--color-primary);
}

/* =============================================================================
   CARD
   ============================================================================= */

.auth-card {
  position: relative;
  padding: var(--spacing-8);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-light);
  backdrop-filter: blur(10px);
}

/* Back Button */
.back-button {
  position: absolute;
  top: var(--spacing-6);
  left: var(--spacing-6);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-fast);
  z-index: 10;
}

.back-button:hover:not(:disabled) {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  transform: translateX(-2px);
}

.back-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-text {
  font-family: var(--font-sans);
}

/* Header */
.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}

/* Content */
.auth-content {
  /* Espaçamento gerenciado pelos componentes filhos */
}

/* Card Footer */
.auth-card-footer {
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--border-light);
}

/* =============================================================================
   FOOTER (fora do card)
   ============================================================================= */

.auth-footer {
  text-align: center;
}

/* =============================================================================
   COPYRIGHT
   ============================================================================= */

.auth-copyright {
  text-align: center;
}

.copyright-text {
  color: var(--text-tertiary);
}

/* =============================================================================
   RESPONSIVE
   ============================================================================= */

/* Tablet */
@media (max-width: 768px) {
  .r-auth-layout {
    padding: var(--spacing-3);
  }

  .auth-card {
    padding: var(--spacing-6);
  }

  .back-button {
    top: var(--spacing-4);
    left: var(--spacing-4);
  }

  .brand-text {
    font-size: var(--font-size-3xl);
  }
}

/* Mobile */
@media (max-width: 640px) {
  .r-auth-layout {
    padding: var(--spacing-2);
  }

  .auth-card-wrapper {
    gap: var(--spacing-6);
  }

  .auth-logo {
    width: 48px;
    height: 48px;
  }

  .brand-text {
    font-size: var(--font-size-2xl);
  }

  .auth-card {
    padding: var(--spacing-5);
  }

  .back-button {
    top: var(--spacing-3);
    left: var(--spacing-3);
    padding: var(--spacing-1) var(--spacing-2);
  }

  .back-text {
    display: none; /* Esconder texto em mobile */
  }

  .auth-header {
    margin-bottom: var(--spacing-5);
  }
}

/* Mobile Small */
@media (max-width: 375px) {
  .auth-card {
    padding: var(--spacing-4);
  }
}

/* =============================================================================
   DARK MODE (Preparado para futuro)
   ============================================================================= */

@media (prefers-color-scheme: dark) {
  /* Dark mode variables podem ser adicionadas aqui */
}

/* =============================================================================
   PRINT
   ============================================================================= */

@media print {
  .r-auth-layout {
    background: white;
  }

  .auth-background {
    display: none;
  }

  .back-button,
  .auth-footer,
  .auth-copyright {
    display: none;
  }
}

/* =============================================================================
   ACCESSIBILITY
   ============================================================================= */

/* Focus visible para navegação por teclado */
.back-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Reduce motion para usuários com preferência */
@media (prefers-reduced-motion: reduce) {
  .auth-card-wrapper {
    animation: none;
  }

  .auth-logo:hover {
    transform: none;
  }

  .back-button:hover:not(:disabled) {
    transform: none;
  }

  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>