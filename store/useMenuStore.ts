// src/store/useMenuStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useAuthStore } from './useAuthStore'

interface MenuState {
  data: any | null
  loading: boolean
  error: string | null
  selectedDate: string | null
  setSelectedDate: (date: string) => void
  fetchMenu: (token: string, class_type: number | null, date: string) => Promise<void>
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      data: null,
      loading: false,
      error: null,
      selectedDate: null,

      setSelectedDate: (date: string) => set({ selectedDate: date }),

      fetchMenu: async (token, class_type, selectedDate) => {
        set({ loading: true, error: null })

        try {
          const baseUrl = process.env.EXPO_PUBLIC_API_URL || ''
          const { clearAuth } = useAuthStore.getState()

          const endpoint = !selectedDate
            ? `${baseUrl}/api/web/daily-menu?class_type=${class_type}`
            : `${baseUrl}/api/web/daily-menu?class_type=${class_type}&date=${selectedDate}`

          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: token ? `Bearer ${token}` : '',
            },
          })

          if (response.status === 401) {
            clearAuth()
            return
          }

          if (!response.ok) throw new Error('Failed to fetch data')

          const result = await response.json()
          set({ data: result })
        } catch (err: any) {
          set({ error: err.message })
        } finally {
          set({ loading: false })
        }
      },
    }),

    {
      name: 'menu-storage',
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        data: state.data,
        selectedDate: state.selectedDate,
      }),
    }
  )
)
