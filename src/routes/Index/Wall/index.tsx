import { Button, Center, Loader, Stack, Text } from "@mantine/core";
import "./styles.scss";
import { SocialPost } from "~/features/SocialPost";
import { useEffect } from "react";
import { useWallPosts } from "./useWallPosts";
import { useLocation } from "react-router";
import { useAuth } from "~/providers/Auth/useAuth";

export function Wall() {
  const { isLoggedIn } = useAuth();
  const { search } = useLocation();

  const { posts: data, fetchInitialPosts, fetchMorePosts, isLoading, isLoadingMore, isReachingEnd, resetPosts, removePost, toggleVisibility } = useWallPosts();

  useEffect(() => {
    fetchInitialPosts(isLoggedIn);
    return () => {
      resetPosts();
    };
  }, [search, isLoggedIn]);

  return (
    <Stack className="wall-container" gap={"sm"}>
      {data.map((post) => (
        <SocialPost key={post.updatedAt} {...post} onRemove={removePost} onVisibilityToggle={toggleVisibility} />
      ))}
      {isLoading && (
        <Center>
          <Loader size={"sm"} color="white" />
        </Center>
      )}
      {data.length === 0 && !isLoading && (
        <Text fw="500" size="sm" ta={"center"}>
          We couldn't find any post.
        </Text>
      )}
      {!isReachingEnd && (
        <Center>
          <Button variant="subtle" color="gray" onClick={() => fetchMorePosts(isLoggedIn)} disabled={isLoadingMore}>
            {isLoadingMore ? "Loading..." : "Load more"}
          </Button>
        </Center>
      )}
      {data?.length && isReachingEnd ? (
        <Text fw="500" size="sm" ta={"center"}>
          No more posts to load.
        </Text>
      ) : (
        <></>
      )}
    </Stack>
  );
}
