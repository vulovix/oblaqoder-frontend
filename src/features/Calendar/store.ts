import { create } from "zustand";
import { api } from "~/lib/axios";
import { type Post } from "./types";

interface CalendarPostsStore {
  posts: Post[];
  isLoading: boolean;
  isError: boolean;
  fetchInitialPosts: (isLoggedIn: boolean) => Promise<void>;
  resetPosts: () => void;
}

export const useCalendarPostsStore = create<CalendarPostsStore>()((set) => ({
  posts: [],
  isLoading: false,
  isError: false,

  fetchInitialPosts: async (isLoggedIn: boolean) => {
    set({ isLoading: true, isError: false });

    try {
      const params = new URLSearchParams();
      if (isLoggedIn) {
        params.set("includeHiddenSources", "true");
      }

      const res = await api.get(`/posts/calendar?${params.toString()}`);
      set({ posts: res.data });
    } catch (err) {
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

  resetPosts: () => set({ posts: [] }),
}));
