import { useState } from "react";
import { api } from "~/lib/axios";
import { usePostsStore } from "./store";
import type { Post } from "./types";

interface UseFilteredPostsOptions {
  categoryId?: number;
  collectionId?: number;
  communityId?: number;
}

const PAGE_SIZE = 10;

export const useFilteredPosts = () => {
  const posts = usePostsStore((s) => s.posts);
  const setPosts = usePostsStore((s) => s.setPosts);
  const resetPosts = usePostsStore((s) => s.resetPosts);
  const removePost = usePostsStore((s) => s.removePost);
  const loadMorePosts = usePostsStore((s) => s.loadMorePosts);
  const toggleVisibility = usePostsStore((s) => s.toggleVisibility);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isReachingEnd, setIsReachingEnd] = useState(false);

  const buildQueryParams = (offset: number, categoryId?: number, collectionId?: number, communityId?: number) => {
    const params = new URLSearchParams({
      limit: PAGE_SIZE.toString(),
      offset: offset.toString(),
    });
    if (categoryId) params.set("categoryId", categoryId.toString());
    else if (collectionId) params.set("collectionId", collectionId.toString());
    else if (communityId) params.set("communityId", communityId.toString());

    return params.toString();
  };

  const fetchInitialPosts = async ({ categoryId, collectionId, communityId }: UseFilteredPostsOptions) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await api.get<Post[]>(`/posts/filtered/paginated?${buildQueryParams(0, categoryId, collectionId, communityId)}`);
      setPosts(res.data);
      setIsReachingEnd(res.data.length < PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMorePosts = async ({ categoryId, collectionId, communityId }: UseFilteredPostsOptions) => {
    setIsLoadingMore(true);
    setIsError(false);
    try {
      const offset = posts.length;
      const res = await api.get<Post[]>(`/posts/filtered/paginated?${buildQueryParams(offset, categoryId, collectionId, communityId)}`);
      loadMorePosts(res.data);
      if (res.data.length < PAGE_SIZE) {
        setIsReachingEnd(true);
      }
    } catch (err) {
      console.error("Failed to load more posts:", err);
      setIsError(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const removePostById = async (postId: number) => {
    setIsError(false);
    try {
      await api.delete<Post>(`/posts/${postId}`);
      removePost(postId);
    } catch (err) {
      console.error("Failed to remove post:", err);
      setIsError(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const toggleVisibilityById = async (postId: number, isPublic: boolean) => {
    setIsError(false);
    try {
      await api.put<Post>(`/posts/${postId}`, { isPublic });
      toggleVisibility(postId);
    } catch (err) {
      console.error("Failed to remove post:", err);
      setIsError(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    posts,
    fetchInitialPosts,
    fetchMorePosts,
    isLoading,
    isLoadingMore,
    isError,
    isReachingEnd,
    resetPosts,
    removePost: removePostById,
    toggleVisibility: toggleVisibilityById,
  };
};
