import { ActionIcon, Button, Group, List, Loader, Menu, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { VscAdd, VscClose, VscEdit, VscKebabVertical, VscLock, VscUnlock } from "react-icons/vsc";
import "./styles.scss";
import { CommunityEvent, type ICommunity } from "./types";
import { useEvents } from "~/utils/events";
import { useEffect } from "react";
import { Incognito } from "~/components/Incognito";
import { useNavigate } from "react-router";
import { useCommunityStore } from "./store";
import { createSlug } from "~/utils/string";
import { modals } from "@mantine/modals";
import { FaPeoplePulling } from "react-icons/fa6";
import { useAuth } from "~/providers/Auth/useAuth";

export function Communities() {
  const { account, isLoggedIn } = useAuth();
  const communities = useCommunityStore((state) => state.communities);
  const isLoading = useCommunityStore((state) => state.isLoading);
  const fetchCommunities = useCommunityStore((state) => (isLoggedIn ? state.fetchAllCommunities : state.fetchCommunities));
  const resetState = useCommunityStore((state) => state.resetState);
  const addCommunity = useCommunityStore((state) => state.addCommunity);
  const removeCommunity = useCommunityStore((state) => state.removeCommunity);
  const renameCommunity = useCommunityStore((state) => state.renameCommunity);
  const toggleVisibility = useCommunityStore((state) => state.toggleVisibility);

  const navigate = useNavigate();
  const events = useEvents();

  useEffect(() => {
    fetchCommunities();
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
      name: (value) => (value.trim().length > 0 ? null : "Community name can not be empty."),
    },
  });

  const handleRemove = (community: ICommunity) => {
    removeCommunity(community.id);
    events.emit(CommunityEvent.CommunityUpdate);
  };

  const handleChangeVisibility = (community: ICommunity) => {
    toggleVisibility(community.id);
    events.emit(CommunityEvent.CommunityUpdate);
  };

  const handleRename = (community: ICommunity) => {
    renameCommunity(community.id, form.getValues().name);
    form.reset();
    events.emit(CommunityEvent.CommunityUpdate);
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
    addCommunity(payload);
    form.reset();
    events.emit(CommunityEvent.CommunityUpdate);
  };

  return (
    <Stack className="collections" gap="xs" px="sm">
      <Group
        gap="0"
        justify="space-between"
        style={{ borderBottom: "2px solid var(--mantine-color-default)", paddingBottom: "calc(var(--mantine-spacing-xs) / 1.3)" }}
      >
        <Group gap="calc(var(--mantine-spacing-xs) / 2)">
          <FaPeoplePulling size="18" className="level-up-icon" />
          <Title size="sm" fw={600}>
            Communities
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
                      title: "Create Community",
                      children: (
                        <>
                          <TextInput
                            type="text"
                            withAsterisk
                            label="Community Name"
                            description="This will be the name of your community."
                            data-autofocus
                            placeholder="Enter name"
                            onInput={(e) => {
                              form.setFieldValue("name", e.currentTarget.value);
                            }}
                          />
                          <Button
                            variant="subtle"
                            color="gray"
                            fullWidth
                            onClick={() => {
                              if (form.getValues().name?.trim()) {
                                onSubmit(form.getValues());
                              }
                              modals.closeAll();
                            }}
                            mt="md"
                          >
                            Done
                          </Button>
                        </>
                      ),
                    });
                  }}
                  leftSection={<VscAdd className="level-up-icon" size={14} strokeWidth={1} />}
                >
                  New Community
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Incognito>
        </Group>
      </Group>
      {/* <form onSubmit={form.onSubmit(onSubmit)}></form> */}
      <List spacing="xs" size="xs" center listStyleType="none" withPadding={false}>
        {communities.length === 0 && !isLoading && (
          <List.Item c="dimmed" fw="500">
            No communities at the moment.
          </List.Item>
        )}
        {communities.map((community) => (
          <List.Item key={community.id} fw="500" w="100%" styles={{ itemWrapper: { width: "100%" }, itemLabel: { width: "100%" } }}>
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap">
                <Incognito>
                  {community.isPublic ? (
                    <VscUnlock size={14} className="level-up-icon" strokeWidth={1} />
                  ) : (
                    <VscLock size={14} className="level-up-icon" strokeWidth={1} />
                  )}
                </Incognito>
                <Text
                  style={{ cursor: "pointer" }}
                  size={community.name.length > 25 ? "xs" : "sm"}
                  fw={500}
                  onClick={() => {
                    navigate(`/communities/${community.slug}`);
                  }}
                >
                  {community.name}
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
                            title: "Update Community Name",
                            children: (
                              <>
                                <TextInput
                                  type="text"
                                  withAsterisk
                                  label="Community Name"
                                  description="This will be the name of your community."
                                  data-autofocus
                                  placeholder="Enter name"
                                  defaultValue={community.name}
                                  onInput={(e) => {
                                    form.setFieldValue("name", e.currentTarget.value);
                                  }}
                                />
                                <Button
                                  variant="subtle"
                                  color="gray"
                                  fullWidth
                                  onClick={() => {
                                    if (form.getValues().name?.trim()) {
                                      handleRename(community);
                                    }
                                    modals.closeAll();
                                  }}
                                  mt="md"
                                >
                                  Done
                                </Button>
                              </>
                            ),
                          });
                        }}
                        leftSection={<VscEdit className="level-up-icon" size={14} strokeWidth={1} />}
                      >
                        Rename
                      </Menu.Item>
                      {community.isPublic && (
                        <Menu.Item
                          fz="xs"
                          fw="500"
                          onClick={() => handleChangeVisibility(community)}
                          leftSection={<VscLock className="level-up-icon" size={14} strokeWidth={1} />}
                        >
                          Set as Private
                        </Menu.Item>
                      )}

                      {!community.isPublic && (
                        <Menu.Item
                          fz="xs"
                          fw="500"
                          onClick={() => handleChangeVisibility(community)}
                          leftSection={<VscUnlock className="level-up-icon" size={14} strokeWidth={1} />}
                        >
                          Set as Public
                        </Menu.Item>
                      )}
                      {/* Position and reorder handlers removed because Zustand store does not support reorder */}
                      <Menu.Label>Danger zone</Menu.Label>
                      <Menu.Item fz="xs" fw="500" color="red" leftSection={<VscClose size={14} strokeWidth={1} />} onClick={() => handleRemove(community)}>
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
