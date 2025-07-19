import { Button, Center, Loader, Stack, Text } from "@mantine/core";
import "./styles.scss";
import { SocialPost } from "~/features/SocialPost";
import { useEffect } from "react";
import { useParams } from "react-router";
import { useCollectionStore } from "~/features/Collections/store";
import { useCommunityStore } from "~/features/Communities/store";
import { useCategoryStore } from "~/features/Categories/store";
import { useFilteredPosts } from "./useFilteredPosts";

export function FilteredWall() {
  const { main, section } = useParams();
  const collections = useCollectionStore((state) => state.collections);
  const communities = useCommunityStore((state) => state.communities);
  const categories = useCategoryStore((state) => state.categories);

  const getFilter = () => {
    if (!main) {
      return undefined;
    }
    switch (main) {
      case "categories":
        return { categoryId: categories.find((x) => x.slug === section)?.id };
      case "collections":
        return { collectionId: collections.find((x) => x.slug === section)?.id };
      case "communities":
        return { communityId: communities.find((x) => x.slug === section)?.id };
      default:
        return undefined;
    }
  };
  const {
    posts: data,
    fetchInitialPosts,
    fetchMorePosts,
    isLoading,
    isLoadingMore,
    // isError,
    isReachingEnd,
    resetPosts,
    removePost,
    toggleVisibility,
  } = useFilteredPosts();

  const onFetchMore = () => {
    const filter = getFilter();
    if (filter) {
      if (!filter.categoryId && !filter.collectionId && !filter.communityId) {
        return;
      }
      fetchMorePosts(filter);
    }
  };
  useEffect(() => {
    const filter = getFilter();
    if (filter) {
      if (!filter.categoryId && !filter.collectionId && !filter.communityId) {
        return;
      }

      fetchInitialPosts(filter);
    }
    return () => {
      resetPosts();
    };
  }, [collections, communities, categories, section, main]);

  return (
    <Stack className="wall-container" gap={"sm"}>
      {data.map((x) => (
        <SocialPost {...x} onRemove={removePost} onVisibilityToggle={toggleVisibility} />
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
          <Button variant="subtle" color="gray" onClick={onFetchMore} disabled={isLoadingMore}>
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
