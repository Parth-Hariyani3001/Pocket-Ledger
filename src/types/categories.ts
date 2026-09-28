import type { Database } from './supabase'
import type { Camelize } from './camelize'

type CategoryRow =
    Database['public']['Tables']['categories']['Row']

export type Category = Camelize<CategoryRow>

export type CategoryWithChild = Category & {
    child?: Category[]
}

export type CategoryType = Database['public']['Enums']['category_type']

export type CategoryCreate = Database['public']['Tables']['categories']['Insert']

export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];