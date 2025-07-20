import { create } from "zustand";
import type { AssignPostRelation, CreatePost, CreatePostRelation, Post, PostFile } from "./types";

import { usePostsStore as useWallStore } from "~/routes/Index/Wall/store";
import { usePostsStore as useFilteredWallStore } from "~/routes/Index/FilteredWall/store";
import { api } from "~/lib/axios";

export interface CreatePostStore {
  isLoading: boolean;
  addPost: (post: Post) => void;
  setIsLoading: (loading: boolean) => void;
  createPost: (post: CreatePost, relation?: CreatePostRelation) => void;
  assignPostToRelation: (relation: AssignPostRelation) => Promise<void>;
}

export const useCreatePostStore = create<CreatePostStore>((set, get, _store) => ({
  isLoading: false,
  addPost: (post: Post) => {
    useWallStore.getState().addPost(post);
    useFilteredWallStore.getState().addPost(post);
  },
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  createPost: async (post: CreatePost, relation?: CreatePostRelation): Promise<void> => {
    const { content, files = [], isPublic, userId } = post;
    try {
      get().setIsLoading(true);
      // Step 1: Create post
      const postRes = await api.post<Post>("/posts", { content, isPublic, userId });
      const createdPost = postRes.data;

      let uploadedFiles: PostFile[] = [];

      // Step 2: Upload files (if any)
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file as any));

        const fileRes = await api.post<PostFile[]>(`/post-files?postId=${createdPost.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedFiles = fileRes.data;
      }

      // Step 3: Merge post + files and add to store
      const fullPost: Post = {
        ...createdPost,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      };

      get().addPost(fullPost);
      console.log(relation, "relation here", createdPost);
      if (relation) {
        get().assignPostToRelation({ postId: createdPost.id, relation: relation.relation, relationId: relation.relationId });
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      get().setIsLoading(false);
    }
  },
  assignPostToRelation: async ({ postId, relation, relationId }: AssignPostRelation) => {
    try {
      console.log("assigning ", { postId, relation, relationId });
      await api.post(`/posts/${postId}/${relation}/${relationId}`);
    } catch (error) {
      console.error(`Failed to assign post to ${relation}:`, error);
    }
  },
}));
