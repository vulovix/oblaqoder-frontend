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
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  files?: PostFile[];
};
