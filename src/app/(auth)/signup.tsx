import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async () => {
    setErrorMsg(null);
    setInfoMsg(null);
    if (!email.trim() || !password) {
      setErrorMsg('Enter your email and password.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });
    setSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    if (!data.session) {
      setInfoMsg('Check your email to confirm your account, then sign in.');
      return;
    }
    router.replace('/(onboarding)/profile');
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6 justify-center gap-16">
      <View className="items-center gap-2">
        <Text className="text-[32px] leading-[52px] font-black tracking-[-1px] text-foreground">Join ALLDost</Text>
        <Text className="text-sm font-medium text-muted-foreground text-center max-w-[300px]">
          Bring your crew. Cricket · Futsal · Gym · Running.
        </Text>
      </View>

      <View className="gap-2 max-w-[400px] w-full self-center">
        {errorMsg && (
          <View className="bg-red-50 border border-red-200 rounded-xl p-4">
            <Text className="text-sm font-semibold text-red-800">{errorMsg}</Text>
          </View>
        )}
        {infoMsg && (
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Text className="text-sm font-semibold text-blue-800">{infoMsg}</Text>
          </View>
        )}

        <Text className="text-sm font-medium text-muted-foreground mt-2 mb-0.5">Email</Text>
        <TextInput
          value={email}
          onChangeText={(v) => { setErrorMsg(null); setEmail(v); }}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor="#9ca3af"
          className="border border-gray-200 rounded-xl px-4 py-2 text-[15px] text-gray-900 bg-gray-50"
        />

        <Text className="text-sm font-medium text-muted-foreground mt-2 mb-0.5">Password (8+ chars)</Text>
        <TextInput
          value={password}
          onChangeText={(v) => { setErrorMsg(null); setPassword(v); }}
          autoCapitalize="none"
          autoComplete="new-password"
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
          className="border border-gray-200 rounded-xl px-4 py-2 text-[15px] text-gray-900 bg-gray-50"
        />

        <Pressable
          onPress={onSubmit}
          disabled={submitting}
          className={`mt-4 bg-slate-900 rounded-xl py-4 items-center ${submitting ? 'opacity-50' : ''}`}
        >
          <Text className="text-sm font-extrabold tracking-[0.5px] text-white">
            {submitting ? 'Creating account…' : 'Create account'}
          </Text>
        </Pressable>

        <View className="flex-row flex-wrap justify-center gap-2 mt-4">
          <Text className="text-sm font-medium text-muted-foreground">Already have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-sm font-bold underline text-foreground">Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
