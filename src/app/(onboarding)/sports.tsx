import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

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
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.top}>
          <ThemedText type="small" style={styles.step}>Step 2 of 3</ThemedText>
          <ThemedText type="title" style={styles.title}>What sports do you do?</ThemedText>
          <ThemedText type="small" style={styles.sub}>
            Pick at least one. You can add more later.
          </ThemedText>
        </View>

        <View style={styles.list}>
          {LAUNCH_SPORTS.map((s) => {
            const isOn = selected.has(s.key);
            return (
              <Pressable
                key={s.key}
                onPress={() => toggle(s.key)}
                style={[styles.card, isOn && styles.cardOn]}
              >
                <ThemedText type="small" style={styles.emoji}>{s.emoji}</ThemedText>
                <ThemedText type="small" style={styles.label}>{s.label}</ThemedText>
                <ThemedText type="small" style={styles.check}>{isOn ? '✓' : ''}</ThemedText>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => canContinue && router.push('/(onboarding)/crew')}
          style={[styles.next, !canContinue && styles.nextDisabled]}
          disabled={!canContinue}
        >
          <ThemedText type="small" style={styles.nextText}>
            {canContinue ? 'Next: join or create your crew →' : 'Pick at least one sport'}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'space-between',
    paddingBottom: Spacing.six,
  },
  top: { paddingTop: Spacing.six, gap: Spacing.two },
  step: { opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2 },
  title: { fontSize: 28, fontWeight: '900' },
  sub: { opacity: 0.6 },
  list: { gap: Spacing.two },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  cardOn: {
    borderColor: '#0f172a',
    backgroundColor: '#eef2ff',
  },
  emoji: { fontSize: 22 },
  label: { flex: 1, fontWeight: '700' },
  check: { fontWeight: '900', color: '#0f172a' },
  next: { backgroundColor: '#0f172a', borderRadius: 12, paddingVertical: Spacing.three, alignItems: 'center' },
  nextDisabled: { opacity: 0.35 },
  nextText: { color: 'white', fontWeight: '800' },
});
