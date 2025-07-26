import { create } from "zustand";
import type { Post } from "./types";
import type { ICategory } from "~/features/Categories/types";
import type { ICollection } from "~/features/Collections/types";
import type { ICommunity } from "~/features/Communities/types";
import type { CreatePostRelation } from "~/features/SocialPostForm/types";

export interface WallPostsStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  loadMorePosts: (newPosts: Post[]) => void;
  resetPosts: () => void;
  removePost: (postId: number) => void;
  toggleVisibility: (postId: number) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  addPostRelationToStore: (
    postId: number,
    newRelation: CreatePostRelation | undefined,
    relationObject: ICategory | ICollection | ICommunity | undefined
  ) => void;
  updatePostRelationInStore: (
    postId: number,
    relation: CreatePostRelation | undefined,
    relationObject: ICategory | ICollection | ICommunity | undefined
  ) => void;
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
  addPostRelationToStore: (postId: number, newRelation: CreatePostRelation | undefined, relationObject: ICategory | ICollection | ICommunity | undefined) => {
    if (!newRelation || !relationObject) return; // 🛡️ Skip invalid input
    set((state: WallPostsStore) => {
      const updatedPosts = state.posts.map((post) => {
        if (post.id !== postId) return post;

        return {
          ...post,
          categories: [],
          collections: [],
          communities: [],
          ...(newRelation.relation === "categories" ? { categories: [relationObject as ICategory] } : {}),
          ...(newRelation.relation === "collections" ? { collections: [relationObject as ICollection] } : {}),
          ...(newRelation.relation === "communities" ? { communities: [relationObject as ICommunity] } : {}),
        };
      });

      return { posts: updatedPosts };
    });
  },
  updatePostRelationInStore: (postId: number, relation: CreatePostRelation | undefined, relationObject: ICategory | ICollection | ICommunity | undefined) => {
    set((state: WallPostsStore) => {
      const posts = state.posts.map((post) => {
        if (post.id !== postId) return post;

        return {
          ...post,
          // Clear all
          categories: [],
          collections: [],
          communities: [],
          // Fill the selected one
          ...(relation?.relation === "categories" && relationObject ? { categories: [relationObject as ICategory] } : {}),
          ...(relation?.relation === "collections" && relationObject ? { collections: [relationObject as ICollection] } : {}),
          ...(relation?.relation === "communities" && relationObject ? { communities: [relationObject as ICommunity] } : {}),
        };
      });

      return { posts };
    });
  },
}));
