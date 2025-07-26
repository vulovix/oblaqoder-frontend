import { create } from "zustand";
import type { AssignPostRelation, CreatePost, CreatePostRelation, Post, PostFile } from "./types";

import { usePostsStore as useWallStore } from "~/routes/Index/Wall/store";
import { usePostsStore as useFilteredWallStore } from "~/routes/Index/FilteredWall/store";
import { api } from "~/lib/axios";
import type { ICategory } from "../Categories/types";
import type { ICollection } from "../Collections/types";
import type { ICommunity } from "../Communities/types";

export interface CreatePostStore {
  isLoading: boolean;
  isUpdating: boolean;
  addPost: (post: Post) => void;
  updatePostInStore: (post: Post) => void;
  setIsLoading: (loading: boolean) => void;
  setIsUpdating: (loading: boolean) => void;
  createPost: (post: CreatePost, relation?: CreatePostRelation) => void;
  updatePost: (model: Post, post: CreatePost, relation?: CreatePostRelation) => void;
  updatePostRelation: (postId: number, oldRelation: CreatePostRelation | undefined, newRelation: CreatePostRelation | undefined) => void;
  updatePostRelationInStore: (
    postId: number,
    oldRelation: CreatePostRelation | undefined,
    newRelation: CreatePostRelation | undefined,
    relationObject: ICategory | ICollection | ICommunity | undefined
  ) => void;
  assignPostToRelation: (relation: AssignPostRelation) => Promise<void>;
  unassignPostFromRelation: (relation: AssignPostRelation) => Promise<void>;
}

export const useCreatePostStore = create<CreatePostStore>((set, get, _store) => ({
  isUpdating: false,
  isLoading: false,
  addPost: (post: Post) => {
    useWallStore.getState().addPost(post);
    useFilteredWallStore.getState().addPost(post);
  },
  updatePostInStore: (post: Post) => {
    useWallStore.getState().updatePost(post);
    useFilteredWallStore.getState().updatePost(post);
  },
  updatePostRelationInStore: (
    postId: number,
    oldRelation: CreatePostRelation | undefined,
    newRelation: CreatePostRelation | undefined,
    relationObject: ICategory | ICollection | ICommunity | undefined
  ) => {
    useWallStore.getState().updatePostRelationInStore(postId, newRelation, relationObject);
    useFilteredWallStore.getState().updatePostRelationInStore(postId, oldRelation, newRelation, relationObject);
  },

  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsUpdating: (isUpdating: boolean) => set({ isUpdating }),
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
      if (relation) {
        get().assignPostToRelation({ postId: createdPost.id, relation: relation.relation, relationId: relation.relationId });
      }
    } catch (error) {
      // console.error("Failed to create post:", error);
    } finally {
      get().setIsLoading(false);
    }
  },
  updatePost: async (model: Post, updatedData: Partial<CreatePost>): Promise<void> => {
    const { content, files = [], isPublic, userId } = updatedData;

    try {
      get().setIsUpdating(true);

      // Step 1: Update post content
      const postRes = await api.put<Post>(`/posts/${model.id}`, {
        userId,
        content,
        isPublic,
      });

      const updatedPost = postRes.data;

      // Step 2: File diffing logic
      const oldFiles = model.files ?? [];
      const newFiles = files ?? [];

      // const oldFileIds = new Set(oldFiles.map((f) => f.id));
      const newFileIds = new Set(newFiles.filter((f: any) => typeof f === "object" && "id" in f).map((f: any) => f.id));

      // Files to remove (in old, but not in new)
      const removedFileIds = oldFiles.filter((f) => !newFileIds.has(f.id)).map((f) => f.id);

      // Files to keep (in both old and new)
      const keptFiles = oldFiles.filter((f) => newFileIds.has(f.id));

      // Files to upload (new `File` objects, no id)
      const newUploads = newFiles.filter((f: any) => !("id" in f));

      let uploadedFiles: PostFile[] = [];

      // Step 3: Delete removed files
      if (removedFileIds.length > 0) {
        await Promise.all(removedFileIds.map((id) => api.delete<{ deleted: boolean }>(`/post-files/${id}`)));
      }

      // Step 4: Upload new files
      if (newUploads.length > 0) {
        const formData = new FormData();
        newUploads.forEach((file) => formData.append("files", file as any));

        const fileRes = await api.post<PostFile[]>(`/post-files?postId=${model.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedFiles = fileRes.data;
      }

      // Step 5: Merge all files
      const finalFiles = [...keptFiles, ...uploadedFiles];

      // Step 6: Final post object
      const fullPost: Post = {
        ...updatedPost,
        files: finalFiles,
      };

      get().updatePostInStore(fullPost);
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      get().setIsUpdating(false);
    }
  },
  updatePostRelation: async (postId: number, oldRelation: CreatePostRelation | undefined, newRelation: CreatePostRelation | undefined) => {
    const isDifferent = !oldRelation || !newRelation || oldRelation.relation !== newRelation.relation || oldRelation.relationId !== newRelation.relationId;

    if (!isDifferent) return;

    if (oldRelation) {
      await get().unassignPostFromRelation({ postId, ...oldRelation });
    }

    let relationObject: ICategory | ICollection | ICommunity | undefined = undefined;

    if (newRelation) {
      await get().assignPostToRelation({ postId, ...newRelation });

      const { data } = await api.get<ICollection | ICommunity | ICategory>(`/${newRelation.relation}/${newRelation.relationId}`);

      relationObject = data;
    }

    // 👇 Always update the store — even if newRelation is undefined
    get().updatePostRelationInStore(postId, oldRelation, newRelation, relationObject);
  },
  assignPostToRelation: async ({ postId, relation, relationId }: AssignPostRelation) => {
    try {
      await api.post(`/posts/${postId}/${relation}/${relationId}`);
    } catch (error) {
      console.error(`Failed to assign post to ${relation}:`, error);
    }
  },
  unassignPostFromRelation: async ({ postId, relation, relationId }: AssignPostRelation) => {
    try {
      await api.delete(`/posts/${postId}/${relation}/${relationId}`);
    } catch (error) {
      console.error(`Failed to assign post to ${relation}:`, error);
    }
  },
}));
