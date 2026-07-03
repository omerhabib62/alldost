import { Tabs } from 'expo-router';
import { Text } from 'react-native';

/**
 * 4-tab main app. Icons are text emoji for Sprint 11 seed —
 * Sprint 12 swaps in proper icons via lucide-react-native or
 * @expo/vector-icons.
 *
 * Tabs mirror the wedge: Feed · Log · Crews · Me.
 */
function TabEmoji({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 18 }}>{emoji}</Text>;
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 8 },
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
        options={{ title: 'Me', tabBarIcon: () => <TabEmoji emoji="👤" /> }}
      />
    </Tabs>
  );
}
