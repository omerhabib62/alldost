import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';

/**
 * Sprint 11 seed screen — ALLDost first-run landing.
 * Verifies:
 *  - Expo Router renders
 *  - Supabase client reachable (auth.getSession() returns without error)
 *  - Session hook subscribes correctly
 *
 * Sprint 12 will replace this with the real onboarding flow.
 */
export default function HomeScreen() {
  const { session, isLoading } = useSession();
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'ok' | 'fail'>('checking');

  useEffect(() => {
    supabase.auth.getSession()
      .then(() => setSupabaseStatus('ok'))
      .catch(() => setSupabaseStatus('fail'));
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            ALLDost
          </ThemedText>
          <ThemedText type="small" style={styles.subtitle}>
            Active Lifestyle Lover — Dost
          </ThemedText>
          <ThemedText type="small" style={styles.tagline}>
            The social platform for active Pakistanis. Cricket · Futsal · Gym · Running.
          </ThemedText>
        </View>

        <ThemedView type="backgroundElement" style={styles.statusCard}>
          <StatusRow label="Expo Router" value="✓ Live" ok />
          <StatusRow
            label="Supabase"
            value={supabaseStatus === 'checking' ? '…' : supabaseStatus === 'ok' ? '✓ Connected' : '✗ Fail'}
            ok={supabaseStatus === 'ok'}
          />
          <StatusRow
            label="Session"
            value={isLoading ? '…' : session ? `✓ ${session.user.email}` : '✗ Not signed in'}
            ok={!isLoading && !!session}
          />
          <StatusRow label="Platform" value={Platform.OS} ok />
        </ThemedView>

        <ThemedText type="small" style={styles.footnote}>
          Sprint 11 seed · v0.0.1 · 03 Jul 2026
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

function StatusRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <View style={styles.row}>
      <ThemedText type="small" style={styles.rowLabel}>{label}</ThemedText>
      <ThemedText type="small" style={ok ? styles.rowValueOk : styles.rowValueBad}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', flexDirection: 'row' },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  title: { textAlign: 'center', fontSize: 40, fontWeight: '900', letterSpacing: -1 },
  subtitle: { textAlign: 'center', opacity: 0.6, textTransform: 'uppercase', letterSpacing: 2 },
  tagline: { textAlign: 'center', marginTop: Spacing.two, opacity: 0.85 },
  statusCard: {
    gap: Spacing.two,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { opacity: 0.7 },
  rowValueOk: { fontWeight: '700', color: '#10b981' },
  rowValueBad: { fontWeight: '700', color: '#ef4444' },
  footnote: { opacity: 0.4, marginBottom: Spacing.two },
});
