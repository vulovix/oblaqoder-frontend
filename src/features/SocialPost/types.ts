import type { ICategory } from "../Categories/types";
import type { ICollection } from "../Collections/types";
import type { ICommunity } from "../Communities/types";

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

export type Post = {
  id: number;
  isPublic: boolean;
  content: string;
  userId: number;
  user: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
  files?: PostFile[];
  categories?: ICategory[];
  collections?: ICollection[];
  communities?: ICommunity[];
};
