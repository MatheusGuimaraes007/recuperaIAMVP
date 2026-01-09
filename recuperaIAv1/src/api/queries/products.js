/**
 * TanStack Query Hooks - Products
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import productsService from '@/api/services/ProductsService'

export const productsKeys = {
  all: ['products'],
  lists: () => [...productsKeys.all, 'list'],
  list: (filters) => [...productsKeys.lists(), filters],
  details: () => [...productsKeys.all, 'detail'],
  detail: (id) => [...productsKeys.details(), id],
  stats: (id) => [...productsKeys.all, 'stats', id],
  knowledgeBases: (id) => [...productsKeys.all, 'knowledge-bases', id],
  trainingLinks: (id) => [...productsKeys.all, 'training-links', id]
}

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: productsKeys.list(filters),
    queryFn: () => productsService.listProducts(filters),
    staleTime: 5 * 60 * 1000
  })
}

export function useProduct(productId) {
  return useQuery({
    queryKey: productsKeys.detail(productId),
    queryFn: () => productsService.getProductById(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000
  })
}

export function useProductStats(productId) {
  return useQuery({
    queryKey: productsKeys.stats(productId),
    queryFn: () => productsService.getProductStats(productId),
    enabled: !!productId,
    staleTime: 3 * 60 * 1000
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => productsService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() })
      toast.success('Produto criado!')
    }
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ productId, updates }) => productsService.updateProduct(productId, updates),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(productId) })
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() })
      toast.success('Produto atualizado!')
    }
  })
}

export function useAddTrainingLink() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ productId, url }) => productsService.addTrainingLink(productId, url),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.trainingLinks(productId) })
      toast.success('Link de treinamento adicionado!')
    }
  })
}
