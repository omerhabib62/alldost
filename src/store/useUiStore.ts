/**
 * useUiStore — native mirror of the fitness web app store.
 * Persists to AsyncStorage (RN) or localStorage (web via Expo).
 * Uses skipHydration + manual rehydrate pattern from web so the
 * dashboard flash-of-today issue doesn't reappear on native.
 */

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

function todayIsoLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface UiState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      selectedDate: todayIsoLocal(),
      setSelectedDate: (date) => set({ selectedDate: date }),
    }),
    {
      name: 'alldost-ui-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ selectedDate: state.selectedDate }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        selectedDate: persistedState?.selectedDate ?? currentState.selectedDate,
      }),
      skipHydration: true,
    }
  )
);

// Manually kick off rehydration on module import so consumers can gate on
// useHasHydrated() before rendering date-dependent UI.
useUiStore.persist.rehydrate();

export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useUiStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useUiStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  return hydrated;
}
