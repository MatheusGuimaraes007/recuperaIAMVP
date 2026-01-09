/**
 * TanStack Query Hooks - Dashboard
 */

import { useQuery } from '@tanstack/vue-query'
import dashboardService from '@/api/services/DashboardService'

export const dashboardKeys = {
  all: ['dashboard'],
  metrics: (userId) => [...dashboardKeys.all, 'metrics', userId],
  timeline: (period, userId) => [...dashboardKeys.all, 'timeline', period, userId],
  byType: (userId) => [...dashboardKeys.all, 'by-type', userId],
  lostReasons: (userId) => [...dashboardKeys.all, 'lost-reasons', userId],
  topAgents: (limit, userId) => [...dashboardKeys.all, 'top-agents', limit, userId]
}

export function useDashboardMetrics(userId = null) {
  return useQuery({
    queryKey: dashboardKeys.metrics(userId),
    queryFn: () => dashboardService.getDashboardMetrics(userId),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000
  })
}

export function useMetricsTimeline(period = 'week', userId = null) {
  return useQuery({
    queryKey: dashboardKeys.timeline(period, userId),
    queryFn: () => dashboardService.getMetricsTimeline(period, userId),
    staleTime: 5 * 60 * 1000
  })
}

export function useOpportunitiesByType(userId = null) {
  return useQuery({
    queryKey: dashboardKeys.byType(userId),
    queryFn: () => dashboardService.getOpportunitiesByType(userId),
    staleTime: 5 * 60 * 1000
  })
}

export function useLostReasonsDistribution(userId = null) {
  return useQuery({
    queryKey: dashboardKeys.lostReasons(userId),
    queryFn: () => dashboardService.getLostReasonsDistribution(userId),
    staleTime: 5 * 60 * 1000
  })
}

export function useTopAgents(limit = 10, userId = null) {
  return useQuery({
    queryKey: dashboardKeys.topAgents(limit, userId),
    queryFn: () => dashboardService.getTopAgents(limit, userId),
    staleTime: 5 * 60 * 1000
  })
}
