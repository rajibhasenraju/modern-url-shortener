import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { linkApi } from '@/lib/api'
import type { CreateLinkRequest } from '@/types'
import { toast } from '@/hooks/useToast'

export function useLinks() {
  return useQuery({
    queryKey: ['links'],
    queryFn: linkApi.getLinks,
  })
}

export function useCreateLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLinkRequest) => linkApi.createLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
      toast.success('Link created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create link')
    },
  })
}

export function useDeleteLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (key: string) => linkApi.deleteLink(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
      toast.success('Link deleted')
    },
    onError: () => {
      toast.error('Failed to delete link')
    },
  })
}

export function useAnalytics(key?: string) {
  return useQuery({
    queryKey: ['analytics', key],
    queryFn: () => linkApi.getAnalytics(key),
  })
}
