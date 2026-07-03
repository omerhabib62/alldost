import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

/**
 * Sprint 11 STUB — Step 3 of onboarding. CREW-FIRST is the ALLDost thesis:
 * every user joins/creates at least one squad before entering the app.
 *
 * Sprint 12 wires: join_squad_by_code RPC or create_squad RPC → redirect (app).
 */
export default function OnboardingCrewScreen() {
  const router = useRouter();

  const finish = () => {
    // Sprint 12: only allow finish after crew joined/created.
    router.replace('/(app)');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.top}>
          <ThemedText type="small" style={styles.step}>Step 3 of 3</ThemedText>
          <ThemedText type="title" style={styles.title}>Bring your crew</ThemedText>
          <ThemedText type="small" style={styles.sub}>
            ALLDost is designed for crews. Join an existing one with a code, or start yours.
          </ThemedText>
        </View>

        <View style={styles.options}>
          <Pressable style={styles.option} onPress={finish}>
            <ThemedText type="small" style={styles.optionTitle}>Join with a code</ThemedText>
            <ThemedText type="small" style={styles.optionSub}>
              Got a 6-character code from a friend? Enter it here. (Sprint 12)
            </ThemedText>
          </Pressable>

          <Pressable style={styles.option} onPress={finish}>
            <ThemedText type="small" style={styles.optionTitle}>Create a crew</ThemedText>
            <ThemedText type="small" style={styles.optionSub}>
              Start one for your maidan group, gym buddies, or cricket team. (Sprint 12)
            </ThemedText>
          </Pressable>

          <Pressable onPress={finish}>
            <ThemedText type="small" style={styles.skip}>Skip for now →</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, justifyContent: 'space-between', paddingBottom: Spacing.six },
  top: { paddingTop: Spacing.six, gap: Spacing.two },
  step: { opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2 },
  title: { fontSize: 28, fontWeight: '900' },
  sub: { opacity: 0.6 },
  options: { gap: Spacing.three },
  option: {
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    gap: 6,
  },
  optionTitle: { fontWeight: '800', fontSize: 16 },
  optionSub: { opacity: 0.65 },
  skip: { textAlign: 'center', opacity: 0.6, fontWeight: '700', paddingVertical: Spacing.two },
});
