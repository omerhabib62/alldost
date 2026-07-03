import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

/**
 * Sprint 11 STUB — Log tab. Sprint 13 wires the chat-based logging flow +
 * Gemini parse + workout_sets/meals/activity_burns writes.
 */
export default function LogScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>Log</ThemedText>
        <ThemedText type="small" style={styles.sub}>
          Chat-based logging (Sprint 13). Type &quot;played futsal 30 min vigorous&quot; and it lands here.
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
