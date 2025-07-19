import { useState, useEffect } from "react";
import { api } from "../../lib/axios";
import { useCalendarPostsStore } from "./store";
import { useAuth } from "~/providers/Auth/useAuth";

export const useCalendarPosts = () => {
  const { isLoggedIn } = useAuth();
  const resetPosts = useCalendarPostsStore((s) => s.resetPosts);
  const setPosts = useCalendarPostsStore((s) => s.setPosts);
  const posts = useCalendarPostsStore((s) => s.posts);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchInitialPosts = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const params = new URLSearchParams();

      if (isLoggedIn) {
        params.set("includeHiddenSources", "true");
      }
      const res = await api.get(`/posts/calendar?${params.toString()}`);
      setPosts(res.data);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchInitialPosts();

  //   return () => {
  //     resetPosts();
  //   };

  // }, []);

  useEffect(() => {
    fetchInitialPosts();
    return () => {
      resetPosts();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    return () => resetPosts();
  }, []);

  return {
    posts,
    fetchInitialPosts,
    isLoading,
    isError,
  };
};
