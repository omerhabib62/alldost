import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Sprint 11 STUB — Crews tab. Sprint 12 wires the squad listing (your crews)
 * + create/join CTAs. Detail per squad wires in Sprint 14.
 */
export default function SquadsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-6 pt-6 gap-4">
      <Text className="text-[28px] leading-[52px] font-black text-foreground">Your Crews</Text>
      <Text className="text-sm font-medium text-muted-foreground max-w-[320px]">
        Sprint 12 wires your crew list + create/join. Sprint 14 adds the feed and leaderboard per crew.
      </Text>
    </SafeAreaView>
  );
}
