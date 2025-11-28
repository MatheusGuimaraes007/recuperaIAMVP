import { ref, computed, onMounted } from 'vue';
import { useAdminDashboardStore } from '../stores/useAdminDashboardStore';
import { storeToRefs } from 'pinia';

export const useAdminDashboard = () => {
    const dashboardStore = useAdminDashboardStore();
    const {
        stats,
        formattedStats,
        timelineData,
        leadsDistribution,
        loading
    } = storeToRefs(dashboardStore);

    const selectedFilter = ref('7d');
    const customStartDate = ref('');
    const customEndDate = ref('');
    const showCustomInputs = ref(false);

    const animatedRevenue = ref(0);
    const animatedBillings = ref(0);
    const animatedTotal = ref(0);
    const animatedHistory = ref(0);
    const animatedRings = ref({
        novos: 0,
        engajados: 0,
        qualificados: 0,
        convertidos: 0
    });

    const filtersList = [
        { label: 'Últimos 7 dias', value: '7d' },
        { label: '30 dias', value: '30d' },
        { label: '90 dias', value: '90d' },
        { label: 'Histórico Total', value: 'all' },
        { label: 'Personalizado', value: 'custom' },
    ];

    const filterLabel = computed(() => {
        const labels = {
            '7d': 'Últimos 7 dias',
            '30d': 'Últimos 30 dias',
            '90d': 'Últimos 90 dias',
            'all': 'Todo o período',
            'custom': 'Período selecionado'
        };
        return labels[selectedFilter.value] || 'Neste período';
    });

    const getGrowthColor = (val) => {
        if (!val) return 'text-gray-400';
        if (val.includes('+')) return 'text-metric-green';
        if (val.includes('-') && val !== '-') return 'text-status-error';
        return 'text-gray-400';
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatShortCurrency = (value) => {
        if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`;
        return formatCurrency(value);
    };

    const getCirclePath = (percentage) => {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        return { circumference, offset };
    };

    const animateValue = (start, end, duration, callback) => {
        const startTime = performance.now();
        const range = end - start;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (range * easeOutQuart);

            callback(current);

            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const triggerAnimations = () => {
        animateValue(0, stats.value.monthlyRevenue || 0, 1000, (v) => animatedRevenue.value = v);
        animateValue(0, stats.value.monthlyBillings || 0, 1000, (v) => animatedBillings.value = v);
        animateValue(0, stats.value.totalFilteredRevenue || 0, 1000, (v) => animatedTotal.value = v);
        animateValue(0, stats.value.historyTotalRevenue || 0, 1200, (v) => animatedHistory.value = v);

        if (leadsDistribution.value) {
            animateValue(0, leadsDistribution.value.novos || 0, 1000, (v) => animatedRings.value.novos = v);
            animateValue(0, leadsDistribution.value.engajados || 0, 1200, (v) => animatedRings.value.engajados = v);
            animateValue(0, leadsDistribution.value.qualificados || 0, 1400, (v) => animatedRings.value.qualificados = v);
            animateValue(0, leadsDistribution.value.convertidos || 0, 1600, (v) => animatedRings.value.convertidos = v);
        }
    };

    const applyFilter = async (filterType) => {
        selectedFilter.value = filterType;
        let start = null;
        let end = new Date().toISOString();
        const now = new Date();
        let isAllTime = false;

        if (filterType === '7d') {
            const date = new Date();
            date.setDate(now.getDate() - 7);
            start = date.toISOString();
            showCustomInputs.value = false;
        } else if (filterType === '30d') {
            const date = new Date();
            date.setDate(now.getDate() - 30);
            start = date.toISOString();
            showCustomInputs.value = false;
        } else if (filterType === '90d') {
            const date = new Date();
            date.setDate(now.getDate() - 90);
            start = date.toISOString();
            showCustomInputs.value = false;
        } else if (filterType === 'all') {
            start = null;
            isAllTime = true;
            showCustomInputs.value = false;
        } else if (filterType === 'custom') {
            showCustomInputs.value = true;
            return;
        }

        const filtersObj = { startDate: start, endDate: end, isAllTime };

        await Promise.all([
            dashboardStore.fetchDashboardStats(filtersObj),
            dashboardStore.fetchTimeline(filtersObj),
            dashboardStore.fetchDistribution()
        ]);

        triggerAnimations();
    };

    const applyCustomFilter = async () => {
        if (customStartDate.value && customEndDate.value) {
            let end = new Date(customEndDate.value);
            end.setHours(23, 59, 59, 999);
            const start = new Date(customStartDate.value).toISOString();
            const endISO = end.toISOString();

            const filtersObj = { startDate: start, endDate: endISO, isAllTime: false };

            await Promise.all([
                dashboardStore.fetchDashboardStats(filtersObj),
                dashboardStore.fetchTimeline(filtersObj),
                dashboardStore.fetchDistribution()
            ]);

            triggerAnimations();
        }
    };

    onMounted(async () => {
        await applyFilter('7d');
    });

    return {
        formattedStats,
        timelineData,
        loading,

        selectedFilter,
        customStartDate,
        customEndDate,
        showCustomInputs,
        filtersList,
        filterLabel,

        animatedRevenue,
        animatedBillings,
        animatedTotal,
        animatedHistory,
        animatedRings,

        applyFilter,
        applyCustomFilter,
        getGrowthColor,
        formatCurrency,
        formatShortCurrency,
        getCirclePath
    };
};