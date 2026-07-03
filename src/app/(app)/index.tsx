import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DateHeader from '@/components/DateHeader';
import AppLogo from '@/components/AppLogo';
import { useSession } from '@/hooks/useSession';
import { useProfile } from '@/hooks/useProfile';

/**
 * Sprint 12 in-flight — Feed screen doubles as the daily dashboard for
 * now (real Feed = merged squad activity in Sprint 14). Currently proves
 * NativeWind + DateHeader + useProfile all working end-to-end.
 */
export default function FeedScreen() {
  const { session } = useSession();
  const { data: profile } = useProfile();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <DateHeader />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-8">
        {/* Greeting */}
        <View className="bg-primary/5 border border-border rounded-3xl p-5 mb-4 flex-row items-center gap-3">
          <AppLogo size={48} />
          <View className="flex-1">
            <Text className="text-xl font-black text-foreground">
              Assalam-o-Alaikum,{' '}
              <Text className="text-primary">
                {profile?.name?.split(' ')[0] ?? session?.user?.email?.split('@')[0] ?? 'Friend'}
              </Text>
              !
            </Text>
            <Text className="text-xs text-muted-foreground mt-1 font-semibold">
              Native beta — Sprint 12 in progress
            </Text>
          </View>
        </View>

        {/* Status card confirming plumbing works */}
        <View className="bg-card border border-border rounded-2xl p-4 gap-2">
          <StatusRow label="Session" value={session ? '✓ signed in' : '—'} ok={!!session} />
          <StatusRow label="Profile" value={profile?.name ?? '—'} ok={!!profile?.name} />
          <StatusRow
            label="Onboarded"
            value={profile ? (profile.needs_onboarding ? 'needs onboarding' : '✓') : '—'}
            ok={!!profile && !profile.needs_onboarding}
          />
          <StatusRow label="Role" value={profile?.role ?? 'user'} ok />
        </View>

        <Text className="text-[10px] text-muted-foreground/60 text-center mt-6 uppercase tracking-widest font-black">
          Sprint 12 · v0.0.2 · 03 Jul 2026
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-xs text-muted-foreground">{label}</Text>
      <Text className={`text-xs font-black ${ok ? 'text-primary' : 'text-destructive'}`}>
        {value}
      </Text>
    </View>
  );
}
