import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MessageSquareText, UtensilsCrossed, Dumbbell, GlassWater, Scale } from 'lucide-react-native';

import DateHeader from '@/components/DateHeader';

/**
 * Log — the diary tab. Structured view of today's entries: meals,
 * workouts, water, weight. Kalorist-parallel: their "Diary" tab.
 *
 * Chat-based logging lives at /chat (separate route, opened via the
 * "Talk to ALLDost" button here + FAB on Feed). Sprint 13 wires the
 * real modules pulling from useMeals / useDailyLog / useWorkoutSets.
 */
export default function LogScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <DateHeader />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-8">
        {/* Header + Talk to ALLDost quick action */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-black text-foreground">Diary</Text>
          <Pressable
            onPress={() => router.push('/chat' as any)}
            className="bg-primary rounded-2xl px-4 py-2 flex-row items-center gap-1.5"
          >
            <MessageSquareText size={14} color="#fff" />
            <Text className="text-white text-[11px] font-black uppercase tracking-wide">
              Talk to ALLDost
            </Text>
          </Pressable>
        </View>

        {/* Section placeholders — Sprint 13 wires each */}
        <SectionPlaceholder
          icon={<UtensilsCrossed size={20} color="#f97316" />}
          iconBg="#fed7aa"
          label="Meals"
          copy="Today's food entries with per-meal-type breakdowns."
        />
        <SectionPlaceholder
          icon={<Dumbbell size={20} color="#0a66c2" />}
          iconBg="#dbeafe"
          label="Workouts"
          copy="Gym sets, matches, cardio sessions logged today."
        />
        <SectionPlaceholder
          icon={<GlassWater size={20} color="#12a3c4" />}
          iconBg="#cffafe"
          label="Water"
          copy="Glasses tracked."
        />
        <SectionPlaceholder
          icon={<Scale size={20} color="#666" />}
          iconBg="#e5e7eb"
          label="Weight"
          copy="Today's weigh-in (falls back to onboarding start weight)."
        />

        <Text className="text-[10px] text-muted-foreground/60 text-center mt-4 uppercase tracking-widest">
          Sprint 13 wires the real modules
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionPlaceholder({
  icon,
  iconBg,
  label,
  copy,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  copy: string;
}) {
  return (
    <View className="bg-card border border-border rounded-2xl p-4 mb-3 flex-row items-start gap-3">
      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: iconBg }}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-sm font-black text-foreground">{label}</Text>
        <Text className="text-[11px] text-muted-foreground mt-0.5">{copy}</Text>
      </View>
    </View>
  );
}
