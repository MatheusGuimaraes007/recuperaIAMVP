import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useGuaranteeStore } from '../stores/useGuaranteeStore.js';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getDaysDifference } from '../utils/date';

export const useGuarantee = () => {
    const guaranteeStore = useGuaranteeStore();

    const {
        guarantee,
        loading,
        error
    } = storeToRefs(guaranteeStore);

    const {
        fetchActiveGuarantee,
        clearError
    } = guaranteeStore;

    const guaranteeStatusConfig = computed(() => {
        if (!guarantee.value) return null;

        const configs = {
            active: {
                label: 'Ativa',
                color: 'var(--color-primary)',
                bgColor: 'rgba(99, 102, 241, 0.1)',
                icon: '⏱️'
            },
            achieved: {
                label: 'Meta Atingida',
                color: '#10b981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                icon: '✅'
            },
            failed: {
                label: 'Não Atingida',
                color: '#ef4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                icon: '❌'
            },
            claimed: {
                label: 'Reembolso Solicitado',
                color: '#f59e0b',
                bgColor: 'rgba(245, 158, 11, 0.1)',
                icon: '📩'
            },
            refunded: {
                label: 'Reembolsado',
                color: '#6b7280',
                bgColor: 'rgba(107, 114, 128, 0.1)',
                icon: '💰'
            }
        };

        return configs[guarantee.value.status] || configs.active;
    });

    const daysRemaining = computed(() => {
        if (!guarantee.value) return 0;

        const today = new Date();
        const endDate = new Date(guarantee.value.end_date);
        const days = getDaysDifference(today.toISOString(), endDate.toISOString());

        return Math.max(0, days);
    });

    const totalDays = computed(() => {
        if (!guarantee.value) return 0;

        const startDate = new Date(guarantee.value.start_date);
        const endDate = new Date(guarantee.value.end_date);

        return getDaysDifference(startDate.toISOString(), endDate.toISOString());
    });

    const daysSinceStart = computed(() => {
        if (!guarantee.value) return 0;

        const today = new Date();
        const startDate = new Date(guarantee.value.start_date);
        const days = getDaysDifference(startDate.toISOString(), today.toISOString());

        return Math.max(0, days);
    });

    const progressPercentage = computed(() => {
        if (!guarantee.value) return 0;
        return parseFloat(guarantee.value.progress_percentage || 0);
    });

    const remainingAmount = computed(() => {
        if (!guarantee.value) return 0;

        const goal = parseFloat(guarantee.value.goal_amount || 0);
        const recovered = parseFloat(guarantee.value.current_recovered_amount || 0);

        return Math.max(0, goal - recovered);
    });

    const roi = computed(() => {
        if (!guarantee.value) return 0;

        const recovered = parseFloat(guarantee.value.current_recovered_amount || 0);
        const investment = parseFloat(guarantee.value.investment_90days || 0);

        if (investment === 0) return 0;

        const roiValue = ((recovered - investment) / investment) * 100;

        return roiValue;
    });

    const isInAlert = computed(() => {
        if (!guarantee.value || guarantee.value.status !== 'active') return false;

        return daysRemaining.value <= 30 && progressPercentage.value < 70;
    });

    const isCritical = computed(() => {
        if (!guarantee.value || guarantee.value.status !== 'active') return false;

        return daysRemaining.value <= 15 && progressPercentage.value < 50;
    });

    const isGracePeriod = computed(() => {
        if (!guarantee.value) return false;

        const daysElapsed = daysSinceStart.value;
        return daysElapsed > 90 && daysElapsed <= 97;
    });

    const showGuarantee = computed(() => {
        if (!guarantee.value) return false;

        const daysElapsed = daysSinceStart.value;

        if (daysElapsed <= 90) return true;

        if (daysElapsed > 90 && daysElapsed <= 97) {
            return guarantee.value.status === 'achieved' || progressPercentage.value >= 100;
        }

        return false;
    });

    const statusMessage = computed(() => {
        if (!guarantee.value) return '';

        const status = guarantee.value.status;
        const progress = progressPercentage.value;
        const days = daysRemaining.value;

        if (isGracePeriod.value) {
            if (status === 'achieved' || progress >= 100) {
                return 'Parabéns! Você atingiu a meta da garantia. Este painel ficará disponível por mais alguns dias.';
            }
        }

        if (status === 'achieved') {
            return 'Parabéns! Você atingiu a meta da garantia.';
        }

        if (status === 'failed') {
            return 'A garantia expirou sem atingir a meta. Entre em contato para solicitar reembolso.';
        }

        if (status === 'claimed') {
            return 'Seu reembolso está sendo processado.';
        }

        if (status === 'refunded') {
            return 'Reembolso concluído com sucesso.';
        }

        if (isCritical.value) {
            return `Atenção: restam apenas ${days} dias e você está ${progress.toFixed(1)}% da meta!`;
        }

        if (isInAlert.value) {
            return `Atenção: você tem ${days} dias para atingir mais ${(100 - progress).toFixed(1)}% da meta.`;
        }

        if (progress >= 100) {
            return 'Meta atingida! Continue assim!';
        }

        if (progress >= 70) {
            return `Ótimo progresso! Você está a ${(100 - progress).toFixed(1)}% da meta.`;
        }

        return `Você tem ${days} dias para recuperar mais ${formatCurrency(remainingAmount.value)}.`;
    });

    const progressBarColor = computed(() => {
        if (!guarantee.value || guarantee.value.status !== 'active') {
            return guaranteeStatusConfig.value?.color || 'var(--color-primary)';
        }

        const progress = progressPercentage.value;

        if (isCritical.value) return '#ef4444';
        if (isInAlert.value) return '#f59e0b';
        if (progress >= 100) return '#10b981';
        if (progress >= 70) return '#3b82f6';

        return 'var(--color-primary)';
    });

    const hasActiveGuarantee = computed(() => {
        return guarantee.value !== null && guarantee.value.status === 'active';
    });

    return {
        guarantee,
        loading,
        error,

        guaranteeStatusConfig,
        daysRemaining,
        totalDays,
        progressPercentage,
        remainingAmount,
        isInAlert,
        isCritical,
        statusMessage,
        progressBarColor,
        hasActiveGuarantee,
        showGuarantee,
        isGracePeriod,
        roi,

        fetchActiveGuarantee,
        clearError,

        formatCurrency,
        formatDate
    };
};