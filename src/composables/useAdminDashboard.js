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

  const timelineData = ref([]);
  const leadsDistribution = ref({
    novos: 0,
    engajados: 0,
    qualificados: 0,
    convertidos: 0
  });

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
        return data ? data.reduce((acc, curr) => acc + (curr.value || 0), 0) * 0.20 : 0;
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

  const fetchTimelineData = async (startDate = null, endDate = null) => {
    try {
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const { data: revenues, error: revError } = await supabase
        .from('user_subscriptions')
        .select('total_invested, created_at')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true });

      if (revError) {
        console.error('Erro ao buscar receitas:', revError);
      }

      const { data: commissions, error: commError } = await supabase
        .from('opportunities')
        .select('value, created_at')
        .eq('status', 'won')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true });

      if (commError) {
        console.error('Erro ao buscar comissões:', commError);
      }

      const dailyData = {};
      
      const addToDay = (dateStr, value) => {
        const day = dateStr.split('T')[0];
        if (!dailyData[day]) dailyData[day] = 0;
        dailyData[day] += value;
      };

      if (revenues && revenues.length > 0) {
        revenues.forEach(r => addToDay(r.created_at, r.total_invested || 0));
      }

      if (commissions && commissions.length > 0) {
        commissions.forEach(c => addToDay(c.created_at, (c.value || 0) * 0.20));
      }

      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const timeline = [];
      for (let i = 0; i <= diffDays; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const dayStr = date.toISOString().split('T')[0];
        
        timeline.push({
          date: new Intl.DateFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date),
          value: dailyData[dayStr] || 0
        });
      }

      timelineData.value = timeline;

    } catch (error) {
      console.error('Erro fatal no fetchTimelineData:', error);
      timelineData.value = [];
    }
  };

  const fetchLeadsDistribution = async () => {
    try {

      const { data: opportunities, error } = await supabase
        .from('opportunities')
        .select('status');

      if (error) {
        console.error('Erro ao buscar opportunities:', error);
        leadsDistribution.value = {
          novos: 20,
          engajados: 30,
          qualificados: 25,
          convertidos: 25
        };
        return;
      }

      if (!opportunities || opportunities.length === 0) {
        leadsDistribution.value = {
          novos: 25,
          engajados: 30,
          qualificados: 20,
          convertidos: 25
        };
        return;
      }

      const total = opportunities.length;

      const statusCount = {
        active: 0,
        lost: 0,
        paused: 0,
        won: 0
      };

      opportunities.forEach(opp => {
        const status = opp.status?.toLowerCase() || 'active';
        if (statusCount.hasOwnProperty(status)) {
          statusCount[status]++;
        } else {
          statusCount.active++;
        }
      });


      const distribution = {
        novos: ((statusCount.active / total) * 100) || 0,
        engajados: ((statusCount.lost / total) * 100) || 0,
        qualificados: ((statusCount.paused / total) * 100) || 0,
        convertidos: ((statusCount.won / total) * 100) || 0
      };

      leadsDistribution.value = distribution;

    } catch (error) {
      console.error('Erro fatal no fetchLeadsDistribution:', error);
      leadsDistribution.value = {
        novos: 25,
        engajados: 25,
        qualificados: 25,
        convertidos: 25
      };
    }
  };

  return {
    fetchFilteredStats,
    fetchHistoryStats,
    fetchTimelineData,
    fetchLeadsDistribution,
    montlyRevenue,
    monthlyBillings,
    filteredTotalRevenue,
    historyTotalRevenue,
    averageRecoveryRate,
    revenueGrowth,
    billingGrowth,
    totalGrowth,
    timelineData,
    leadsDistribution
  }
}