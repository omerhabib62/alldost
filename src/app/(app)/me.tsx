import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';

/**
 * Sprint 11 STUB — Me tab (profile + settings). Sprint 13 wires the real
 * profile view + edit. Sign out actually works now.
 */
export default function MeScreen() {
  const { session } = useSession();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Sign out failed', error.message);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>Me</ThemedText>

        <View style={styles.card}>
          <ThemedText type="small" style={styles.label}>Signed in as</ThemedText>
          <ThemedText type="small" style={styles.value}>
            {session?.user.email ?? '—'}
          </ThemedText>
        </View>

        <ThemedText type="small" style={styles.sub}>
          Profile edit + settings ship in Sprint 13.
        </ThemedText>

        <Pressable onPress={signOut} style={styles.signOut}>
          <ThemedText type="small" style={styles.signOutText}>Sign out</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, paddingTop: Spacing.four, gap: Spacing.three },
  title: { fontSize: 28, fontWeight: '900' },
  card: {
    padding: Spacing.four,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    gap: 4,
  },
  label: { opacity: 0.5, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontWeight: '700', fontSize: 15 },
  sub: { opacity: 0.5 },
  signOut: {
    marginTop: 'auto',
    marginBottom: Spacing.four,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  signOutText: { color: '#991b1b', fontWeight: '800' },
});
