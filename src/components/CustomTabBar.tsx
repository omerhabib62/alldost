/**
 * CustomTabBar — bottom nav with 4 tabs + a raised center ALLDost logo
 * that opens the chat modal.
 *
 * Layout:  [Feed]  [Diary]   ⦿LOGO⦿   [Crews]  [Profile]
 *
 * The center logo is NOT a tab route — it's a Pressable that pushes /chat.
 * Same pattern as Instagram's + button, Snapchat's camera, etc.
 */

import { View, Text, Pressable } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppLogo from '@/components/AppLogo';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Split visible tabs around the center logo. We render tab index 0-1 on
  // the left, 2-3 on the right, and the logo Pressable in the middle.
  const routes = state.routes;

  return (
    <View
      className="flex-row bg-card border-t border-border"
      style={{ paddingBottom: insets.bottom, height: 62 + insets.bottom }}
    >
      {/* Left cluster — tabs 0 and 1 */}
      <TabButton state={state} descriptors={descriptors} navigation={navigation} routeIndex={0} />
      <TabButton state={state} descriptors={descriptors} navigation={navigation} routeIndex={1} />

      {/* Center — raised ALLDost logo button opening /chat */}
      <View className="flex-1 items-center justify-start">
        <Pressable
          onPress={() => router.push('/chat' as any)}
          className="items-center justify-center"
          style={{
            marginTop: -18,
            width: 62,
            height: 62,
            borderRadius: 31,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#0a66c2',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 10,
          }}
          accessibilityLabel="Talk to ALLDost"
        >
          <AppLogo size={54} />
        </Pressable>
        <Text className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-1">
          Chat
        </Text>
      </View>

      {/* Right cluster — tabs 2 and 3 */}
      <TabButton state={state} descriptors={descriptors} navigation={navigation} routeIndex={2} />
      <TabButton state={state} descriptors={descriptors} navigation={navigation} routeIndex={3} />
    </View>
  );
}

function TabButton({
  state,
  descriptors,
  navigation,
  routeIndex,
}: BottomTabBarProps & { routeIndex: number }) {
  const route = state.routes[routeIndex];
  if (!route) return <View className="flex-1" />;

  const { options } = descriptors[route.key];
  const isFocused = state.index === routeIndex;
  const label =
    typeof options.tabBarLabel === 'string'
      ? options.tabBarLabel
      : typeof options.title === 'string'
        ? options.title
        : route.name;

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center justify-center py-2"
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={label}
    >
      {options.tabBarIcon &&
        options.tabBarIcon({
          focused: isFocused,
          color: isFocused ? '#0a66c2' : '#9ca3af',
          size: 20,
        })}
      <Text
        className={`text-[10px] font-black mt-0.5 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
