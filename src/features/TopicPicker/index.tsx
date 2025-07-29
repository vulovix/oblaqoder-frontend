import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CategorySelect } from "~/routes/Index/CategorySelect";
import { useEvent } from "~/utils/events";
import { notifications } from "@mantine/notifications";
import { useTopicPickerStore } from "./store";
import { useAuth } from "~/providers/Auth/useAuth";
import { TopicEvent } from "../Topics/types";

export function TopicPicker() {
  const rootPath = "";
  const { isLoggedIn } = useAuth();
  const { topics, fetchTopics, fetchAllTopics, resetState } = useTopicPickerStore();

  const fetchTopicsList = isLoggedIn ? fetchAllTopics : fetchTopics;

  useEffect(() => {
    fetchTopicsList();
    return () => {
      resetState();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    return () => resetState();
  }, []);

  useEvent(TopicEvent.TopicUpdate, (_payload) => {
    // console.log("TopicUpdate event payload:", payload);
    fetchTopicsList();
  });

  const [pickedTopic, setPickedTopic] = useState("");
  const defaultTopic = pickedTopic || topics[0]?.slug;

  const { main, section } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (main === "topics") {
      handleTopicChange(section);
    }
  }, [main, section]);

  const handleTopicChange = (value: string | undefined) => {
    value = value || pickedTopic || defaultTopic;
    if (value) {
      setPickedTopic(value);
      return navigate(`${rootPath}/topics/${value}`);
    }
  };

  return (
    <CategorySelect
      category="Topics"
      onCategoryClick={() =>
        defaultTopic
          ? handleTopicChange(pickedTopic)
          : notifications.show({
              position: "bottom-center",
              title: "No topics at the moment.",
              message: "In order to access Topic, you need to create one.",
            })
      }
      onChange={handleTopicChange}
      value={defaultTopic}
      data={topics.map((x) => ({ value: x.slug, label: x.name }))}
    />
  );
}
