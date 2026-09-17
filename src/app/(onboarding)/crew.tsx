import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

/**
 * Sprint 11 STUB — Step 3 of onboarding. CREW-FIRST is the ALLDost thesis:
 * every user joins/creates at least one squad before entering the app.
 *
 * Sprint 12 wires: join_squad_by_code RPC or create_squad RPC → redirect (app).
 */
export default function OnboardingCrewScreen() {
  const router = useRouter();

  const finish = () => {
    // Sprint 12: only allow finish after crew joined/created.
    router.replace('/(app)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6 justify-between pb-16">
      <View className="pt-16 gap-2">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-[2px]">Step 3 of 3</Text>
        <Text className="text-[28px] leading-[52px] font-black text-foreground">Bring your crew</Text>
        <Text className="text-sm font-medium text-muted-foreground">
          ALLDost is designed for crews. Join an existing one with a code, or start yours.
        </Text>
      </View>

      <View className="gap-4">
        <Pressable className="p-6 rounded-2xl border-[1.5px] border-gray-200 bg-gray-50 gap-1.5" onPress={finish}>
          <Text className="text-base font-extrabold text-foreground">Join with a code</Text>
          <Text className="text-sm font-medium text-muted-foreground">
            Got a 6-character code from a friend? Enter it here. (Sprint 12)
          </Text>
        </Pressable>

        <Pressable className="p-6 rounded-2xl border-[1.5px] border-gray-200 bg-gray-50 gap-1.5" onPress={finish}>
          <Text className="text-base font-extrabold text-foreground">Create a crew</Text>
          <Text className="text-sm font-medium text-muted-foreground">
            Start one for your maidan group, gym buddies, or cricket team. (Sprint 12)
          </Text>
        </Pressable>

        <Pressable onPress={finish}>
          <Text className="text-sm text-center font-bold text-muted-foreground py-2">Skip for now →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
