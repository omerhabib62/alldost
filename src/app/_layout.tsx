import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';

import { runApiLogProbe } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useSession } from '@/hooks/useSession';
import { useProfile } from '@/hooks/useProfile';

SplashScreen.preventAutoHideAsync();

/**
 * Route protection.
 *  - Not signed in + not in (auth) → /login
 *  - Signed in, no profile row or needs_onboarding=TRUE → /(onboarding)/profile
 *    (same rule as the web dashboard; /api/log 404s without a profile row)
 *  - Signed in + onboarded + in (auth) → /(app)
 *
 * Onboarded users are not bounced out of (onboarding): the profile is saved
 * at the end of step 3, and the Sports/Crew screens come after it.
 * If the profile query errors (e.g. offline) we don't redirect — sending an
 * onboarded user to the form would risk overwriting their targets.
 */
function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { session, isLoading: sessionLoading } = useSession();
  const { data: profile, isPending: profilePending, isError: profileError } = useProfile();

  const isSignedIn = !!session;
  const ready = !sessionLoading && (!isSignedIn || !profilePending || profileError);

  useEffect(() => {
    if (!ready) return;

    const group = segments[0];
    const needsOnboarding = profile === null || profile?.needs_onboarding === true;

    if (!isSignedIn) {
      if (group !== '(auth)') router.replace('/(auth)/login');
    } else if (needsOnboarding) {
      if (group !== '(onboarding)') router.replace('/(onboarding)/profile');
    } else if (group === '(auth)') {
      router.replace('/(app)');
    }
  }, [ready, isSignedIn, profile, segments, router]);

  return { ready, userId: session?.user?.id };
}

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { ready, userId } = useProtectedRoute();

  useEffect(() => {
    if (__DEV__ && process.env.EXPO_PUBLIC_API_PROBE === '1' && userId) {
      runApiLogProbe();
    }
  }, [userId]);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  // useProfile needs the QueryClient, so route protection lives one level down.
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
