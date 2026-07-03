/**
 * CustomTabBar — bottom nav with 4 tabs + a center ALLDost logo button
 * that opens the chat modal.
 *
 * Layout:  [Feed]  [Diary]   ⦿LOGO⦿   [Crews]  [Profile]
 *
 * Center logo: NOT a tab route — a Pressable that pushes /chat.
 * Sized to fit within the tab bar area (no white backdrop, no
 * over-flowing offset). Same pattern as Instagram + / Snapchat camera.
 *
 * Active tab indication: colored top-stripe over the active tab + label
 * and icon color shift. Removes ambiguity about which screen is current.
 */

import { View, Text, Pressable } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppLogo from '@/components/AppLogo';

const ACTIVE_COLOR = '#0a66c2';
const INACTIVE_COLOR = '#9ca3af';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-card border-t border-border"
      style={{ paddingBottom: insets.bottom, height: 64 + insets.bottom }}
    >
      {/* Left cluster */}
      <TabButton state={state} descriptors={descriptors} navigation={navigation} routeIndex={0} />
      <TabButton state={state} descriptors={descriptors} navigation={navigation} routeIndex={1} />

      {/* Center — circular ALLDost logo → /chat. */}
      <View className="flex-1 items-center justify-center">
        <Pressable
          onPress={() => router.push('/chat' as any)}
          className="items-center justify-center"
          accessibilityLabel="Talk to ALLDost"
          hitSlop={12}
        >
          <AppLogo size={44} radiusRatio={0.5} />
          <Text className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-1">
            Chat
          </Text>
        </Pressable>
      </View>

      {/* Right cluster */}
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
      className="flex-1 items-center justify-center py-1.5"
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={label}
    >
      {/* Active-tab top stripe — thicker/wider so it reads as a clear
          selection marker. */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: 4,
          borderRadius: 2,
          backgroundColor: isFocused ? ACTIVE_COLOR : 'transparent',
        }}
      />
      {/* Rounded pill background under the active tab — makes the state
          unambiguous. Inactive tabs stay flat. */}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 4,
          paddingHorizontal: 12,
          borderRadius: 14,
          backgroundColor: isFocused ? 'rgba(10,102,194,0.10)' : 'transparent',
        }}
      >
        {options.tabBarIcon &&
          options.tabBarIcon({
            focused: isFocused,
            color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR,
            size: 20,
          })}
        <Text
          className={`text-[10px] font-black mt-0.5 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
