import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Send, Square, Trash2, X } from 'lucide-react-native';

import AppLogo from '@/components/AppLogo';
import { ApiError, apiFetch } from '@/lib/api';
import { useSession } from '@/hooks/useSession';
import { useChatStore, welcomeMessage, type ChatMessage } from '@/store/useChatStore';
import { useUiStore } from '@/store/useUiStore';

/**
 * /chat — conversational logging. Native port of the web ChatInterface:
 * POST /api/log { message, date, history } with the Bearer session token,
 * coach reply appended, every query invalidated on success so Diary/Feed/
 * Profile refetch. Voice input is not ported yet.
 */

const MAX_CHARS = 500; // enforced server-side too
const SLOW_NOTICE_MS = 15_000;
const HARD_TIMEOUT_MS = 75_000;

const SUGGESTIONS = [
  '2 fried eggs and 1 chapati at 9am',
  '+2 glasses of water',
  'weighed 94.2kg today',
  'ran 5km in 30 min',
];

interface LogResponse {
  success: boolean;
  response: string;
}

function friendlyError(err: unknown): string {
  if (err instanceof ApiError) {
    const serverMsg = (err.body as { error?: string } | null)?.error;
    if (err.status === 401) return 'Your session has expired. Please sign out and sign in again.';
    if (err.status === 404) return "Your profile isn't set up yet. Finish onboarding, then try again.";
    if (err.status === 504) return 'Mai thoda slow ho gaya. Try again — usually faster the second time.';
    if (err.status === 400 && serverMsg) return serverMsg;
    return "Sorry yaar, something went wrong on my end. Give it another shot?";
  }
  if (err instanceof Error && err.name === 'AbortError') {
    return 'Mai thoda slow ho gaya. Try again — usually faster the second time.';
  }
  return "Looks like the internet's having a moment. Check your connection and retry?";
}

export default function ChatScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useSession();
  const userId = session?.user?.id ?? 'guest';
  const selectedDate = useUiStore((s) => s.selectedDate);

  const messages = useChatStore((s) => s.histories[userId]) ?? [welcomeMessage()];
  const addMessage = useChatStore((s) => s.addMessage);
  const clearHistory = useChatStore((s) => s.clear);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const abortRef = useRef<AbortController | null>(null);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    if (hardTimerRef.current) clearTimeout(hardTimerRef.current);
    slowTimerRef.current = null;
    hardTimerRef.current = null;
  };

  // Abort an in-flight request if the screen closes.
  useEffect(() => () => {
    clearTimers();
    abortRef.current?.abort();
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // History = the turns before this message, like the web client.
    const history = messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text }));

    setInput('');
    setLoading(true);
    addMessage(userId, { sender: 'user', text });

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    slowTimerRef.current = setTimeout(() => {
      addMessage(userId, {
        sender: 'coach',
        text: "Hang tight, ALLDost is checking with the coach — it's taking slightly longer than expected.",
      });
    }, SLOW_NOTICE_MS);
    hardTimerRef.current = setTimeout(() => ctrl.abort(), HARD_TIMEOUT_MS);

    try {
      const result = await apiFetch<LogResponse>('/api/log', {
        method: 'POST',
        body: JSON.stringify({ message: text, date: selectedDate, history }),
        signal: ctrl.signal,
      });
      // /api/log can write meals, water, weight, workouts or injuries —
      // refetch everything rather than keep a key list in sync.
      queryClient.invalidateQueries();
      addMessage(userId, { sender: 'coach', text: result.response });
    } catch (err) {
      // Cancelled by the user: handleCancel already posted a message.
      if (abortRef.current === null) return;
      addMessage(userId, { sender: 'coach', text: friendlyError(err), isError: true });
    } finally {
      clearTimers();
      abortRef.current = null;
      setLoading(false);
    }
  };

  const cancel = () => {
    clearTimers();
    const ctrl = abortRef.current;
    abortRef.current = null;
    ctrl?.abort();
    setLoading(false);
    addMessage(userId, { sender: 'coach', text: "Cancelled. Try again whenever you're ready." });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <KeyboardAvoidingView className="flex-1" behavior="padding">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-card">
            <View className="flex-row items-center gap-2 flex-1">
              <AppLogo size={32} />
              <View className="flex-1">
                <Text className="text-sm font-black text-foreground">ALLDost Coach</Text>
                <Text className="text-[10px] text-muted-foreground">Logging to {selectedDate}</Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => clearHistory(userId)}
                disabled={loading}
                className="w-9 h-9 rounded-full bg-muted items-center justify-center"
                accessibilityLabel="Clear chat"
              >
                <Trash2 size={16} color="#666" />
              </Pressable>
              <Pressable
                onPress={() => router.back()}
                className="w-9 h-9 rounded-full bg-muted items-center justify-center"
                accessibilityLabel="Close chat"
              >
                <X size={18} color="#666" />
              </Pressable>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={listRef}
            className="flex-1"
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerClassName="px-4 py-4 gap-3"
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => <Bubble message={item} />}
            ListFooterComponent={
              loading ? (
                <View className="self-start flex-row items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3 mt-3">
                  <ActivityIndicator size="small" color="#0a66c2" />
                  <Text className="text-xs font-semibold text-muted-foreground">ALLDost is logging…</Text>
                </View>
              ) : null
            }
          />

          {/* Suggestions (fresh conversation only) */}
          {messages.length <= 1 && !loading && (
            <View className="flex-row flex-wrap gap-2 px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <Pressable key={s} onPress={() => setInput(s)} className="bg-card border border-border rounded-full px-3 py-1.5">
                  <Text className="text-xs font-semibold text-foreground">{s}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Composer */}
          <View className="flex-row items-end gap-2 px-4 py-3 border-t border-border bg-card">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder='e.g. "3 anday nashta"'
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={MAX_CHARS}
              editable={!loading}
              className="flex-1 max-h-28 border border-gray-200 rounded-2xl px-4 py-2.5 text-[15px] text-gray-900 bg-gray-50"
            />
            {loading ? (
              <Pressable
                onPress={cancel}
                className="w-11 h-11 rounded-full bg-red-600 items-center justify-center"
                accessibilityLabel="Stop"
              >
                <Square size={16} color="#fff" fill="#fff" />
              </Pressable>
            ) : (
              <Pressable
                onPress={send}
                disabled={!input.trim()}
                className={`w-11 h-11 rounded-full bg-primary items-center justify-center ${input.trim() ? '' : 'opacity-40'}`}
                accessibilityLabel="Send"
              >
                <Send size={18} color="#fff" />
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';
  return (
    <View
      className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
        isUser
          ? 'self-end bg-primary'
          : message.isError
            ? 'self-start bg-red-50 border border-red-200'
            : 'self-start bg-card border border-border'
      }`}
    >
      <Text
        className={`text-sm leading-5 ${isUser ? 'text-white' : message.isError ? 'text-red-800' : 'text-foreground'}`}
      >
        {message.text.replace(/\*\*(.+?)\*\*/g, '$1')}
      </Text>
    </View>
  );
}
