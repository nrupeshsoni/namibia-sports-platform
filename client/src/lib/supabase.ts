import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://rbibqjgsnrueubrvyqps.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaWJxamdzbnJ1ZXVicnZ5cXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzQ5ODksImV4cCI6MjA4MTY1MDk4OX0.48aWw4w0XzDfK0k-Z32O9fMnKiom9EG6XqSDbTJYupI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions matching the database schema
export interface DbFederation {
  id: number;
  name: string;
  abbreviation: string | null;
  type: 'ministry' | 'commission' | 'umbrella' | 'federation';
  description: string | null;
  president: string | null;
  secretaryGeneral: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  logo: string | null;
  backgroundImage: string | null;
  createdAt: string;
  updatedAt: string;
}

// Fetch all federations from Supabase
export async function fetchFederations(): Promise<DbFederation[]> {
  const { data, error } = await supabase
    .from('namibia_na_26_federations')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('Error fetching federations:', error);
    throw error;
  }
  
  return data || [];
}

