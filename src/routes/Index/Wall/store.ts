import { create } from "zustand";
import type { Post } from "./types";

export interface WallPostsStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  loadMorePosts: (newPosts: Post[]) => void;
  resetPosts: () => void;
  removePost: (postId: number) => void;
  toggleVisibility: (postId: number) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
}

export const usePostsStore = create<WallPostsStore>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  loadMorePosts: (newPosts) =>
    set((state: WallPostsStore) => ({
      posts: [...state.posts, ...newPosts],
    })),
  removePost: (postId: number) =>
    set((state: WallPostsStore) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),
  resetPosts: () => set({ posts: [] }),
  toggleVisibility: (postId: number) =>
    set((state: WallPostsStore) => ({
      posts: state.posts.map((post) => (post.id === postId ? { ...post, isPublic: !post.isPublic } : post)),
    })),
  addPost: (post) =>
    set((state: WallPostsStore) => ({
      posts: [post, ...state.posts],
    })),
  updatePost: (updatedPost) =>
    set((state: WallPostsStore) => ({
      posts: state.posts.map((post) => (post.id === updatedPost.id ? { ...post, ...updatedPost } : post)),
    })),
}));
