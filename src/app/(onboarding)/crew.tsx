import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

/**
 * Onboarding extra (after the profile is saved). CREW-FIRST is the ALLDost
 * thesis, but NOT WIRED: the squads migration has tables only — no
 * create_squad / join_squad_by_code functions — so every option just
 * continues into the app, and the copy says so.
 */
export default function OnboardingCrewScreen() {
  const router = useRouter();

  const finish = () => {
    router.replace('/(app)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6 justify-between pb-16">
      <View className="pt-16 gap-2">
        <Text className="text-sm font-medium text-muted-foreground uppercase tracking-[2px]">Optional · not saved yet</Text>
        <Text className="text-[28px] leading-[52px] font-black text-foreground">Bring your crew</Text>
        <Text className="text-sm font-medium text-muted-foreground">
          ALLDost is designed for crews. Joining and creating crews is coming soon — nothing here is saved yet.
        </Text>
      </View>

      <View className="gap-4">
        <Pressable className="p-6 rounded-2xl border-[1.5px] border-gray-200 bg-gray-50 gap-1.5" onPress={finish}>
          <Text className="text-base font-extrabold text-foreground">Join with a code</Text>
          <Text className="text-sm font-medium text-muted-foreground">
            Got a 6-character code from a friend? Coming soon.
          </Text>
        </Pressable>

        <Pressable className="p-6 rounded-2xl border-[1.5px] border-gray-200 bg-gray-50 gap-1.5" onPress={finish}>
          <Text className="text-base font-extrabold text-foreground">Create a crew</Text>
          <Text className="text-sm font-medium text-muted-foreground">
            Start one for your maidan group, gym buddies, or cricket team. Coming soon.
          </Text>
        </Pressable>

        <Pressable onPress={finish}>
          <Text className="text-sm text-center font-bold text-muted-foreground py-2">Continue to the app →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
