import { Stack } from 'expo-router';

/**
 * Onboarding flow — 3 steps. Sprint 12 will wire them to backend calls
 * (upsert profile, insert into user_sports, join/create squad).
 * For Sprint 11 seed these are placeholders that route correctly.
 */
export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="profile" />
      <Stack.Screen name="sports" />
      <Stack.Screen name="crew" />
    </Stack>
  );
}
