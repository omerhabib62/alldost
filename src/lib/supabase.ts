// Supabase client for ALLDost (React Native + web).
// Uses AsyncStorage for session persistence across app kills.
// Same project as the fitness admin dashboard — user surface is native, admin
// surface stays on Next.js web.

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Check .env at project root.'
  );
}

// SSR-safe storage. During static web export there's no window/localStorage,
// so Supabase's default storage crashes. We give it a no-op stub on server,
// AsyncStorage on native, and localStorage on client web.
const memoryStore: Record<string, string> = {};
const noopStorage = {
  getItem: async (k: string) => memoryStore[k] ?? null,
  setItem: async (k: string, v: string) => { memoryStore[k] = v; },
  removeItem: async (k: string) => { delete memoryStore[k]; },
};

const isBrowser = typeof window !== 'undefined';
const storage =
  Platform.OS === 'web'
    ? (isBrowser ? undefined : noopStorage) // undefined → Supabase uses localStorage
    : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage as any,
    autoRefreshToken: isBrowser || Platform.OS !== 'web',
    persistSession: isBrowser || Platform.OS !== 'web',
    detectSessionInUrl: false,
  },
});
