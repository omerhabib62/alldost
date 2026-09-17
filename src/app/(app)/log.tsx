import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Dumbbell, GlassWater, MessageSquareText, Scale, UtensilsCrossed } from 'lucide-react-native';

import DateHeader from '@/components/DateHeader';
import { useDailyLog, useMeals, useWorkoutSets, type Meal } from '@/hooks/useDiary';
import { useProfile } from '@/hooks/useProfile';
import { useHasHydrated, useUiStore } from '@/store/useUiStore';

/**
 * Diary tab — read-only view of the date selected in DateHeader: day
 * totals, meals, workout sets, water, weight. Logging happens in /chat
 * (POST /api/log), which invalidates these queries on success.
 */

const MEAL_TYPE_ORDER = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function LogScreen() {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const selectedDate = useUiStore((s) => s.selectedDate);

  const { data: profile } = useProfile();
  const dailyLog = useDailyLog(selectedDate);
  const meals = useMeals(selectedDate);
  const workouts = useWorkoutSets(selectedDate);

  const isLoading = !hydrated || dailyLog.isPending || meals.isPending || workouts.isPending;
  const error = dailyLog.error || meals.error || workouts.error;
  const refreshing = dailyLog.isRefetching || meals.isRefetching || workouts.isRefetching;

  const refetchAll = () => {
    dailyLog.refetch();
    meals.refetch();
    workouts.refetch();
  };

  const log = dailyLog.data;
  const isWorkoutDay = !!log?.session_type && log.session_type !== 'Rest';
  const proteinTarget = isWorkoutDay ? profile?.protein_active : profile?.protein_rest;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <DateHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-8"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetchAll} />}
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-black text-foreground">Diary</Text>
          <Pressable
            onPress={() => router.push('/chat')}
            className="bg-primary rounded-2xl px-4 py-2 flex-row items-center gap-1.5"
          >
            <MessageSquareText size={14} color="#fff" />
            <Text className="text-white text-[11px] font-black uppercase tracking-wide">Talk to ALLDost</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <View className="py-16 items-center">
            <ActivityIndicator color="#0a66c2" />
          </View>
        ) : error ? (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-4 gap-2">
            <Text className="text-sm font-semibold text-red-800">Couldn&apos;t load your diary: {error.message}</Text>
            <Pressable onPress={refetchAll}>
              <Text className="text-sm font-bold text-red-800 underline">Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Day totals */}
            <View className="bg-card border border-border rounded-2xl p-4 mb-3">
              <View className="flex-row items-baseline justify-between">
                <Text className="text-[11px] font-black uppercase tracking-wide text-muted-foreground">Calories</Text>
                {log?.session_type && (
                  <Text className="text-[10px] font-black uppercase text-muted-foreground">{log.session_type} day</Text>
                )}
              </View>
              <Text className="text-3xl font-black text-foreground mt-1">
                {log?.total_cal ?? 0}
                <Text className="text-sm font-bold text-muted-foreground">
                  {profile?.daily_cal_target ? ` / ${profile.daily_cal_target} kcal` : ' kcal'}
                </Text>
              </Text>
              {!!log?.cal_burned && (
                <Text className="text-xs font-semibold text-muted-foreground mt-0.5">🔥 {Math.round(log.cal_burned)} kcal burned</Text>
              )}
              <View className="flex-row gap-2 mt-3">
                <MacroPill label="Protein" value={log?.total_protein ?? 0} target={proteinTarget} />
                <MacroPill label="Carbs" value={log?.total_carbs ?? 0} />
                <MacroPill label="Fat" value={log?.total_fat ?? 0} />
              </View>
            </View>

            {/* Meals */}
            <Section icon={<UtensilsCrossed size={20} color="#f97316" />} iconBg="#fed7aa" label="Meals">
              {meals.data!.length === 0 ? (
                <EmptyLine text="No meals logged." />
              ) : (
                groupMeals(meals.data!).map(([type, items]) => (
                  <View key={type} className="mt-2">
                    <Text className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{type}</Text>
                    {items.map((m) => (
                      <View key={m.id} className="flex-row justify-between gap-3 py-1.5 border-b border-border/60">
                        <View className="flex-1">
                          <Text className="text-sm font-bold text-foreground">{m.item}</Text>
                          <Text className="text-[11px] text-muted-foreground">
                            {m.qty ? `${m.qty} · ` : ''}P {m.protein}g · C {m.carbs}g · F {m.fat}g
                          </Text>
                        </View>
                        <Text className="text-sm font-black text-foreground">{m.cal} kcal</Text>
                      </View>
                    ))}
                  </View>
                ))
              )}
            </Section>

            {/* Workouts */}
            <Section icon={<Dumbbell size={20} color="#0a66c2" />} iconBg="#dbeafe" label="Workouts">
              {workouts.data!.length === 0 ? (
                <EmptyLine text="No workout sets logged." />
              ) : (
                workouts.data!.map((w) => (
                  <View key={w.id} className="flex-row justify-between gap-3 py-1.5 border-b border-border/60">
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground">
                        {w.exercise}
                        {w.is_pr ? '  🏆 PR' : ''}
                      </Text>
                      <Text className="text-[11px] text-muted-foreground">
                        {w.sets} × {w.reps}
                        {Number(w.weight_kg) > 0 ? ` @ ${w.weight_kg} kg` : ''}
                      </Text>
                    </View>
                    {!!w.calories_burned && (
                      <Text className="text-sm font-black text-foreground">{w.calories_burned} kcal</Text>
                    )}
                  </View>
                ))
              )}
            </Section>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Section icon={<GlassWater size={20} color="#12a3c4" />} iconBg="#cffafe" label="Water">
                  <Text className="text-2xl font-black text-foreground mt-1">
                    {log?.water_glasses ?? 0}
                    <Text className="text-xs font-bold text-muted-foreground"> glasses</Text>
                  </Text>
                </Section>
              </View>
              <View className="flex-1">
                <Section icon={<Scale size={20} color="#666" />} iconBg="#e5e7eb" label="Weight">
                  {log?.weight ? (
                    <Text className="text-2xl font-black text-foreground mt-1">
                      {log.weight}
                      <Text className="text-xs font-bold text-muted-foreground"> kg</Text>
                    </Text>
                  ) : (
                    <EmptyLine text="Not logged." />
                  )}
                </Section>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function groupMeals(meals: Meal[]): [string, Meal[]][] {
  const groups = new Map<string, Meal[]>();
  for (const m of meals) {
    const type = m.meal_type || 'Other';
    groups.set(type, [...(groups.get(type) ?? []), m]);
  }
  const rank = (t: string) => {
    const i = MEAL_TYPE_ORDER.indexOf(t);
    return i === -1 ? MEAL_TYPE_ORDER.length : i;
  };
  return [...groups.entries()].sort((a, b) => rank(a[0]) - rank(b[0]));
}

function MacroPill({ label, value, target }: { label: string; value: number; target?: number | null }) {
  return (
    <View className="flex-1 bg-muted rounded-xl px-2.5 py-2">
      <Text className="text-[10px] font-black uppercase text-muted-foreground">{label}</Text>
      <Text className="text-sm font-black text-foreground">
        {value}g{target ? <Text className="text-[11px] font-bold text-muted-foreground"> / {target}g</Text> : null}
      </Text>
    </View>
  );
}

function Section({
  icon,
  iconBg,
  label,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="bg-card border border-border rounded-2xl p-4 mb-3">
      <View className="flex-row items-center gap-3">
        <View className="w-9 h-9 rounded-xl items-center justify-center" style={{ backgroundColor: iconBg }}>
          {icon}
        </View>
        <Text className="text-sm font-black text-foreground">{label}</Text>
      </View>
      {children}
    </View>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <Text className="text-xs text-muted-foreground mt-2">{text}</Text>;
}
