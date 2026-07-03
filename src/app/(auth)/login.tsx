import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Enter your email and password.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setSubmitting(false);
    if (error) {
      Alert.alert('Sign in failed', error.message);
      return;
    }
    router.replace('/(app)');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hero}>
          <ThemedText type="title" style={styles.brand}>ALLDost</ThemedText>
          <ThemedText type="small" style={styles.tag}>
            Log your matches, PRs, workouts. Share with your crew.
          </ThemedText>
        </View>

        <View style={styles.form}>
          <ThemedText type="small" style={styles.label}>Email</ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />

          <ThemedText type="small" style={styles.label}>Password</ThemedText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoComplete="current-password"
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />

          <Pressable
            onPress={onSubmit}
            disabled={submitting}
            style={[styles.button, submitting && styles.buttonDisabled]}
          >
            <ThemedText type="small" style={styles.buttonText}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </ThemedText>
          </Pressable>

          <View style={styles.footerRow}>
            <ThemedText type="small" style={styles.footerText}>New here?</ThemedText>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <ThemedText type="small" style={styles.link}>Create an account</ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, justifyContent: 'center', gap: Spacing.six },
  hero: { alignItems: 'center', gap: Spacing.two },
  brand: { fontSize: 40, fontWeight: '900', letterSpacing: -1 },
  tag: { opacity: 0.7, textAlign: 'center', maxWidth: 300 },
  form: { gap: Spacing.two, maxWidth: 400, width: '100%', alignSelf: 'center' },
  label: { opacity: 0.7, marginBottom: 2, marginTop: Spacing.two },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  button: {
    marginTop: Spacing.three,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: 'white', fontWeight: '800', letterSpacing: 0.5 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.two, marginTop: Spacing.three },
  footerText: { opacity: 0.6 },
  link: { fontWeight: '700', textDecorationLine: 'underline' },
});
