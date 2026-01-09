/**
 * TanStack Query Hooks - Opportunities
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { toast } from 'vue-sonner'
import opportunitiesService, { OPPORTUNITY_STATUS } from '@/api/services/OpportunitiesService'
import { contactsKeys } from './contacts.js'

// ============================================================================
// QUERY KEYS
// ============================================================================

export const opportunitiesKeys = {
  all: ['opportunities'],
  lists: () => [...opportunitiesKeys.all, 'list'],
  list: (filters) => [...opportunitiesKeys.lists(), filters],
  details: () => [...opportunitiesKeys.all, 'detail'],
  detail: (id) => [...opportunitiesKeys.details(), id],
  byStatus: (status) => [...opportunitiesKeys.all, 'by-status', status],
  byContact: (contactId) => [...opportunitiesKeys.all, 'by-contact', contactId],
  byAgent: (agentId) => [...opportunitiesKeys.all, 'by-agent', agentId],
  byProduct: (productId) => [...opportunitiesKeys.all, 'by-product', productId],
  byType: (type) => [...opportunitiesKeys.all, 'by-type', type],
  metrics: () => [...opportunitiesKeys.all, 'metrics'],
  today: () => [...opportunitiesKeys.all, 'today'],
  recentlyClosed: (days) => [...opportunitiesKeys.all, 'recently-closed', days]
}

// ============================================================================
// QUERIES
// ============================================================================

export function useOpportunities(filters = {}) {
  return useQuery({
    queryKey: opportunitiesKeys.list(filters),
    queryFn: () => opportunitiesService.listOpportunities(filters),
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useOpportunity(opportunityId) {
  return useQuery({
    queryKey: opportunitiesKeys.detail(opportunityId),
    queryFn: () => opportunitiesService.getOpportunityById(opportunityId),
    enabled: !!opportunityId,
    staleTime: 2 * 60 * 1000
  })
}

export function useActiveOpportunities() {
  return useQuery({
    queryKey: opportunitiesKeys.byStatus(OPPORTUNITY_STATUS.ACTIVE),
    queryFn: () => opportunitiesService.getActiveOpportunities(),
    staleTime: 3 * 60 * 1000
  })
}

export function useWonOpportunities() {
  return useQuery({
    queryKey: opportunitiesKeys.byStatus(OPPORTUNITY_STATUS.WON),
    queryFn: () => opportunitiesService.getWonOpportunities(),
    staleTime: 5 * 60 * 1000
  })
}

export function useOpportunitiesByContact(contactId) {
  return useQuery({
    queryKey: opportunitiesKeys.byContact(contactId),
    queryFn: () => opportunitiesService.getOpportunitiesByContact(contactId),
    enabled: !!contactId,
    staleTime: 3 * 60 * 1000
  })
}

export function useOpportunitiesByAgent(agentId) {
  return useQuery({
    queryKey: opportunitiesKeys.byAgent(agentId),
    queryFn: () => opportunitiesService.getOpportunitiesByAgent(agentId),
    enabled: !!agentId,
    staleTime: 3 * 60 * 1000
  })
}

export function useOpportunitiesMetrics(filters = {}) {
  return useQuery({
    queryKey: [...opportunitiesKeys.metrics(), filters],
    queryFn: () => opportunitiesService.getMetrics(filters),
    staleTime: 5 * 60 * 1000
  })
}

export function useTodaysOpportunities() {
  return useQuery({
    queryKey: opportunitiesKeys.today(),
    queryFn: () => opportunitiesService.getTodaysOpportunities(),
    staleTime: 1 * 60 * 1000,
    refetchInterval: 60 * 1000
  })
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateOpportunity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => opportunitiesService.createOpportunity(data),
    onSuccess: (newOpp) => {
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.metrics() })
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(newOpp.contact_id) })
      toast.success('Oportunidade criada!')
    },
    onError: (error) => toast.error(error.message)
  })
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ opportunityId, updates }) => 
      opportunitiesService.updateOpportunity(opportunityId, updates),
    onSuccess: (updated, { opportunityId }) => {
      queryClient.setQueryData(opportunitiesKeys.detail(opportunityId), updated)
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.metrics() })
      if (updated.contact_id) {
        queryClient.invalidateQueries({ queryKey: contactsKeys.detail(updated.contact_id) })
      }
      toast.success('Oportunidade atualizada!')
    }
  })
}

export function useMarkOpportunityAsWon() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ opportunityId, convertedValue, metadata }) => 
      opportunitiesService.markAsWon(opportunityId, convertedValue, metadata),
    onSuccess: (updated, { opportunityId }) => {
      queryClient.setQueryData(opportunitiesKeys.detail(opportunityId), updated)
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.metrics() })
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.byStatus(OPPORTUNITY_STATUS.WON) })
      toast.success('🎉 Oportunidade ganha!')
    }
  })
}

export function useMarkOpportunityAsLost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ opportunityId, lostReason, notes }) => 
      opportunitiesService.markAsLost(opportunityId, lostReason, notes),
    onSuccess: (updated, { opportunityId }) => {
      queryClient.setQueryData(opportunitiesKeys.detail(opportunityId), updated)
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.metrics() })
      toast.success('Oportunidade marcada como perdida')
    }
  })
}

export function useMarkOpportunityAsRecovered() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ opportunityId, convertedValue }) => 
      opportunitiesService.markAsRecovered(opportunityId, convertedValue),
    onSuccess: (updated, { opportunityId }) => {
      queryClient.setQueryData(opportunitiesKeys.detail(opportunityId), updated)
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.metrics() })
      toast.success('🔥 Oportunidade recuperada!')
    }
  })
}

export function useDeleteOpportunity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (opportunityId) => opportunitiesService.deleteOpportunity(opportunityId),
    onSuccess: (_, opportunityId) => {
      queryClient.removeQueries({ queryKey: opportunitiesKeys.detail(opportunityId) })
      queryClient.invalidateQueries({ queryKey: opportunitiesKeys.lists() })
      toast.success('Oportunidade removida')
    }
  })
}
