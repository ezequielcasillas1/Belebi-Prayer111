import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/database';

const supabaseUrl = 'https://eyadwuourplswhjowiwj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YWR3dW91cnBsc3doam93aXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MjAxODAsImV4cCI6MjA4Nzk5NjE4MH0.o22QX32OHs7jdBq5-meMvyNsUN2kxnZhoVUaeibRxkw';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
