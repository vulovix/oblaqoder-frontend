import { CollectionEvent } from "~/features/Collections/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CategorySelect } from "~/routes/Index/CategorySelect";
import { useEvent } from "~/utils/events";
import { notifications } from "@mantine/notifications";
import { useCollectionPickerStore } from "./store";
import { useAuth } from "~/providers/Auth/useAuth";

export function CollectionPicker() {
  const rootPath = "";
  const { isLoggedIn } = useAuth();
  const { collections, fetchCollections, fetchAllCollections, resetState } = useCollectionPickerStore();

  const fetchCollectionsList = isLoggedIn ? fetchAllCollections : fetchCollections;

  useEffect(() => {
    fetchCollectionsList();
    return () => {
      resetState();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    return () => resetState();
  }, []);

  useEvent(CollectionEvent.CollectionUpdate, (_payload) => {
    // console.log("CollectionUpdate event payload:", payload);
    fetchCollectionsList();
  });

  const [pickedCollection, setPickedCollection] = useState("");
  const defaultCollection = pickedCollection || collections[0]?.slug;

  const { main, section } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (main === "collections") {
      handleCollectionChange(section);
    }
  }, [main, section]);

  const handleCollectionChange = (value: string | undefined) => {
    value = value || pickedCollection || defaultCollection;
    if (value) {
      setPickedCollection(value);
      return navigate(`${rootPath}/collections/${value}`);
    }
  };

  return (
    <CategorySelect
      category="Collections"
      onCategoryClick={() =>
        defaultCollection
          ? handleCollectionChange(pickedCollection)
          : notifications.show({
              position: "bottom-center",
              title: "No collections at the moment.",
              message: "In order to access Collections, you need to create one.",
            })
      }
      onChange={handleCollectionChange}
      value={defaultCollection}
      data={collections.map((x) => ({ value: x.slug, label: x.name }))}
    />
  );
}
