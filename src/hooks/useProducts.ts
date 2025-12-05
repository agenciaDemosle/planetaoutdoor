import { useQuery } from '@tanstack/react-query'
import { wooCommerceAPI } from '../api/woocommerce'
import { WooProduct, Product, mapWooProductToProduct } from '../types/product'

export function useProducts(params?: Record<string, unknown>) {
  return useQuery<Product[]>({
    queryKey: ['products', params],
    queryFn: async () => {
      const data: WooProduct[] = await wooCommerceAPI.getProducts(params)
      return data.map(mapWooProductToProduct)
    },
  })
}

export function useProduct(id: number) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const data: WooProduct = await wooCommerceAPI.getProduct(id)
      return mapWooProductToProduct(data)
    },
    enabled: !!id,
  })
}

export function useProductBySlug(slug: string) {
  return useQuery<Product>({
    queryKey: ['product', 'slug', slug],
    queryFn: async () => {
      const data: WooProduct = await wooCommerceAPI.getProductBySlug(slug)
      return mapWooProductToProduct(data)
    },
    enabled: !!slug,
  })
}

export function useCategories(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => wooCommerceAPI.getCategories(params),
  })
}
