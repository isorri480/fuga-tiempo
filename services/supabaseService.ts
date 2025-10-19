import { createClient } from '@supabase/supabase-js';
import { Database, TimeLeakInsert, TimeLeakUpdate } from '../types';

// Load Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize the Supabase client singleton, explicitly targeting the 'public' schema
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    db: {
        schema: 'public',
    },
});

/**
 * Formats a Supabase error into a readable string to prevent '[object Object]' errors.
 * It prioritizes the `message` and `details` fields if they are strings, otherwise
 * falls back to JSON stringifying the error for better debugging.
 * @param error The error object from a Supabase client call.
 * @returns A standard `Error` object with a formatted message.
 */
const formatSupabaseError = (error: any): Error => {
    console.error('Supabase Error:', error);

    let message = 'An unknown database error occurred.';

    if (error) {
        if (typeof error.message === 'string') {
            message = error.message;
            if (typeof error.details === 'string' && error.details) {
                message += ` (${error.details})`;
            }
        } else {
            try {
                // As a fallback, stringify the whole error object.
                message = JSON.stringify(error);
            } catch (e) {
                // Ignore potential circular reference errors in stringify
            }
        }
    }

    return new Error(message);
}


export const addTimeLeak = async (leakData: TimeLeakInsert) => {
    const { data, error } = await supabase
        .from('fugas_tiempo')
        .insert([leakData])
        .select();

    if (error) {
        throw formatSupabaseError(error);
    }

    return data;
};

export const getTimeLeaks = async (userId: string, startDate?: string, endDate?: string) => {
    let query = supabase
        .from('fugas_tiempo')
        .select('*')
        .eq('user_id', userId);

    if (startDate) {
        query = query.gte('fecha_hora_registro', new Date(startDate).toISOString());
    }

    if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte('fecha_hora_registro', endOfDay.toISOString());
    }

    const { data, error } = await query.order('fecha_hora_registro', { ascending: false });

    if (error) {
        throw formatSupabaseError(error);
    }

    return data;
};


export const updateTimeLeak = async (id: number, updates: TimeLeakUpdate) => {
    const { data, error } = await supabase
        .from('fugas_tiempo')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        throw formatSupabaseError(error);
    }
    return data;
};

export const deleteTimeLeak = async (id: number) => {
    const { error, count } = await supabase
        .from('fugas_tiempo')
        .delete({ count: 'exact' })
        .eq('id', id);
    
    if (error) {
        throw formatSupabaseError(error);
    }

    if (count === 0) {
        throw new Error("The record was not deleted. It might have been already removed, or you lack permissions.");
    }
};