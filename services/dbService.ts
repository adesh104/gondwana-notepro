
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Staff, NoteSheet, NoteStatus, UniversitySettings } from '../types';

/**
 * GONDWANA UNIVERSITY DIGITAL REGISTRY CORE
 * SUPABASE CLOUD INTEGRATION
 * 
 * Required Supabase Table Schema:
 * ------------------------------
 * departments (name TEXT PK)
 * staff (id TEXT PK, name TEXT, designation TEXT, department TEXT FK, role TEXT, password TEXT, email TEXT, phone TEXT, photo TEXT)
 * notes (id TEXT PK, subject TEXT, content TEXT, reference_no TEXT, status TEXT, creator_id TEXT FK, current_handler_id TEXT FK, history JSONB, attachments JSONB, date_initiated TIMESTAMPTZ)
 * settings (id TEXT PK, university_name TEXT, logo TEXT)
 */

const SUPABASE_URL = (process.env as any).SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (process.env as any).SUPABASE_ANON_KEY || '';

export const STORES = {
  STAFF: 'staff',
  NOTES: 'notes',
  DEPARTMENTS: 'departments',
  SETTINGS: 'settings'
};

class DatabaseService {
  private supabase: SupabaseClient | null = null;
  private useCloud: boolean = false;

  constructor() {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      this.useCloud = true;
    }
  }

  async init(): Promise<void> {
    if (this.useCloud) return;
    
    // Fallback to IndexedDB logic if Supabase is not configured
    console.warn("Supabase credentials missing. Falling back to local-only mode.");
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (this.useCloud && this.supabase) {
      if (storeName === STORES.NOTES) {
        // Fetch notes with joined staff data
        const { data, error } = await this.supabase
          .from('notes')
          .select(`
            *,
            creator:staff!creator_id (*),
            currentHandler:staff!current_handler_id (*)
          `);
        
        if (error) throw error;
        
        // Map snake_case database columns to camelCase TypeScript properties
        return (data || []).map((n: any) => ({
          ...n,
          referenceNo: n.reference_no,
          dateInitiated: n.date_initiated,
        })) as unknown as T[];
      }

      const { data, error } = await this.supabase.from(storeName).select('*');
      if (error) throw error;
      
      if (storeName === STORES.DEPARTMENTS) {
          return (data || []).map(d => d.name) as unknown as T[];
      }
      
      return data as T[];
    }
    
    // Simple local fallback (for development/non-cloud environments)
    return [];
  }

  async put<T>(storeName: string, data: any): Promise<void> {
    if (this.useCloud && this.supabase) {
      let payload = { ...data };

      // Map NoteSheet specifically for relational storage
      if (storeName === STORES.NOTES) {
        payload = {
          id: data.id,
          subject: data.subject,
          content: data.content,
          reference_no: data.referenceNo,
          status: data.status,
          creator_id: data.creator.id,
          current_handler_id: data.currentHandler.id,
          history: data.history,
          attachments: data.attachments || [],
          date_initiated: data.dateInitiated
        };
      }

      if (storeName === STORES.DEPARTMENTS) {
        payload = { name: data };
      }

      const { error } = await this.supabase.from(storeName).upsert(payload);
      if (error) throw error;
      return;
    }
  }

  async get<T>(storeName: string, id: string): Promise<T | null> {
    if (this.useCloud && this.supabase) {
      const { data, error } = await this.supabase.from(storeName).select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as T;
    }
    return null;
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (this.useCloud && this.supabase) {
      const { error } = await this.supabase.from(storeName).delete().eq('id', id);
      if (error) throw error;
    }
  }

  async saveAllDepartments(depts: string[]): Promise<void> {
    if (this.useCloud && this.supabase) {
      const payload = depts.map(d => ({ name: d }));
      const { error } = await this.supabase.from('departments').upsert(payload);
      if (error) throw error;
    }
  }
}

export const dbService = new DatabaseService();
