// In your audioStore.js (or create a new playerStore.js)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePlayerStore = create(
  persist(
    (set, get) => ({
      // Current playing audio
      currentAudio: null,
      isPlaying: false,

      // Actions
      setCurrentAudio: (audio) => set({ currentAudio: audio, isPlaying: true }),
      stopAudio: () => set({ currentAudio: null, isPlaying: false }),
      togglePlay: () => set({ isPlaying: !get().isPlaying }),
    }),
    {
      name: 'audio-player-storage', // localStorage key
      partialize: (state) => ({
        currentAudio: state.currentAudio,
        isPlaying: state.isPlaying,
      }),
    },
  ),
)

export default usePlayerStore
