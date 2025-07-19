import { create } from "zustand";
import type { Post } from "./types";

export interface CalendarPostsStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  resetPosts: () => void;
}

export const useCalendarPostsStore = create<CalendarPostsStore>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts: posts }),
  resetPosts: () => set({ posts: [] }),
}));
