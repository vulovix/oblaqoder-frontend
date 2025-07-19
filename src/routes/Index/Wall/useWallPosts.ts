import { useMemo, useState } from "react";
import { api } from "~/lib/axios";
import { usePostsStore } from "./store";
import type { Post } from "./types";
import { useLocation } from "react-router";

const PAGE_SIZE = 10;

export const useWallPosts = () => {
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

  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const date = query.get("date"); // 👈 get date from URL (e.g. "2025-09-08")

  const buildUrl = (offset: number, includeHiddenSources: boolean) => {
    const base = `/posts/wall/paginated?${buildQueryParams(offset, includeHiddenSources)}`;
    return date ? `${base}&date=${encodeURIComponent(date)}` : base;
  };

  const buildQueryParams = (offset: number, includeHiddenSources: boolean) => {
    const params = new URLSearchParams();

    params.set("limit", PAGE_SIZE.toString());
    params.set("offset", offset.toString());

    if (includeHiddenSources) {
      params.set("includeHiddenSources", "true");
    }

    return params.toString();
  };

  const fetchInitialPosts = async (includeHiddenSources: boolean) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await api.get<Post[]>(buildUrl(0, includeHiddenSources));
      setPosts(res.data);
      setIsReachingEnd(res.data.length < PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMorePosts = async (includeHiddenSources: boolean) => {
    setIsLoadingMore(true);
    setIsError(false);
    try {
      const offset = posts.length;
      const res = await api.get<Post[]>(buildUrl(offset, includeHiddenSources));
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
