import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 4-tab main app. Icons are text emoji for Sprint 11 seed —
 * Sprint 12 swaps in proper icons via lucide-react-native.
 *
 * Tabs mirror the wedge: Feed · Log · Crews · Me.
 *
 * SafeArea handling: Android gesture / navigation bar sits at screen
 * bottom and covers the tab bar without this padding. useSafeAreaInsets
 * gives us the actual inset — respected on Android + iOS + web.
 */
function TabEmoji({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 18 }}>{emoji}</Text>;
}

export default function AppLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '800' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Feed', tabBarIcon: () => <TabEmoji emoji="🏠" /> }}
      />
      <Tabs.Screen
        name="log"
        options={{ title: 'Log', tabBarIcon: () => <TabEmoji emoji="➕" /> }}
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
