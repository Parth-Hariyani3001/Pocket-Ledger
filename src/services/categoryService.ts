import type { Category, CategoryCreate, CategoryType, CategoryUpdate } from "../types/categories";
import { toCamelCase } from "../utils/toCamelCase";
import supabase from "./supabase";

export async function getCategories(catType: string): Promise<Category[]> {
    let query = supabase
        .from('categories')
        .select('*')
        .order("parent_category", { ascending: false })

    if (catType === 'expense')
        query = query.eq('category_type', catType)

    if (catType === 'income')
        query = query.eq('category_type', catType)

    const { data, error } = await query;
    if (error)
        throw new Error(error.message);

    return toCamelCase<Category[]>(data) ?? []
}

export async function getChildCategories(categoryType: CategoryType | null): Promise<Category[]> {
    let query = supabase
        .from('categories')
        .select("*")
        .not('parent_category', 'is', null)

    if (categoryType)
        query = query.eq('category_type', categoryType)

    const { data, error } = await query;
    if (error)
        throw new Error(error.message)

    return toCamelCase<Category[]>(data) ?? []
}

export async function deleteCategory(id: number) {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

    if (error)
        throw new Error(error.message);
}

export async function createCategory(category: CategoryCreate) {
    const { error } = await supabase
        .from('categories')
        .insert([{ ...category }])

    if (error)
        throw new Error(error.message)
}

interface UpdateCategoryType {
    category: CategoryUpdate;
    categoryId: number
}

export async function updateCategory({ categoryId, category }: UpdateCategoryType) {
    const { error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', categoryId)

    if (error)
        throw new Error(error.message)

    if (!category.category_type)
        return

    const { error: childError } = await supabase
        .from('categories')
        .update({ category_type: category.category_type })
        .eq('parent_category', categoryId)

    if (childError)
        throw new Error(childError.message)
}