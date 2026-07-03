/**
 * DateHeader — native port of the fitness web DateHeader.
 * Shows prev/next arrows + friendly label ("Today", "Yesterday", weekday)
 * + secondary date, jumps back to Today when not on today.
 *
 * Native picker: Sprint 12 stub — long-press label to open a native date
 * picker (Sprint 13 will wire @react-native-community/datetimepicker).
 */

import { View, Text, Pressable, Platform } from 'react-native';
import { useMemo } from 'react';
import { useUiStore, useHasHydrated } from '@/store/useUiStore';
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from 'lucide-react-native';

function todayIsoLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function shiftDate(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function friendlyLabel(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const todayIso = todayIsoLocal();
  const yesterdayIso = shiftDate(todayIso, -1);

  const isToday = iso === todayIso;
  const isYesterday = iso === yesterdayIso;
  const isFuture = iso > todayIso;

  const weekday = dt.toLocaleDateString('en-GB', { weekday: 'long' });
  const dayNum = dt.getDate();
  const month = dt.toLocaleDateString('en-GB', { month: 'long' });
  const year = dt.getFullYear();
  const nowYear = new Date().getFullYear();

  const primary = isToday ? 'Today' : isYesterday ? 'Yesterday' : weekday;
  const secondary = `${dayNum} ${month}${year !== nowYear ? ` ${year}` : ''}`;

  return { primary, secondary, isToday, isFuture };
}

export default function DateHeader() {
  const selectedDate = useUiStore((s) => s.selectedDate);
  const setSelectedDate = useUiStore((s) => s.setSelectedDate);
  const hasHydrated = useHasHydrated();

  const { primary, secondary, isToday, isFuture } = useMemo(
    () => friendlyLabel(selectedDate),
    [selectedDate]
  );

  if (!hasHydrated) {
    return (
      <View className="mx-4 mt-3 rounded-3xl bg-card border border-border py-4 items-center">
        <Text className="text-xs font-bold text-muted-foreground">Loading…</Text>
      </View>
    );
  }

  const goPrev = () => setSelectedDate(shiftDate(selectedDate, -1));
  const goNext = () => setSelectedDate(shiftDate(selectedDate, 1));
  const jumpToday = () => setSelectedDate(todayIsoLocal());

  return (
    <View className="mx-4 mt-3 rounded-3xl bg-card border border-border px-4 py-3 flex-row items-center justify-between">
      {/* Prev */}
      <Pressable
        onPress={goPrev}
        className="p-2.5 rounded-2xl bg-muted"
        accessibilityLabel="Previous day"
      >
        <ChevronLeft size={20} color="#666" />
      </Pressable>

      {/* Center label */}
      <View className="flex-1 items-center">
        <View className="flex-row items-center gap-1.5">
          <Calendar size={14} color={isToday ? '#0a66c2' : '#999'} />
          <Text className="text-lg font-black text-foreground">{primary}</Text>
        </View>
        <Text className="text-[11px] text-muted-foreground font-semibold mt-0.5">
          {secondary}
        </Text>
      </View>

      {/* Right cluster */}
      <View className="flex-row items-center gap-2">
        {!isToday && (
          <Pressable
            onPress={jumpToday}
            className="flex-row items-center gap-1 px-2.5 py-2 rounded-2xl bg-primary/10 border border-primary/20"
            accessibilityLabel="Jump to today"
          >
            <RotateCcw size={12} color="#0a66c2" />
            <Text className="text-[10px] font-black text-primary uppercase">Today</Text>
          </Pressable>
        )}
        <Pressable
          onPress={goNext}
          disabled={isFuture}
          className={`p-2.5 rounded-2xl bg-muted ${isFuture ? 'opacity-30' : ''}`}
          accessibilityLabel="Next day"
        >
          <ChevronRight size={20} color="#666" />
        </Pressable>
      </View>
    </View>
  );
}
