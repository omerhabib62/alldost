import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/hooks/useSession';

/**
 * Sprint 11 STUB — Feed tab. Sprint 14 replaces this with the actual squad
 * activity feed (merged log across your crews, most recent first).
 */
export default function FeedScreen() {
  const { session } = useSession();
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>Feed</ThemedText>
        <View style={styles.empty}>
          <ThemedText type="small" style={styles.emptyText}>
            Nothing here yet. Once you and your crew log activities, they show up here.
          </ThemedText>
          {session && (
            <ThemedText type="small" style={styles.signedInAs}>
              Signed in as {session.user.email}
            </ThemedText>
          )}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, paddingTop: Spacing.four },
  title: { fontSize: 28, fontWeight: '900' },
  empty: { marginTop: Spacing.six, gap: Spacing.two, alignItems: 'center' },
  emptyText: { opacity: 0.6, textAlign: 'center', maxWidth: 300 },
  signedInAs: { opacity: 0.4, marginTop: Spacing.three },
});
