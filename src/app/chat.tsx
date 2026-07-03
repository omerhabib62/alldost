import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { X, MessageSquareText } from 'lucide-react-native';

import AppLogo from '@/components/AppLogo';

/**
 * /chat — the conversational logging screen. Not a tab, opened via the
 * FAB on Feed OR the "Talk to ALLDost" button in Diary.
 *
 * Sprint 12: stub screen with close button + coming-soon copy.
 * Sprint 13 wires the full Gemini chat interface with:
 *   - Message list (user + coach turns)
 *   - Composite meal decomposition preview
 *   - Cancel button while API is in-flight
 *   - Voice input
 * Same UX shape as the web /chat page — mostly a port of ChatInterface.
 */
export default function ChatScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-card">
          <View className="flex-row items-center gap-2">
            <AppLogo size={32} />
            <View>
              <Text className="text-sm font-black text-foreground">ALLDost Coach</Text>
              <Text className="text-[10px] text-muted-foreground">Active & listening in Urdu/English</Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full bg-muted items-center justify-center"
            accessibilityLabel="Close chat"
          >
            <X size={18} color="#666" />
          </Pressable>
        </View>

        {/* Body */}
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-16 h-16 rounded-3xl bg-primary/10 items-center justify-center mb-4">
            <MessageSquareText size={30} color="#0a66c2" />
          </View>
          <Text className="text-lg font-black text-foreground text-center">
            Chat with ALLDost
          </Text>
          <Text className="text-xs text-muted-foreground text-center mt-2 max-w-xs leading-relaxed">
            Type &quot;3 anday nashta&quot; or &quot;played futsal 30 min vigorous&quot; and ALLDost logs it. Coming in Sprint 13.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-6 border border-border rounded-2xl px-5 py-2.5"
          >
            <Text className="text-muted-foreground text-xs font-black uppercase tracking-wide">Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
