import { create } from "zustand";
import type { Post } from "./types";
import type { CreatePostRelation } from "~/features/SocialPostForm/types";
import type { ICategory } from "~/features/Categories/types";
import type { ICollection } from "~/features/Collections/types";
import type { ICommunity } from "~/features/Communities/types";

export interface FilteredWallStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  loadMorePosts: (newPosts: Post[]) => void;
  resetPosts: () => void;
  removePost: (postId: number) => void;
  toggleVisibility: (postId: number) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  updatePostRelationInStore: (
    postId: number,
    oldRelation: CreatePostRelation | undefined,
    newRelation: CreatePostRelation | undefined,
    relationObject: ICategory | ICollection | ICommunity | undefined
  ) => void;
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
  updatePost: (updatedPost) =>
    set((state: FilteredWallStore) => ({
      posts: state.posts.map((post) => (post.id === updatedPost.id ? { ...post, ...updatedPost } : post)),
    })),
  updatePostRelationInStore: (
    postId: number,
    oldRelation: CreatePostRelation | undefined,
    newRelation: CreatePostRelation | undefined,
    relationObject: ICategory | ICollection | ICommunity | undefined
  ) => {
    set((state: FilteredWallStore) => {
      // If there's no new relation → this post doesn't belong anymore
      if (!newRelation) {
        return {
          posts: state.posts.filter((post) => post.id !== postId),
        };
      }

      // If oldRelation is undefined, we assume the post was newly added to this view → remove
      if (!oldRelation) {
        return {
          posts: state.posts.filter((post) => post.id !== postId),
        };
      }

      // If relation type or id changed → remove
      const stillMatches = oldRelation.relation === newRelation.relation && oldRelation.relationId === newRelation.relationId;

      const updatedPosts = state.posts
        .map((post) => {
          if (post.id !== postId) return post;
          if (!stillMatches) return null;

          return {
            ...post,
            categories: [],
            collections: [],
            communities: [],
            ...(newRelation.relation === "categories" && relationObject ? { categories: [relationObject as ICategory] } : {}),
            ...(newRelation.relation === "collections" && relationObject ? { collections: [relationObject as ICollection] } : {}),
            ...(newRelation.relation === "communities" && relationObject ? { communities: [relationObject as ICommunity] } : {}),
          };
        })
        .filter(Boolean);

      return { posts: updatedPosts as typeof state.posts };
    });
  },
}));
