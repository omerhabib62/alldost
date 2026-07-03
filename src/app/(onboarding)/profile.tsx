import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

/**
 * Sprint 11 STUB — Step 1 of onboarding.
 * Sprint 12 wires: name, DOB, gender, height, weight, units → upsert profiles row.
 */
export default function OnboardingProfileScreen() {
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.top}>
          <ThemedText type="small" style={styles.step}>Step 1 of 3</ThemedText>
          <ThemedText type="title" style={styles.title}>Tell us about you</ThemedText>
          <ThemedText type="small" style={styles.sub}>
            Sprint 11 stub — full form comes in Sprint 12.
          </ThemedText>
        </View>

        <Pressable onPress={() => router.push('/(onboarding)/sports')} style={styles.next}>
          <ThemedText type="small" style={styles.nextText}>Next: pick your sports →</ThemedText>
        </Pressable>
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
  next: { backgroundColor: '#0f172a', borderRadius: 12, paddingVertical: Spacing.three, alignItems: 'center' },
  nextText: { color: 'white', fontWeight: '800' },
});
