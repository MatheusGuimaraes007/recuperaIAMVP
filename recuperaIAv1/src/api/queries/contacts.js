/**
 * TanStack Query Hooks - Contacts
 * 
 * Hooks para gerenciar contatos com cache inteligente.
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { toast } from 'vue-sonner'
import contactsService from '@/api/services/ContactsService'

// ============================================================================
// QUERY KEYS
// ============================================================================

export const contactsKeys = {
  all: ['contacts'],
  lists: () => [...contactsKeys.all, 'list'],
  list: (filters) => [...contactsKeys.lists(), filters],
  details: () => [...contactsKeys.all, 'detail'],
  detail: (id) => [...contactsKeys.details(), id],
  metrics: (id) => [...contactsKeys.all, 'metrics', id],
  search: (term) => [...contactsKeys.all, 'search', term],
  byAgent: (agentId) => [...contactsKeys.all, 'by-agent', agentId],
  byStatus: (status) => [...contactsKeys.all, 'by-status', status],
  byTags: (tags) => [...contactsKeys.all, 'by-tags', tags]
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook: Lista contatos com filtros
 * @param {Object} filters - { page, limit, status, search, agentId }
 */
export function useContacts(filters = {}) {
  return useQuery({
    queryKey: contactsKeys.list(filters),
    queryFn: () => contactsService.listContacts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antigo cacheTime)
    retry: 2
  })
}

/**
 * Hook: Lista contatos com scroll infinito
 */
export function useInfiniteContacts(baseFilters = {}) {
  return useInfiniteQuery({
    queryKey: contactsKeys.list(baseFilters),
    queryFn: ({ pageParam = 1 }) => 
      contactsService.listContacts({ ...baseFilters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Se a última página tem menos que o limit, não há mais páginas
      const limit = baseFilters.limit || 50
      if (lastPage.length < limit) return undefined
      return allPages.length + 1
    },
    staleTime: 5 * 60 * 1000
  })
}

/**
 * Hook: Detalhes do contato com relacionamentos
 * @param {string|number} contactId
 */
export function useContact(contactId) {
  return useQuery({
    queryKey: contactsKeys.detail(contactId),
    queryFn: () => contactsService.getContactById(contactId),
    enabled: !!contactId,
    staleTime: 2 * 60 * 1000, // 2 minutos (mais curto pois tem mensagens)
    retry: 2
  })
}

/**
 * Hook: Métricas do contato
 */
export function useContactMetrics(contactId) {
  return useQuery({
    queryKey: contactsKeys.metrics(contactId),
    queryFn: () => contactsService.getContactMetrics(contactId),
    enabled: !!contactId,
    staleTime: 5 * 60 * 1000
  })
}

/**
 * Hook: Busca contatos por telefone
 */
export function useContactByPhone(phone) {
  return useQuery({
    queryKey: [...contactsKeys.all, 'by-phone', phone],
    queryFn: () => contactsService.getContactByPhone(phone),
    enabled: !!phone && phone.length >= 10,
    staleTime: 5 * 60 * 1000
  })
}

/**
 * Hook: Busca contatos por email
 */
export function useContactByEmail(email) {
  return useQuery({
    queryKey: [...contactsKeys.all, 'by-email', email],
    queryFn: () => contactsService.getContactByEmail(email),
    enabled: !!email && email.includes('@'),
    staleTime: 5 * 60 * 1000
  })
}

/**
 * Hook: Contatos ativos
 */
export function useActiveContacts() {
  return useQuery({
    queryKey: contactsKeys.byStatus('engaged'),
    queryFn: () => contactsService.getActiveContacts(),
    staleTime: 5 * 60 * 1000
  })
}

/**
 * Hook: Contatos por agente
 */
export function useContactsByAgent(agentId) {
  return useQuery({
    queryKey: contactsKeys.byAgent(agentId),
    queryFn: () => contactsService.getContactsByAgent(agentId),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000
  })
}

/**
 * Hook: Contatos por tags
 */
export function useContactsByTags(tags) {
  return useQuery({
    queryKey: contactsKeys.byTags(tags),
    queryFn: () => contactsService.getContactsByTags(tags),
    enabled: tags && tags.length > 0,
    staleTime: 5 * 60 * 1000
  })
}

/**
 * Hook: Contatos criados hoje
 */
export function useTodaysContacts() {
  return useQuery({
    queryKey: [...contactsKeys.all, 'today'],
    queryFn: () => contactsService.getTodaysContacts(),
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: 60 * 1000 // Refetch a cada minuto
  })
}

/**
 * Hook: Busca otimizada (usa RPC se disponível)
 */
export function useSearchContacts(filters = {}) {
  return useQuery({
    queryKey: contactsKeys.search(filters.search || ''),
    queryFn: () => contactsService.searchContactsOptimized(filters),
    enabled: !!filters.search && filters.search.trim().length >= 2,
    staleTime: 3 * 60 * 1000
  })
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook: Criar contato
 */
export function useCreateContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (contactData) => contactsService.createContact(contactData),
    onSuccess: (newContact) => {
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() })
      
      // Adicionar à cache de detalhes
      queryClient.setQueryData(
        contactsKeys.detail(newContact.id),
        newContact
      )
      
      toast.success('Contato criado com sucesso!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao criar contato')
    }
  })
}

/**
 * Hook: Atualizar contato
 */
export function useUpdateContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ contactId, updates }) => 
      contactsService.updateContact(contactId, updates),
    onSuccess: (updatedContact, { contactId }) => {
      // Atualizar cache de detalhes
      queryClient.setQueryData(
        contactsKeys.detail(contactId),
        (old) => ({ ...old, ...updatedContact })
      )
      
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() })
      
      toast.success('Contato atualizado!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao atualizar contato')
    }
  })
}

/**
 * Hook: Atualizar status do contato
 */
export function useUpdateContactStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ contactId, newStatus }) => 
      contactsService.updateContactStatus(contactId, newStatus),
    onSuccess: (updatedContact, { contactId }) => {
      // Atualizar cache
      queryClient.setQueryData(
        contactsKeys.detail(contactId),
        (old) => ({ ...old, ...updatedContact })
      )
      
      // Invalidar listas (status mudou)
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: contactsKeys.byStatus(updatedContact.status) })
      
      toast.success('Status atualizado!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao atualizar status')
    }
  })
}

/**
 * Hook: Deletar contato (soft delete)
 */
export function useDeleteContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (contactId) => contactsService.deleteContact(contactId),
    onSuccess: (_, contactId) => {
      // Remover da cache
      queryClient.removeQueries({ queryKey: contactsKeys.detail(contactId) })
      
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() })
      
      toast.success('Contato removido!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao remover contato')
    }
  })
}

/**
 * Hook: Adicionar tag
 */
export function useAddContactTag() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ contactId, tag }) => 
      contactsService.addTag(contactId, tag),
    onSuccess: (updatedContact, { contactId }) => {
      // Atualizar cache
      queryClient.setQueryData(
        contactsKeys.detail(contactId),
        updatedContact
      )
      
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() })
      
      toast.success('Tag adicionada!')
    }
  })
}

/**
 * Hook: Remover tag
 */
export function useRemoveContactTag() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ contactId, tag }) => 
      contactsService.removeTag(contactId, tag),
    onSuccess: (updatedContact, { contactId }) => {
      // Atualizar cache
      queryClient.setQueryData(
        contactsKeys.detail(contactId),
        updatedContact
      )
      
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() })
      
      toast.success('Tag removida!')
    }
  })
}

// ============================================================================
// COMPOSABLES UTILITÁRIOS
// ============================================================================

/**
 * Composable: Gerenciamento completo de contatos
 */
export function useContactsManagement(initialFilters = {}) {
  const queryClient = useQueryClient()
  
  // Queries
  const contactsQuery = useContacts(initialFilters)
  const createMutation = useCreateContact()
  const updateMutation = useUpdateContact()
  const updateStatusMutation = useUpdateContactStatus()
  const deleteMutation = useDeleteContact()
  
  // States computados
  const contacts = computed(() => contactsQuery.data?.value || [])
  const isLoading = computed(() => contactsQuery.isLoading.value)
  const error = computed(() => contactsQuery.error?.value)
  
  // Métodos
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: contactsKeys.lists() })
  }
  
  const create = async (contactData) => {
    return await createMutation.mutateAsync(contactData)
  }
  
  const update = async (contactId, updates) => {
    return await updateMutation.mutateAsync({ contactId, updates })
  }
  
  const updateStatus = async (contactId, newStatus) => {
    return await updateStatusMutation.mutateAsync({ contactId, newStatus })
  }
  
  const remove = async (contactId) => {
    return await deleteMutation.mutateAsync(contactId)
  }
  
  return {
    // Data
    contacts,
    isLoading,
    error,
    
    // Actions
    refresh,
    create,
    update,
    updateStatus,
    remove,
    
    // Mutations
    createMutation,
    updateMutation,
    updateStatusMutation,
    deleteMutation
  }
}
