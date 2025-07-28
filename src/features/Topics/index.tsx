import { ActionIcon, Button, Group, List, Loader, Menu, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { VscAdd, VscClose, VscEdit, VscKebabVertical, VscLock, VscSymbolInterface, VscUnlock } from "react-icons/vsc";
import "./styles.scss";
import { TopicEvent, type ITopic } from "./types";
import { useEvents } from "~/utils/events";
import { useEffect } from "react";
import { Incognito } from "~/components/Incognito";
import { useNavigate } from "react-router";
import { useTopicStore } from "./store";
import { createSlug } from "~/utils/string";
import { modals } from "@mantine/modals";
import { useAuth } from "~/providers/Auth/useAuth";
import { IoSparklesSharp } from "react-icons/io5";
import { LinkTopicToRelationForm } from "./LinkTopicToRelationForm";

export function Topics() {
  const { account, isLoggedIn } = useAuth();
  const topics = useTopicStore((state) => state.topics);
  const isLoading = useTopicStore((state) => state.isLoading);
  const fetchTopics = useTopicStore((state) => (isLoggedIn ? state.fetchAllTopics : state.fetchPublicTopics));
  const resetState = useTopicStore((state) => state.resetState);
  const addTopic = useTopicStore((state) => state.addTopic);
  const removeTopic = useTopicStore((state) => state.removeTopic);
  const renameTopic = useTopicStore((state) => state.renameTopic);
  const toggleVisibility = useTopicStore((state) => state.toggleVisibility);

  const navigate = useNavigate();
  const events = useEvents();

  useEffect(() => {
    fetchTopics();
    return () => {
      resetState();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    return () => resetState();
  }, []);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Topic name can not be empty."),
    },
  });

  const handleRemove = (category: ITopic) => {
    removeTopic(category.id);
    events.emit(TopicEvent.TopicUpdate);
  };

  const handleChangeVisibility = (category: ITopic) => {
    toggleVisibility(category.id);
    events.emit(TopicEvent.TopicUpdate);
  };

  const handleRename = (category: ITopic) => {
    renameTopic(category.id, form.getValues().name);
    form.reset();
    events.emit(TopicEvent.TopicUpdate);
  };

  const onSubmit = (values: { name: string }) => {
    if (!account) {
      return;
    }
    const payload = {
      isPublic: false,
      name: values.name,
      slug: createSlug(values.name),
      userId: account.id,
    };
    addTopic(payload);
    form.reset();
    events.emit(TopicEvent.TopicUpdate);
  };

  return (
    <Stack className="categories" gap="xs" px="sm">
      <Group
        gap="0"
        justify="space-between"
        style={{ borderBottom: "2px solid var(--mantine-color-default)", paddingBottom: "calc(var(--mantine-spacing-xs) / 1.3)" }}
      >
        <Group gap="calc(var(--mantine-spacing-xs) / 2)">
          <IoSparklesSharp size="18" className="level-up-icon" />
          <Title size="sm" fw={600}>
            Topics
          </Title>
        </Group>
        <Group justify="center">
          <Incognito>
            <Menu withArrow position="bottom" transitionProps={{ transition: "pop" }} withinPortal={false}>
              <Menu.Target>
                <ActionIcon size="sm" variant="subtle" color="gray">
                  <VscKebabVertical size={14} style={{ transform: "rotate(90deg)" }} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Options</Menu.Label>
                <Menu.Item
                  fz="xs"
                  fw="500"
                  onClick={() => {
                    modals.open({
                      title: "Create Topic",
                      children: (
                        <>
                          <TextInput
                            type="text"
                            withAsterisk
                            label="Topic Name"
                            description=" "
                            data-autofocus
                            placeholder="Enter name"
                            onInput={(e) => {
                              form.setFieldValue("name", e.currentTarget.value);
                            }}
                          />
                          <Button
                            color="gray"
                            fullWidth
                            onClick={() => {
                              if (form.getValues().name?.trim()) {
                                onSubmit(form.getValues());
                              }
                              modals.closeAll();
                            }}
                            mt="sm"
                          >
                            Create
                          </Button>
                        </>
                      ),
                    });
                  }}
                  leftSection={<VscAdd className="level-up-icon" size={14} strokeWidth={1} />}
                >
                  New Topic
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Incognito>
        </Group>
      </Group>
      {/* <form onSubmit={form.onSubmit(onSubmit)}></form> */}
      <List spacing="xs" size="xs" center listStyleType="none" withPadding={false}>
        {topics.length === 0 && !isLoading && (
          <List.Item c="dimmed" fw="500">
            No topics at the moment.
          </List.Item>
        )}
        {topics.map((topic) => (
          <List.Item key={topic.id} fw="500" w="100%" styles={{ itemWrapper: { width: "100%" }, itemLabel: { width: "100%" } }}>
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap">
                <Incognito>
                  {topic.isPublic ? (
                    <VscUnlock size={14} className="level-up-icon" strokeWidth={1} />
                  ) : (
                    <VscLock size={14} className="level-up-icon" strokeWidth={1} />
                  )}
                </Incognito>
                <Text
                  style={{ cursor: "pointer" }}
                  size={topic.name.length > 25 ? "xs" : "sm"}
                  fw={500}
                  onClick={() => {
                    navigate(`/topics/${topic.slug}`);
                  }}
                >
                  {topic.name}
                </Text>
              </Group>
              <Group justify="center">
                <Incognito>
                  <Menu withArrow position="bottom" transitionProps={{ transition: "pop" }} withinPortal={false}>
                    <Menu.Target>
                      <ActionIcon size="sm" variant="subtle" color="gray">
                        <VscKebabVertical size={14} style={{ transform: "rotate(90deg)" }} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {/* <Menu.Divider /> */}
                      <Menu.Label>Options</Menu.Label>
                      <Menu.Item
                        fz="xs"
                        fw="500"
                        onClick={() => {
                          modals.open({
                            title: "Update Topic",
                            children: (
                              <>
                                <TextInput
                                  type="text"
                                  withAsterisk
                                  label="Topic Name"
                                  description=" "
                                  data-autofocus
                                  placeholder="Enter name"
                                  defaultValue={topic.name}
                                  onInput={(e) => {
                                    form.setFieldValue("name", e.currentTarget.value);
                                  }}
                                />
                                <Button
                                  color="gray"
                                  fullWidth
                                  onClick={() => {
                                    if (form.getValues().name?.trim()) {
                                      handleRename(topic);
                                    }
                                    modals.closeAll();
                                  }}
                                  mt="sm"
                                >
                                  Update
                                </Button>
                              </>
                            ),
                          });
                        }}
                        leftSection={<VscEdit className="level-up-icon" size={14} strokeWidth={1} />}
                      >
                        Rename
                      </Menu.Item>
                      {topic.isPublic && (
                        <Menu.Item
                          fz="xs"
                          fw="500"
                          onClick={() => handleChangeVisibility(topic)}
                          leftSection={<VscLock className="level-up-icon" size={14} strokeWidth={1} />}
                        >
                          Set as Private
                        </Menu.Item>
                      )}

                      {!topic.isPublic && (
                        <Menu.Item
                          fz="xs"
                          fw="500"
                          onClick={() => handleChangeVisibility(topic)}
                          leftSection={<VscUnlock className="level-up-icon" size={14} strokeWidth={1} />}
                        >
                          Set as Public
                        </Menu.Item>
                      )}
                      <Menu.Item
                        fz="xs"
                        fw="500"
                        onClick={() => {
                          modals.open({
                            title: "Link Topic",
                            children: (
                              <>
                                <LinkTopicToRelationForm topicId={topic.id} />
                              </>
                            ),
                          });
                        }}
                        leftSection={<VscSymbolInterface className="level-up-icon" size={14} strokeWidth={1} />}
                      >
                        Link Topic
                      </Menu.Item>
                      {/* Position and reorder handlers removed because Zustand store does not support reorder */}
                      <Menu.Label>Danger zone</Menu.Label>
                      <Menu.Item fz="xs" fw="500" color="red" leftSection={<VscClose size={14} strokeWidth={1} />} onClick={() => handleRemove(topic)}>
                        Remove
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Incognito>
              </Group>
            </Group>
          </List.Item>
        ))}
        {isLoading && (
          <List.Item c="dimmed" fw="500">
            <Loader size="xs" color="gray" />
          </List.Item>
        )}
      </List>
    </Stack>
  );
}
