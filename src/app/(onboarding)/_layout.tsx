import { Stack } from 'expo-router';

/**
 * Onboarding flow. `profile` holds the 3 saving steps (bio, goal, targets →
 * profiles upsert). `sports` and `crew` follow as not-yet-persisted previews.
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
