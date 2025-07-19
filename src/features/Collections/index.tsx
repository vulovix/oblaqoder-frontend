import { ActionIcon, Button, Group, List, Loader, Menu, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { VscAdd, VscClose, VscEdit, VscKebabVertical, VscLock, VscUnlock } from "react-icons/vsc";
import { ImBooks } from "react-icons/im";
import "./styles.scss";
import { CollectionEvent, type ICollection } from "./types";
import { useEvents } from "~/utils/events";
import { useEffect } from "react";
import { Incognito } from "~/components/Incognito";
import { useNavigate } from "react-router";
import { useCollectionStore } from "./store";
import { modals } from "@mantine/modals";
import { createSlug } from "~/utils/string";
import { useAuth } from "~/providers/Auth/useAuth";

export function Collections() {
  const { account, isLoggedIn } = useAuth();
  const collections = useCollectionStore((state) => state.collections);
  const isLoading = useCollectionStore((state) => state.isLoading);
  const fetchCollections = useCollectionStore((state) => (isLoggedIn ? state.fetchAllCollections : state.fetchCollections));
  const resetState = useCollectionStore((state) => state.resetState);
  const addCollection = useCollectionStore((state) => state.addCollection);
  const removeCollection = useCollectionStore((state) => state.removeCollection);
  const renameCollection = useCollectionStore((state) => state.renameCollection);
  const toggleVisibility = useCollectionStore((state) => state.toggleVisibility);

  const navigate = useNavigate();
  const events = useEvents();

  useEffect(() => {
    fetchCollections();
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
      name: (value) => (value.trim().length > 0 ? null : "Collection name can not be empty."),
    },
  });

  const handleRemove = (collection: ICollection) => {
    removeCollection(collection.id);
    events.emit(CollectionEvent.CollectionUpdate);
  };

  const handleChangeVisibility = (collection: ICollection) => {
    toggleVisibility(collection.id);
    events.emit(CollectionEvent.CollectionUpdate);
  };

  const handleRename = (collection: ICollection) => {
    renameCollection(collection.id, form.getValues().name);
    form.reset();
    events.emit(CollectionEvent.CollectionUpdate);
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
    addCollection(payload);
    form.reset();
    events.emit(CollectionEvent.CollectionUpdate);
  };

  return (
    <Stack className="collections" gap="xs" px="sm">
      <Group
        gap="0"
        justify="space-between"
        style={{ borderBottom: "2px solid var(--mantine-color-default)", paddingBottom: "calc(var(--mantine-spacing-xs) / 1.3)" }}
      >
        <Group gap="calc(var(--mantine-spacing-xs) / 2)">
          <ImBooks size="18" className="level-up-icon" />
          <Title size="sm" fw={600}>
            Collections
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
                      title: "Create Collection",
                      children: (
                        <>
                          <TextInput
                            type="text"
                            withAsterisk
                            label="Collection Name"
                            description="This will be the name of your collection."
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
                  New Collection
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Incognito>
        </Group>
      </Group>
      {/* <form onSubmit={form.onSubmit(onSubmit)}></form> */}
      <List spacing="xs" size="xs" center listStyleType="none" withPadding={false}>
        {collections.length === 0 && !isLoading && (
          <List.Item c="dimmed" fw="500">
            No collections at the moment.
          </List.Item>
        )}
        {collections.map((collection, index) => (
          <List.Item key={collection.id} fw="500" w="100%" styles={{ itemWrapper: { width: "100%" }, itemLabel: { width: "100%" } }}>
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs">
                <Incognito>
                  {collection.isPublic ? (
                    <VscUnlock size={14} className="level-up-icon" strokeWidth={1} />
                  ) : (
                    <VscLock size={14} className="level-up-icon" strokeWidth={1} />
                  )}
                </Incognito>
                <Text
                  size="sm"
                  fw={500}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/collections/${collection.slug}`);
                  }}
                >
                  {collection.name}
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
                            title: "Update Collection Name",
                            children: (
                              <>
                                <TextInput
                                  type="text"
                                  withAsterisk
                                  label="Collection Name"
                                  description="This will be the name of your collection."
                                  data-autofocus
                                  placeholder="Enter name"
                                  defaultValue={collection.name}
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
                                      handleRename(collection);
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
                      {collection.isPublic && (
                        <Menu.Item
                          fz="xs"
                          fw="500"
                          onClick={() => handleChangeVisibility(collection)}
                          leftSection={<VscLock className="level-up-icon" size={14} strokeWidth={1} />}
                        >
                          Set as Private
                        </Menu.Item>
                      )}

                      {!collection.isPublic && (
                        <Menu.Item
                          fz="xs"
                          fw="500"
                          onClick={() => handleChangeVisibility(collection)}
                          leftSection={<VscUnlock className="level-up-icon" size={14} strokeWidth={1} />}
                        >
                          Set as Public
                        </Menu.Item>
                      )}
                      {/* Position and reorder handlers removed because Zustand store does not support reorder */}
                      <Menu.Label>Danger zone</Menu.Label>
                      <Menu.Item fz="xs" fw="500" color="red" leftSection={<VscClose size={14} strokeWidth={1} />} onClick={() => handleRemove(collection)}>
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
