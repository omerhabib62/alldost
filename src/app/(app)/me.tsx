import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Settings, Target, Flame, Scale, UtensilsCrossed } from 'lucide-react-native';

import DateHeader from '@/components/DateHeader';
import AppLogo from '@/components/AppLogo';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';
import { useProfile } from '@/hooks/useProfile';

/**
 * Profile — the personal dashboard tab. Houses everything that's about
 * YOU: greeting, macro targets, kcal burn, weight snapshot, workouts,
 * meals, and settings/sign-out at the bottom.
 *
 * Sprint 12: skeleton with real greeting + basic profile info + sign-out.
 * Sprint 13 wires the daily_logs + meals + weight modules for full parity
 * with the web dashboard.
 */
export default function ProfileScreen() {
  const { session } = useSession();
  const { data: profile } = useProfile();
  const firstName = profile?.name?.split(' ')[0] ?? session?.user?.email?.split('@')[0] ?? 'Friend';

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Sign out failed', error.message);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <DateHeader />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-8">
        {/* Greeting */}
        <View className="bg-primary/5 border border-border rounded-3xl p-5 mb-4 flex-row items-center gap-3">
          <AppLogo size={48} />
          <View className="flex-1">
            <Text className="text-lg font-black text-foreground">
              Assalam-o-Alaikum, <Text className="text-primary">{firstName}</Text>!
            </Text>
            <Text className="text-xs text-muted-foreground mt-1 font-semibold">
              {profile?.goal
                ? `Goal: ${profile.goal.replace('_', ' ')}`
                : 'Native beta — Sprint 12'}
            </Text>
          </View>
        </View>

        {/* Targets summary */}
        <Text className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mb-2 px-1">
          Your targets
        </Text>
        <View className="grid gap-3 mb-4">
          <StatCard
            icon={<Flame size={20} color="#0a66c2" />}
            iconBg="#dbeafe"
            label="Daily calories"
            value={profile?.daily_cal_target ? `${profile.daily_cal_target} kcal` : '—'}
          />
          <StatCard
            icon={<Target size={20} color="#f97316" />}
            iconBg="#fed7aa"
            label="Weight"
            value={
              profile?.start_weight && profile?.target_weight
                ? `${profile.start_weight} kg → ${profile.target_weight} kg`
                : '—'
            }
          />
          <StatCard
            icon={<UtensilsCrossed size={20} color="#12a3c4" />}
            iconBg="#cffafe"
            label="Macro split"
            value={
              profile?.macro_p_pct && profile?.macro_c_pct && profile?.macro_f_pct
                ? `${profile.macro_p_pct}P / ${profile.macro_c_pct}C / ${profile.macro_f_pct}F`
                : '—'
            }
          />
          <StatCard
            icon={<Scale size={20} color="#666" />}
            iconBg="#e5e7eb"
            label="Height"
            value={profile?.height_cm ? `${profile.height_cm} cm` : '—'}
          />
        </View>

        {/* Coming soon note */}
        <View className="bg-muted/50 rounded-2xl p-4 border border-border/50 mb-4">
          <Text className="text-[11px] text-muted-foreground text-center">
            Daily meals, macro rings, weight chart + workouts coming in Sprint 13.
          </Text>
        </View>

        {/* Signed-in as */}
        <View className="bg-card border border-border rounded-2xl p-4 mb-3">
          <Text className="text-[9px] uppercase tracking-widest text-muted-foreground font-black mb-1">
            Signed in as
          </Text>
          <Text className="text-xs font-bold text-foreground">
            {session?.user.email ?? '—'}
          </Text>
        </View>

        {/* Settings row (placeholders) */}
        <SettingsRow icon={<Settings size={18} color="#666" />} label="Edit profile · Sprint 13" />

        {/* Sign out */}
        <Pressable
          onPress={signOut}
          className="mt-3 bg-destructive/10 border border-destructive/30 rounded-2xl p-3.5 flex-row items-center justify-center gap-2"
        >
          <LogOut size={16} color="#ef4444" />
          <Text className="text-destructive text-xs font-black uppercase tracking-wider">
            Sign out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) {
  return (
    <View className="bg-card border border-border rounded-2xl p-4 flex-row items-center gap-3 mb-3">
      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: iconBg }}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">{label}</Text>
        <Text className="text-sm font-black text-foreground mt-0.5">{value}</Text>
      </View>
    </View>
  );
}

function SettingsRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View className="bg-card border border-border rounded-2xl p-3.5 flex-row items-center gap-3">
      {icon}
      <Text className="text-xs text-muted-foreground flex-1">{label}</Text>
    </View>
  );
}
