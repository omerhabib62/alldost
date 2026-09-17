/**
 * Read-only diary data for one date — mirrors the fitness web app's
 * useDailyLog / useMeals / useWorkoutSets. All writes go through /api/log
 * (chat), which invalidates these keys on success.
 *
 * Every query filters on profile_id explicitly: the meals/workout_sets RLS
 * policies in the migrations only join daily_logs on date.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';

export interface DailyLog {
  date: string;
  weight: number | null;
  water_glasses: number | null;
  total_cal: number | null;
  total_protein: number | null;
  total_carbs: number | null;
  total_fat: number | null;
  cal_burned: number | null;
  session_type: string | null;
}

export interface Meal {
  id: string;
  meal_type: string | null;
  item: string;
  qty: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
}

export interface WorkoutSet {
  id: string;
  exercise: string;
  weight_kg: number;
  sets: number;
  reps: number;
  is_pr: boolean | null;
  calories_burned: number | null;
  created_at: string;
}

export const diaryQueryKeys = ['daily_log', 'meals', 'workout_sets'] as const;

export function useDailyLog(date: string) {
  const { session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['daily_log', userId ?? 'anon', date],
    enabled: !!userId,
    queryFn: async (): Promise<DailyLog | null> => {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('date, weight, water_glasses, total_cal, total_protein, total_carbs, total_fat, cal_burned, session_type')
        .eq('date', date)
        .eq('profile_id', userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useMeals(date: string) {
  const { session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['meals', userId ?? 'anon', date],
    enabled: !!userId,
    queryFn: async (): Promise<Meal[]> => {
      const { data, error } = await supabase
        .from('meals')
        .select('id, meal_type, item, qty, cal, protein, carbs, fat, created_at')
        .eq('date', date)
        .eq('profile_id', userId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useWorkoutSets(date: string) {
  const { session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['workout_sets', userId ?? 'anon', date],
    enabled: !!userId,
    queryFn: async (): Promise<WorkoutSet[]> => {
      const { data, error } = await supabase
        .from('workout_sets')
        .select('id, exercise, weight_kg, sets, reps, is_pr, calories_burned, created_at')
        .eq('date', date)
        .eq('profile_id', userId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}
