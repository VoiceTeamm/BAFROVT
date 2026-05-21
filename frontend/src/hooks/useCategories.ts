import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService, type CategoryPayload } from '../services/category.service'

export function useCategories() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (data: CategoryPayload) => categoryService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryPayload> }) =>
      categoryService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    removeCategory: removeMutation.mutate,
    isCreating: createMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}
