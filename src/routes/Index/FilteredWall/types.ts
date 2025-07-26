import type { ICategory } from "~/features/Categories/types";
import type { ICollection } from "~/features/Collections/types";
import type { ICommunity } from "~/features/Communities/types";

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
  categories: ICategory[];
  communities: ICommunity[];
  collections: ICollection[];
};
