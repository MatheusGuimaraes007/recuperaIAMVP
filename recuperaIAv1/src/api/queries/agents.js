/**
 * TanStack Query Hooks - Agents
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import agentsService from '@/api/services/AgentsService'

export const agentsKeys = {
  all: ['agents'],
  lists: () => [...agentsKeys.all, 'list'],
  list: (filters) => [...agentsKeys.lists(), filters],
  details: () => [...agentsKeys.all, 'detail'],
  detail: (id) => [...agentsKeys.details(), id],
  stats: (id) => [...agentsKeys.all, 'stats', id],
  withWhatsApp: () => [...agentsKeys.all, 'with-whatsapp']
}

export function useAgents(filters = {}) {
  return useQuery({
    queryKey: agentsKeys.list(filters),
    queryFn: () => agentsService.listAgents(filters),
    staleTime: 5 * 60 * 1000
  })
}

export function useAgent(agentId) {
  return useQuery({
    queryKey: agentsKeys.detail(agentId),
    queryFn: () => agentsService.getAgentById(agentId),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000
  })
}

export function useAgentStats(agentId) {
  return useQuery({
    queryKey: agentsKeys.stats(agentId),
    queryFn: () => agentsService.getAgentStats(agentId),
    enabled: !!agentId,
    staleTime: 3 * 60 * 1000
  })
}

export function useAgentsWithWhatsApp() {
  return useQuery({
    queryKey: agentsKeys.withWhatsApp(),
    queryFn: () => agentsService.getAgentsWithWhatsApp(),
    staleTime: 5 * 60 * 1000
  })
}

export function useCreateAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => agentsService.createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() })
      toast.success('Agente criado!')
    }
  })
}

export function useUpdateAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ agentId, updates }) => agentsService.updateAgent(agentId, updates),
    onSuccess: (updated, { agentId }) => {
      queryClient.setQueryData(agentsKeys.detail(agentId), updated)
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() })
      toast.success('Agente atualizado!')
    }
  })
}

export function useDeleteAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (agentId) => agentsService.deleteAgent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() })
      toast.success('Agente removido')
    }
  })
}

export function useCreateOfficialWhatsApp() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ agentId, whatsappData }) => 
      agentsService.createOfficialWhatsApp(agentId, whatsappData),
    onSuccess: (_, { agentId }) => {
      queryClient.invalidateQueries({ queryKey: agentsKeys.detail(agentId) })
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() })
      toast.success('WhatsApp oficial vinculado!')
    }
  })
}

export function useLinkKnowledgeBase() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ agentId, knowledgeBaseId }) => 
      agentsService.linkKnowledgeBase(agentId, knowledgeBaseId),
    onSuccess: (_, { agentId }) => {
      queryClient.invalidateQueries({ queryKey: agentsKeys.detail(agentId) })
      toast.success('Base de conhecimento vinculada!')
    }
  })
}
