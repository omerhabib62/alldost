import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import CustomTabBar from '@/components/CustomTabBar';

/**
 * 4 tabs with a raised center ALLDost logo button for Chat.
 * Layout:  [Feed]  [Diary]   ⦿LOGO⦿   [Crews]  [Profile]
 *
 * Order of Tabs.Screen entries matters — CustomTabBar splits routes
 * around the center: indices 0-1 (Feed, Diary) on left, 2-3 (Crews,
 * Profile) on right.
 */
function TabEmoji({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 18 }}>{emoji}</Text>;
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Feed', tabBarIcon: () => <TabEmoji emoji="🏠" /> }}
      />
      <Tabs.Screen
        name="log"
        options={{ title: 'Diary', tabBarIcon: () => <TabEmoji emoji="📓" /> }}
      />
      <Tabs.Screen
        name="squads"
        options={{ title: 'Crews', tabBarIcon: () => <TabEmoji emoji="👥" /> }}
      />
      <Tabs.Screen
        name="me"
        options={{ title: 'Profile', tabBarIcon: () => <TabEmoji emoji="👤" /> }}
      />
    </Tabs>
  );
}
