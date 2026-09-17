import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';

import AppLogo from '@/components/AppLogo';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async () => {
    setErrorMsg(null);
    if (!email.trim() || !password) {
      setErrorMsg('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    router.replace('/(app)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6 justify-center gap-16">
      <View className="items-center gap-2">
        <AppLogo size={64} />
        <Text className="text-[40px] leading-[52px] font-black tracking-[-1px] text-foreground">ALLDost</Text>
        <Text className="text-sm font-medium text-muted-foreground text-center max-w-[300px]">
          Log your matches, PRs, workouts. Share with your crew.
        </Text>
      </View>

      <View className="gap-2 max-w-[400px] w-full self-center">
        {errorMsg && (
          <View className="bg-red-50 border border-red-200 rounded-xl p-4">
            <Text className="text-sm font-semibold text-red-800">{errorMsg}</Text>
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

        <Text className="text-sm font-medium text-muted-foreground mt-2 mb-0.5">Password</Text>
        <TextInput
          value={password}
          onChangeText={(v) => { setErrorMsg(null); setPassword(v); }}
          autoCapitalize="none"
          autoComplete="current-password"
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
            {submitting ? 'Signing in…' : 'Sign in'}
          </Text>
        </Pressable>

        <View className="flex-row justify-center gap-2 mt-4">
          <Text className="text-sm font-medium text-muted-foreground">New here?</Text>
          <Link href="/(auth)/signup" asChild>
            <Pressable>
              <Text className="text-sm font-bold underline text-foreground">Create an account</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
