/**
 * TanStack Query Hooks - Messages
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import messagesService from '@/api/services/MessagesService'
import { opportunitiesKeys } from './opportunities.js'
import { contactsKeys } from './contacts.js'

export const messagesKeys = {
  all: ['messages'],
  byOpportunity: (oppId) => [...messagesKeys.all, 'by-opportunity', oppId],
  byContact: (contactId) => [...messagesKeys.all, 'by-contact', contactId]
}

export function useOpportunityMessages(opportunityId, options = {}) {
  return useQuery({
    queryKey: messagesKeys.byOpportunity(opportunityId),
    queryFn: () => messagesService.getOpportunityMessages(opportunityId, options),
    enabled: !!opportunityId,
    staleTime: 30 * 1000, // 30 segundos (mensagens mudam rápido)
    refetchInterval: 30 * 1000 // Auto-refetch
  })
}

export function useContactMessages(contactId, options = {}) {
  return useQuery({
    queryKey: messagesKeys.byContact(contactId),
    queryFn: () => messagesService.getContactMessages(contactId, options),
    enabled: !!contactId,
    staleTime: 30 * 1000
  })
}

export function useCreateMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (messageData) => messagesService.createMessage(messageData),
    onSuccess: (newMessage) => {
      // Invalidar mensagens da oportunidade
      queryClient.invalidateQueries({ 
        queryKey: messagesKeys.byOpportunity(newMessage.opportunity_id) 
      })
      
      // Invalidar mensagens do contato
      queryClient.invalidateQueries({ 
        queryKey: messagesKeys.byContact(newMessage.contact_id) 
      })
      
      // Invalidar detalhes da oportunidade (tem message_count)
      queryClient.invalidateQueries({ 
        queryKey: opportunitiesKeys.detail(newMessage.opportunity_id) 
      })
      
      // Invalidar detalhes do contato
      queryClient.invalidateQueries({ 
        queryKey: contactsKeys.detail(newMessage.contact_id) 
      })
      
      toast.success('Mensagem enviada!')
    }
  })
}
