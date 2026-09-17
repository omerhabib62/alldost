/**
 * useProfile — mirrors the fitness web app's useProfile shape so components
 * that consume profile can be ported 1:1. Returns the profiles row for
 * the currently signed-in user.
 *
 * Fields we care about (subset of web): name, dob, start_weight,
 * target_weight, height_cm, daily_cal_target, macro_p_pct, macro_c_pct,
 * macro_f_pct, protein_active, protein_rest, activity_level, goal,
 * gender, units, timezone, role, needs_onboarding.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';

export interface Profile {
  id: string;
  name: string | null;
  dob: string | null;
  gender: string | null;
  height_cm: number | null;
  start_weight: number | null;
  target_weight: number | null;
  daily_cal_target: number | null;
  protein_active: number | null;
  protein_rest: number | null;
  macro_p_pct: number | null;
  macro_c_pct: number | null;
  macro_f_pct: number | null;
  activity_level: number | null;
  goal: 'fat_loss' | 'recomp' | 'bulk' | null;
  units: 'metric' | 'imperial' | null;
  timezone: string | null;
  role: 'user' | 'admin' | null;
  needs_onboarding: boolean | null;
}

export function useProfile() {
  const { session, isLoading: sessionLoading } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['profile', userId ?? 'anon'],
    enabled: !sessionLoading && !!userId,
    queryFn: async (): Promise<Profile | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export type ProfileInput = {
  name: string;
  dob: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height_cm: number;
  start_weight: number;
  target_weight: number;
  daily_cal_target: number;
  protein_active: number;
  protein_rest: number;
  macro_p_pct: number;
  macro_c_pct: number;
  macro_f_pct: number;
  goal: 'fat_loss' | 'recomp' | 'bulk';
  activity_level: number;
  units: 'metric' | 'imperial';
  timezone: string;
};

/**
 * Onboarding save — same write as the web app's useEnsureProfile: upsert the
 * profiles row and clear needs_onboarding (closes the admin reset loop).
 */
export function useSaveProfile() {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ProfileInput) => {
      if (!userId) throw new Error('User session not found.');
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: userId, needs_onboarding: false, ...profile });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}
