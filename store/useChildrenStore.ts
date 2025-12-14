// src/store/useChildrenStore.ts

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Child = {
    id: number
    first_name: string
    [key: string]: any
}

interface ChildrenState {
    children: Child[]
    selectedChild: Child | null
    loading: boolean
    fetched: boolean
    fetchChildren: (token: string) => Promise<void>
    setSelectedChild: (child: Child | null) => void
}

export const useChildrenStore = create<ChildrenState>()(
    persist(
        (set, get) => ({
            children: [],
            selectedChild: null,
            loading: false,
            fetched: false,

            fetchChildren: async (token) => {
                if (get().loading || get().fetched) return

                set({ loading: true })

                try {
                    const baseUrl = process.env.EXPO_PUBLIC_API_URL || ''
                    const endpoint = `${baseUrl}/api/children`

                    const res = await fetch(endpoint, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: token ? `Bearer ${token}` : '',
                        },
                    })

                    if (!res.ok) throw new Error('Fetch failed')

                    const data = await res.json()
                    const children = data?.data || []
                    
                    set((state) => ({
                        children,
                        selectedChild: state.selectedChild || children[0] || null,
                        fetched: true,
                    }))
                } catch (e) {
                    set({ children: [], fetched: false })
                    console.log('error: ', e);
                    
                } finally {
                    set({ loading: false })
                }
            },

            setSelectedChild: (child) => set({ selectedChild: child }),
        }),
        {
            name: 'children_store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
