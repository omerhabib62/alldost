import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Trophy, Flame, Dumbbell, UtensilsCrossed, Users, PlusCircle } from 'lucide-react-native';

import DateHeader from '@/components/DateHeader';
import AppLogo from '@/components/AppLogo';
import { useSession } from '@/hooks/useSession';
import { useProfile } from '@/hooks/useProfile';

/**
 * Feed — the social hero screen. Instagram / Facebook style card list of
 * squad activity: achievements, workouts logged, PRs hit, matches played.
 *
 * Sprint 12: empty state + illustrative sample cards (SO Osama & Yaqub
 * can see what a filled feed would look like). Sprint 14 wires the real
 * squad_feed RPC once schema + push land.
 */
export default function FeedScreen() {
  const { session } = useSession();
  const { data: profile } = useProfile();
  const router = useRouter();
  const firstName = profile?.name?.split(' ')[0] ?? session?.user?.email?.split('@')[0] ?? 'you';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <DateHeader />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-8">
        {/* Header row */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <AppLogo size={32} />
            <Text className="text-xl font-black text-foreground">Feed</Text>
          </View>
          <Text className="text-[11px] text-muted-foreground font-semibold">
            Your crew's activity
          </Text>
        </View>

        {/* Empty state hero */}
        <View className="bg-primary/5 border border-border rounded-3xl p-5 items-center mb-4">
          <View className="w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center mb-3">
            <Users size={26} color="#0a66c2" />
          </View>
          <Text className="text-lg font-black text-foreground text-center">
            Your feed is waiting.
          </Text>
          <Text className="text-xs text-muted-foreground text-center mt-1 mb-4">
            Once you join a crew, their workouts, PRs and matches show up here.
          </Text>
          <Pressable
            onPress={() => router.push('/(app)/squads' as any)}
            className="bg-primary rounded-2xl px-5 py-2.5"
          >
            <Text className="text-white text-xs font-black uppercase tracking-wide">
              Go to Crews
            </Text>
          </Pressable>
        </View>

        {/* Sample "here's what it'll look like" cards — labeled so users know
            these are placeholders. Sprint 14 replaces with real squad_feed. */}
        <Text className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mb-2 mt-2 px-1">
          Example activity (coming soon)
        </Text>

        <SampleCard
          who="Yaqub"
          when="12 min ago"
          icon={<Trophy size={18} color="#f97316" />}
          iconBg="#fed7aa"
          title="Bench Press PR"
          detail="Hit 100 kg for the first time · 5x1 · Kravo gym"
          kind="PR"
        />
        <SampleCard
          who={firstName}
          when="3h ago"
          icon={<Flame size={18} color="#ef4444" />}
          iconBg="#fecaca"
          title="Futsal at Maidan"
          detail="60 min vigorous · 618 kcal · MVP vote"
          kind="Match"
        />
        <SampleCard
          who="Osama"
          when="1d ago"
          icon={<Dumbbell size={18} color="#0a66c2" />}
          iconBg="#dbeafe"
          title="Push Day"
          detail="Bench 90kg 4x8 · OHP 55kg 3x10 · Dips 15kg 4x12"
          kind="Workout"
        />
        <SampleCard
          who="Shahzad"
          when="2d ago"
          icon={<UtensilsCrossed size={18} color="#0a66c2" />}
          iconBg="#dbeafe"
          title="Marinated Chicken"
          detail="Home-cooked · 230 kcal · 30P / 5C / 8F"
          kind="Meal"
        />

        <Text className="text-[10px] text-muted-foreground/60 text-center mt-6 uppercase tracking-widest">
          Sprint 12 preview · Real feed in Sprint 14
        </Text>
      </ScrollView>

      {/* Floating add button — one tap to Log screen */}
      <Pressable
        onPress={() => router.push('/(app)/log' as any)}
        className="absolute bottom-24 right-5 w-14 h-14 rounded-full bg-primary items-center justify-center"
        style={{
          shadowColor: '#0a66c2',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        accessibilityLabel="Add a log entry"
      >
        <PlusCircle size={26} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

function SampleCard({
  who,
  when,
  icon,
  iconBg,
  title,
  detail,
  kind,
}: {
  who: string;
  when: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  detail: string;
  kind: string;
}) {
  return (
    <View className="bg-card border border-border rounded-2xl p-4 mb-3 opacity-70">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: iconBg }}>
            {icon}
          </View>
          <View>
            <Text className="text-sm font-black text-foreground">{who}</Text>
            <Text className="text-[10px] text-muted-foreground">{when}</Text>
          </View>
        </View>
        <View className="px-2 py-1 rounded-lg bg-muted">
          <Text className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            {kind}
          </Text>
        </View>
      </View>
      <Text className="text-sm font-black text-foreground">{title}</Text>
      <Text className="text-[11px] text-muted-foreground mt-1">{detail}</Text>
    </View>
  );
}
