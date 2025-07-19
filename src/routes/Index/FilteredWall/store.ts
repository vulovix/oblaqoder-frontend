import { create } from "zustand";
import type { Post } from "./types";

export interface FilteredWallStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  loadMorePosts: (newPosts: Post[]) => void;
  resetPosts: () => void;
  removePost: (postId: number) => void;
  toggleVisibility: (postId: number) => void;
  addPost: (post: Post) => void;
}

export const usePostsStore = create<FilteredWallStore>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  loadMorePosts: (newPosts) =>
    set((state: FilteredWallStore) => ({
      posts: [...state.posts, ...newPosts],
    })),
  removePost: (postId: number) =>
    set((state: FilteredWallStore) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),
  toggleVisibility: (postId: number) =>
    set((state: FilteredWallStore) => ({
      posts: state.posts.map((post) => (post.id === postId ? { ...post, isPublic: !post.isPublic } : post)),
    })),
  resetPosts: () => set({ posts: [] }),
  addPost: (post) =>
    set((state: FilteredWallStore) => ({
      posts: [post, ...state.posts],
    })),
}));
