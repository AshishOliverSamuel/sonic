import { create } from 'zustand';
import { normalizeSong } from '../api/music.js';

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,

  playSong: (song) => {
    const normalized = normalizeSong(song);
    set({
      currentSong: normalized,
      queue: [normalized],
      queueIndex: 0,
      isPlaying: true,
      progress: 0,
      duration: normalized.duration || 0,
    });
  },

  playQueue: (songs, startIndex = 0) => {
    const queue = songs.map(normalizeSong).filter((song) => song.id);
    const index = Math.min(Math.max(startIndex, 0), Math.max(queue.length - 1, 0));

    if (queue.length === 0) {
      return;
    }

    set({
      currentSong: queue[index],
      queue,
      queueIndex: index,
      isPlaying: true,
      progress: 0,
      duration: queue[index].duration || 0,
    });
  },

  togglePlay: () => {
    if (!get().currentSong) {
      return;
    }

    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  next: () => {
    const { queue, queueIndex } = get();
    const nextIndex = queueIndex + 1;

    if (queue.length > 0 && nextIndex < queue.length) {
      set({
        currentSong: queue[nextIndex],
        queueIndex: nextIndex,
        isPlaying: true,
        progress: 0,
        duration: queue[nextIndex].duration || 0,
      });
      return;
    }

    set({ isPlaying: false, progress: 0 });
  },

  prev: () => {
    const { queue, queueIndex, progress } = get();

    if (progress > 3) {
      set({ progress: 0 });
      return;
    }

    const prevIndex = queueIndex - 1;
    if (queue.length > 0 && prevIndex >= 0) {
      set({
        currentSong: queue[prevIndex],
        queueIndex: prevIndex,
        isPlaying: true,
        progress: 0,
        duration: queue[prevIndex].duration || 0,
      });
    }
  },

  setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, Number(volume))) }),
  setProgress: (progress) => set({ progress: Math.max(0, Number(progress) || 0) }),
  setDuration: (duration) => set({ duration: Math.max(0, Number(duration) || 0) }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  addToQueue: (song) => set((state) => ({ queue: [...state.queue, normalizeSong(song)] })),
}));

