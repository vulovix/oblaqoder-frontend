import type { ICategory } from "../Categories/types";
import type { ICollection } from "../Collections/types";
import type { ICommunity } from "../Communities/types";

export type Post = {
  id: number;
  isPublic: boolean;
  user: { id: number; name: string };
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  communities: ICommunity[];
  collections: ICollection[];
  categories: ICategory[];
  files?: PostFile[];
};

export type PostFile = {
  id: number;
  postId: number;
  filePath: string;
  bucket: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  publicUrl: string;
};

export const SocialPostFormEvent = {
  SocialPostUpdate: "SocialPostUpdate",
  SocialPostCreated: "SocialPostCreated",
};

export interface ISocialPostFormState {
  loading: boolean;
  post: Post;
}

export type CreatePost = {
  content: string;
  isPublic: boolean;
  userId: number;
  files?: PostFile[];
};

export type CreatePostRelation = {
  relation: string;
  relationId: number;
};

export type AssignPostRelation = {
  postId: number;
  relation: string;
  relationId: number;
};

export type UnassignPostRelation = {
  postId: number;
};
