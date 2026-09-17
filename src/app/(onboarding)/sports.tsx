import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

/**
 * Sprint 11 STUB — Step 2 of onboarding.
 * Sprint 12 wires: user_sports insert with selected sports as primary + secondary.
 *
 * 4 launch sports locked per ALLDost positioning doc.
 */

const LAUNCH_SPORTS = [
  { key: 'futsal', label: 'Futsal', emoji: '⚽' },
  { key: 'gym', label: 'Gym / Weightlifting', emoji: '🏋️' },
  { key: 'cricket', label: 'Cricket', emoji: '🏏' },
  { key: 'running', label: 'Running / Walking', emoji: '🏃' },
] as const;

export default function OnboardingSportsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const canContinue = selected.size >= 1;

  return (
    <SafeAreaView className="flex-1 bg-background px-6 justify-between pb-16">
      <View className="pt-16 gap-2">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-[2px]">Step 2 of 3</Text>
        <Text className="text-[28px] leading-[52px] font-black text-foreground">What sports do you do?</Text>
        <Text className="text-sm font-medium text-muted-foreground">
          Pick at least one. You can add more later.
        </Text>
      </View>

      <View className="gap-2">
        {LAUNCH_SPORTS.map((s) => {
          const isOn = selected.has(s.key);
          return (
            <Pressable
              key={s.key}
              onPress={() => toggle(s.key)}
              className={`flex-row items-center gap-4 py-4 px-6 rounded-[14px] border-[1.5px] ${
                isOn ? 'border-slate-900 bg-indigo-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <Text className="text-[22px]">{s.emoji}</Text>
              <Text className="flex-1 text-sm font-bold text-foreground">{s.label}</Text>
              <Text className="text-sm font-black text-slate-900">{isOn ? '✓' : ''}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => canContinue && router.push('/(onboarding)/crew')}
        className={`bg-slate-900 rounded-xl py-4 items-center ${canContinue ? '' : 'opacity-35'}`}
        disabled={!canContinue}
      >
        <Text className="text-sm font-extrabold text-white">
          {canContinue ? 'Next: join or create your crew →' : 'Pick at least one sport'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
