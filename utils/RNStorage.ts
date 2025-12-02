import AsyncStorage from '@react-native-async-storage/async-storage'
import { PersistStorage, StorageValue } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: any | null
  role: string | null
}

// PersistStorage<AuthState> uchun typed wrapper
export const RNStorage: PersistStorage<AuthState> = {
  getItem: async (name: string): Promise<StorageValue<AuthState> | null> => {
    const value = await AsyncStorage.getItem(name)
    return value ? JSON.parse(value) : null
  },

  setItem: async (name: string, value: StorageValue<AuthState>) => {
    await AsyncStorage.setItem(name, JSON.stringify(value))
  },

  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name)
  },
}
