import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

/**
 * Sprint 11 STUB — Crews tab. Sprint 12 wires the squad listing (your crews)
 * + create/join CTAs. Detail per squad wires in Sprint 14.
 */
export default function SquadsScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>Your Crews</ThemedText>
        <ThemedText type="small" style={styles.sub}>
          Sprint 12 wires your crew list + create/join. Sprint 14 adds the feed and leaderboard per crew.
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, paddingTop: Spacing.four, gap: Spacing.three },
  title: { fontSize: 28, fontWeight: '900' },
  sub: { opacity: 0.6, maxWidth: 320 },
});
