import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RNStorage } from '../utils/RNStorage'
import { router } from 'expo-router'
// import { NATIVE_API_URL } from '@env'
interface User {
  id: number
  first_name: string
  [key: string]: any
}

interface AuthState {
  token: string | null
  user: User | null
  role: string | null
  loading: boolean
  error: string | null

  login: (phone: string, password: string) => Promise<void>
  logout: () => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      loading: false,
      error: null,

      login: async (phone, password) => {

        set({ loading: true, error: null })
        try {
          const body = new FormData()
          body.append('phone', phone)
          body.append('password', password)
          body.append('device', 'mobile')

          const baseUrl = process.env.NATIVE_API_URL || 'https://dev.sehriyo.uz'
          const endpoint = `${baseUrl}/api/auth`

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body,
          })

          if (!res.ok) throw new Error(await res.text() || 'Auth failed')

          const data = await res.json()

          console.log('authentication has been successfully: ', data.token);
          
          set({
            token: data.token,
            user: data.user || data.parent_info || null,
            role: data.role || null,
          })

          router.replace("/")


        } catch (err: any) {
          set({ error: err.message })
          // console.log('url: ', process.env.NATIVE_API_URL);
          
          throw err
        } finally {
          set({ loading: false })
        }
      },

      logout: () => set({ token: null, user: null, role: null }),

      clearAuth: () => set({ token: null, user: null, role: null })
    }),
    {
      name: 'auth',
      storage: RNStorage, // ✅ TypeScript bilan moslandi
    }
  )
)
