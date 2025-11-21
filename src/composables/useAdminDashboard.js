// composables/useAdminDashboard.js
import { supabase } from "../utils/supabase";
import { ref } from "vue";

export const useAdminDashboard = () => {
  const montlyRevenue = ref("R$ 0,00");
  const monthlyBillings = ref("R$ 0,00");
  const filteredTotalRevenue = ref("R$ 0,00");

  const revenueGrowth = ref("0%");
  const billingGrowth = ref("0%");
  const totalGrowth = ref("0%");

  const historyTotalRevenue = ref("R$ 0,00");
  const averageRecoveryRate = ref("0%");

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const growth = ((current - previous) / previous) * 100;
    return (growth > 0 ? "+" : "") + growth.toFixed(1) + "%";
  };

  const fetchFilteredStats = async (startDate = null, endDate = null, isAllTime = false) => {
    
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : new Date(); 

    let prevStart = null;
    let prevEnd = null;

    if (start && !isAllTime) {
        const duration = end.getTime() - start.getTime();
        prevEnd = new Date(start.getTime()); 
        prevStart = new Date(prevEnd.getTime() - duration);
    }

    const getRevenue = async (s, e) => {
        let q = supabase.from('user_subscriptions').select('total_invested, created_at');
        if (s && e) q = q.gte('created_at', s.toISOString()).lte('created_at', e.toISOString());
        const { data } = await q;
        return data ? data.reduce((acc, curr) => acc + (curr.total_invested || 0), 0) : 0;
    };

    const getCommissions = async (s, e) => {
        let q = supabase.from('opportunities').select('value, created_at').eq('status', 'won');
        if (s && e) q = q.gte('created_at', s.toISOString()).lte('created_at', e.toISOString());
        const { data } = await q;
        return data ? data.reduce((acc, curr) => acc + (curr.value || 0), 0) * 0.20 : 0; // 20% comissão
    };

    const currentRev = await getRevenue(start, end);
    const currentComm = await getCommissions(start, end);

    let prevRev = 0;
    let prevComm = 0;
    
    if (!isAllTime && prevStart) {
        prevRev = await getRevenue(prevStart, prevEnd);
        prevComm = await getCommissions(prevStart, prevEnd);
    }

    montlyRevenue.value = formatCurrency(currentRev);
    monthlyBillings.value = formatCurrency(currentComm);
    filteredTotalRevenue.value = formatCurrency(currentRev + currentComm);

    if (isAllTime) {
        revenueGrowth.value = "-";
        billingGrowth.value = "-";
        totalGrowth.value = "-";
    } else {
        revenueGrowth.value = calculateGrowth(currentRev, prevRev);
        billingGrowth.value = calculateGrowth(currentComm, prevComm);
        totalGrowth.value = calculateGrowth((currentRev + currentComm), (prevRev + prevComm));
    }
  };

  const fetchHistoryStats = async () => {
    const { data: allRevenue } = await supabase.from('user_subscriptions').select('total_invested');
    const { data: allComms } = await supabase.from('opportunities').select('value').eq('status', 'won');

    const valRev = allRevenue ? allRevenue.reduce((acc, curr) => acc + (curr.total_invested || 0), 0) : 0;
    const valComm = allComms ? allComms.reduce((acc, curr) => acc + (curr.value || 0), 0) * 0.20 : 0;
    
    historyTotalRevenue.value = formatCurrency(valRev + valComm);

    const { data: dataRate } = await supabase.from('opportunities').select('status');
    if (dataRate) {
      const earnedSales = dataRate.filter(op => op.status === 'won').length;
      const totalData = dataRate.length;
      const averageRate = totalData > 0 ? (earnedSales / totalData) * 100 : 0;
      averageRecoveryRate.value = averageRate.toFixed(2) + '%';
    }
  };

  return {
    fetchFilteredStats,
    fetchHistoryStats,
    montlyRevenue,
    monthlyBillings,
    filteredTotalRevenue,
    historyTotalRevenue,
    averageRecoveryRate,
    revenueGrowth,
    billingGrowth,
    totalGrowth
  }
}