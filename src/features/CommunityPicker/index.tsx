import { CommunityEvent } from "~/features/Communities/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CategorySelect } from "~/routes/Index/CategorySelect";
import { useEvent } from "~/utils/events";
import { notifications } from "@mantine/notifications";
import { useCommunityPickerStore } from "./store";
import { useAuth } from "~/providers/Auth/useAuth";

export function CommunityPicker() {
  const rootPath = "";
  const { isLoggedIn } = useAuth();
  const { communities, fetchCommunities, fetchAllCommunities, resetState } = useCommunityPickerStore();

  const fetchCommunitiesList = isLoggedIn ? fetchAllCommunities : fetchCommunities;

  useEffect(() => {
    fetchCommunitiesList();
    return () => {
      resetState();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    return () => resetState();
  }, []);

  useEvent(CommunityEvent.CommunityUpdate, (payload) => {
    // console.log("CommunityUpdate event payload:", payload);
    fetchCommunitiesList();
  });

  const [pickedCommunity, setPickedCommunity] = useState("");
  const defaultCommunity = pickedCommunity || communities[0]?.slug;

  const { main, section } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (main === "communities") {
      handleCommunityChange(section);
    }
  }, [main, section]);

  const handleCommunityChange = (value: string | undefined) => {
    value = value || pickedCommunity || defaultCommunity;
    if (value) {
      setPickedCommunity(value);
      return navigate(`${rootPath}/communities/${value}`);
    }
  };

  return (
    <CategorySelect
      category="Communities"
      onCategoryClick={() =>
        defaultCommunity
          ? handleCommunityChange(pickedCommunity)
          : notifications.show({
              position: "bottom-center",
              title: "No communities at the moment.",
              message: "In order to access Communities, you need to create one.",
            })
      }
      onChange={handleCommunityChange}
      value={defaultCommunity}
      data={communities.map((x) => ({ value: x.slug, label: x.name }))}
    />
  );
}
