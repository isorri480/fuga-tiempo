export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface TimeLeakInsert {
  user_id: string; // Assuming UUID from Supabase auth
  fecha_hora_registro: string;
  tipo_fuga: string; // Now a string ID
  descripcion_adicional?: string;
  minutos_duracion?: number;
}

export interface Database {
  public: {
    Tables: {
      fugas_tiempo: {
        Row: {
          id: number;
          created_at: string;
          user_id: string;
          fecha_hora_registro: string;
          tipo_fuga: string; // Changed from enum to string
          descripcion_adicional: string | null;
          minutos_duracion: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_id: string;
          fecha_hora_registro: string;
          tipo_fuga: string; // Changed from enum to string
          descripcion_adicional?: string | null;
          minutos_duracion?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_id?: string;
          fecha_hora_registro?: string;
          tipo_fuga?: string; // Changed from enum to string
          descripcion_adicional?: string | null;
          minutos_duracion?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "fugas_tiempo_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type TimeLeakRow = Database['public']['Tables']['fugas_tiempo']['Row'];
export type TimeLeakUpdate = Database['public']['Tables']['fugas_tiempo']['Update'];

export type Page = 'dataEntry' | 'statistics' | 'list';
export type NotificationType = { message: string; type: 'success' | 'error' } | null;