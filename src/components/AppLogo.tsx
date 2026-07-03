/**
 * AppLogo — the gradient A badge used across ALLDost native.
 * Same gradient stops as the web app's /public/logo.svg
 * (#FF4F00 → #00C6FF). Renders as a rounded square with an 'A'
 * inside, sized by the `size` prop.
 */

import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AppLogoProps {
  size?: number;
  radiusRatio?: number; // 0-1, defaults to ~0.22 (matches web logo.svg)
}

export default function AppLogo({ size = 40, radiusRatio = 0.22 }: AppLogoProps) {
  const borderRadius = size * radiusRatio;
  const fontSize = size * 0.55;

  return (
    <LinearGradient
      colors={['#FF4F00', '#00C6FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: '#0b0f14',
          fontSize,
          fontWeight: '900',
          textAlign: 'center',
          lineHeight: size,
        }}
      >
        A
      </Text>
    </LinearGradient>
  );
}

/** Compact logo + wordmark, used in headers. */
export function AppLogoWithWordmark({ size = 36 }: { size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <AppLogo size={size} />
      <Text style={{ fontSize: size * 0.55, fontWeight: '900', color: '#0a66c2', letterSpacing: -0.5 }}>
        ALLDost
      </Text>
    </View>
  );
}
