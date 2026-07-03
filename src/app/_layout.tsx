import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import { useSession } from '@/hooks/useSession';

SplashScreen.preventAutoHideAsync();

/**
 * Route protection.
 *  - Not signed in + not in (auth) → redirect to /login
 *  - Signed in + in (auth) → redirect to /(app)
 *
 * Onboarding gating (profile + crew completion) is added in Sprint 12 once
 * profile + crew tables/queries are wired. For now, signed-in users go
 * straight to (app).
 */
function useProtectedRoute(sessionReady: boolean, isSignedIn: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!sessionReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isSignedIn && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [sessionReady, isSignedIn, segments, router]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();

  useProtectedRoute(!isLoading, !!session);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
