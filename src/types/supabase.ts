export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options    
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "13.0.5"
    }
    public: {
        Tables: {
            budget: {
                Row: {
                    amount: number
                    category_id: number
                    created_at: string
                    end_date: string
                    id: number
                    start_date: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    category_id: number
                    created_at?: string
                    end_date: string
                    id?: number
                    start_date: string
                    user_id?: string
                }
                Update: {
                    amount?: number
                    category_id?: number
                    created_at?: string
                    end_date?: string
                    id?: number
                    start_date?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "budget_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "budget_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "transactions_with_ref"
                        referencedColumns: ["category_id"]
                    },
                ]
            }
            categories: {
                Row: {
                    category_name: string
                    category_type: Database["public"]["Enums"]["category_type"]
                    color: string
                    created_at: string
                    description: string | null
                    id: number
                    parent_category: number | null
                    user_id: string
                }
                Insert: {
                    category_name: string
                    category_type: Database["public"]["Enums"]["category_type"]
                    color: string
                    created_at?: string
                    description?: string | null
                    id?: number
                    parent_category?: number | null
                    user_id?: string
                }
                Update: {
                    category_name?: string
                    category_type?: Database["public"]["Enums"]["category_type"]
                    color?: string
                    created_at?: string
                    description?: string | null
                    id?: number
                    parent_category?: number | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "categories_parent_category_fkey"
                        columns: ["parent_category"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "categories_parent_category_fkey"
                        columns: ["parent_category"]
                        isOneToOne: false
                        referencedRelation: "transactions_with_ref"
                        referencedColumns: ["category_id"]
                    },
                ]
            }
            debt: {
                Row: {
                    counterparty: string
                    created_at: string
                    debt_type: Database["public"]["Enums"]["debt_type"]
                    due_date: string | null
                    id: number
                    notes: string | null
                    principal: number
                    start_date: string
                    user_id: string
                }
                Insert: {
                    counterparty: string
                    created_at?: string
                    debt_type: Database["public"]["Enums"]["debt_type"]
                    due_date?: string | null
                    id?: number
                    notes?: string | null
                    principal: number
                    start_date: string
                    user_id?: string
                }
                Update: {
                    counterparty?: string
                    created_at?: string
                    debt_type?: Database["public"]["Enums"]["debt_type"]
                    due_date?: string | null
                    id?: number
                    notes?: string | null
                    principal?: number
                    start_date?: string
                    user_id?: string
                }
                Relationships: []
            }
            transaction: {
                Row: {
                    amount: number
                    category_id: number | null
                    created_at: string
                    debt_id: number | null
                    description: string | null
                    direction: Database["public"]["Enums"]["transaction_direction"]
                    id: number
                    transaction_date: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    category_id?: number | null
                    created_at?: string
                    debt_id?: number | null
                    description?: string | null
                    direction: Database["public"]["Enums"]["transaction_direction"]
                    id?: number
                    transaction_date: string
                    user_id?: string
                }
                Update: {
                    amount?: number
                    category_id?: number | null
                    created_at?: string
                    debt_id?: number | null
                    description?: string | null
                    direction?: Database["public"]["Enums"]["transaction_direction"]
                    id?: number
                    transaction_date?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "transaction_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transaction_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "transactions_with_ref"
                        referencedColumns: ["category_id"]
                    },
                ]
            }
        }
        Views: {
            transactions_with_ref: {
                Row: {
                    amount: number | null
                    category_id: number | null
                    category_name: string | null
                    category_type: Database["public"]["Enums"]["category_type"] | null
                    counterparty: string | null
                    debt_id: number | null
                    debt_type: Database["public"]["Enums"]["debt_type"] | null
                    description: string | null
                    direction: Database["public"]["Enums"]["transaction_direction"] | null
                    parent_category_id: number | null
                    search_text: string | null
                    transaction_date: string | null
                    transaction_id: number | null
                    transaction_type: string | null
                    user_id: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "categories_parent_category_fkey"
                        columns: ["parent_category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "categories_parent_category_fkey"
                        columns: ["parent_category_id"]
                        isOneToOne: false
                        referencedRelation: "transactions_with_ref"
                        referencedColumns: ["category_id"]
                    },
                ]
            }
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            category_type: "income" | "expense"
            debt_type: "borrowed" | "lent"
            transaction_direction: "inflow" | "outflow"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {
            category_type: ["income", "expense"],
            debt_type: ["borrowed", "lent"],
            transaction_direction: ["inflow", "outflow"],
        },
    },
} as const