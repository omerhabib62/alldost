import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

/**
 * Sprint 11 STUB — Step 1 of onboarding.
 * Sprint 12 wires: name, DOB, gender, height, weight, units → upsert profiles row.
 */
export default function OnboardingProfileScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background px-6 justify-between pb-16">
      <View className="pt-16 gap-2">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-[2px]">Step 1 of 3</Text>
        <Text className="text-[28px] leading-[52px] font-black text-foreground">Tell us about you</Text>
        <Text className="text-sm font-medium text-muted-foreground">
          Sprint 11 stub — full form comes in Sprint 12.
        </Text>
      </View>

      <Pressable onPress={() => router.push('/(onboarding)/sports')} className="bg-slate-900 rounded-xl py-4 items-center">
        <Text className="text-sm font-extrabold text-white">Next: pick your sports →</Text>
      </Pressable>
    </SafeAreaView>
  );
}
