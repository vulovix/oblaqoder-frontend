import { MultiSelect, Button, Stack } from "@mantine/core";
import { useCollectionStore } from "../Collections/store";
import { useCommunityStore } from "../Communities/store";
import { useCategoryStore } from "../Categories/store";
import { useEffect, useState } from "react";
import type { LinkTopicToRelationFormProps } from "./types";
import { useTopicStore } from "./store";
import { modals } from "@mantine/modals";

export function LinkTopicToRelationForm(props: LinkTopicToRelationFormProps) {
  const [selectedRelations, setSelectedRelations] = useState<string[]>([]);

  const collections = useCollectionStore((state) => state.collections);
  const communities = useCommunityStore((state) => state.communities);
  const categories = useCategoryStore((state) => state.categories);

  const fetchTopicRelations = useTopicStore((s) => s.fetchTopicRelations);
  const currentTopicRelations = useTopicStore((s) => s.currentTopicRelations);
  const clearTopicRelations = useTopicStore((s) => s.clearTopicRelations);
  const updateTopicRelations = useTopicStore((s) => s.updateTopicRelations);

  // Fetch current relations on mount
  useEffect(() => {
    if (props.topicId) {
      fetchTopicRelations(props.topicId);
    }
    return () => {
      clearTopicRelations();
      setSelectedRelations([]);
    };
  }, [props.topicId]);

  // Initialize select values
  useEffect(() => {
    if (currentTopicRelations) {
      const initialValues: string[] = [
        ...currentTopicRelations.collections.map((col) => `collection-${col.id}`),
        ...currentTopicRelations.categories.map((cat) => `category-${cat.id}`),
        ...currentTopicRelations.communities.map((com) => `community-${com.id}`),
      ];
      setSelectedRelations(initialValues);
    }
  }, [currentTopicRelations]);

  const groupedData = [
    {
      group: "Collections",
      items: collections.map((col) => ({
        value: `collection-${col.id}`,
        label: col.name,
      })),
    },
    {
      group: "Communities",
      items: communities.map((com) => ({
        value: `community-${com.id}`,
        label: com.name,
      })),
    },
    {
      group: "Categories",
      items: categories.map((cat) => ({
        value: `category-${cat.id}`,
        label: cat.name,
      })),
    },
  ];

  const handleSubmit = () => {
    if (props.topicId) {
      updateTopicRelations(props.topicId, selectedRelations);
      clearTopicRelations();
      modals.closeAll();
    }
  };

  return (
    <Stack gap="xs">
      <MultiSelect
        className="social-post-form-select"
        data={groupedData}
        searchable
        clearable
        value={selectedRelations}
        onChange={setSelectedRelations}
        placeholder="Link topic to collections, categories, or communities"
        classNames={{ groupLabel: "select-group-label" }}
        styles={{
          input: {
            background: "var(--mantine-color-body)",
            borderColor: "var(--mantine-color-default-border)",
          },
          dropdown: {
            background: "var(--mantine-color-body)",
            borderColor: "var(--mantine-color-default-border)",
          },
        }}
        w="100%"
      />

      <Button onClick={handleSubmit} variant="light" color="gray">
        Save
      </Button>
    </Stack>
  );
}
