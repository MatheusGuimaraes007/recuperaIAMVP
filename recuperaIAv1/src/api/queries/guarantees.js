/**
 * TanStack Query Hooks - Guarantees (Risco Zero)
 */

import { useQuery, useMutation, useQueryClient } from '@tantml:invoke name="bash_tool">
<parameter name="command">cd /home/claude/semana6-services-queries && tar -czf ../semana6-services-queries.tar.gz .import { toast } from 'vue-sonner'
import guaranteesService from '@/api/services/GuaranteesService'

export const guaranteesKeys = {
  all: ['guarantees'],
  active: () => [...guaranteesKeys.all, 'active'],
  list: (filters) => [...guaranteesKeys.all, 'list', filters]
}

export function useActiveGuarantee() {
  return useQuery({
    queryKey: guaranteesKeys.active(),
    queryFn: () => guaranteesService.getActiveGuarantee(),
    staleTime: 5 * 60 * 1000
  })
}

export function useGuarantees(filters = {}) {
  return useQuery({
    queryKey: guaranteesKeys.list(filters),
    queryFn: () => guaranteesService.listGuarantees(filters),
    staleTime: 5 * 60 * 1000
  })
}

export function useUpdateGuaranteeRecovered() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ guaranteeId, newAmount }) => 
      guaranteesService.updateRecoveredAmount(guaranteeId, newAmount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guaranteesKeys.active() })
      toast.success('Valor recuperado atualizado!')
    }
  })
}
