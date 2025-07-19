import { ActionIcon, Button, Group, List, Loader, Menu, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { VscAdd, VscClose, VscEdit, VscKebabVertical, VscLock, VscUnlock } from "react-icons/vsc";
import "./styles.scss";
import { CategoryEvent, type ICategory } from "./types";
import { useEvents } from "~/utils/events";
import { useEffect } from "react";
import { Incognito } from "~/components/Incognito";
import { useNavigate } from "react-router";
import { useCategoryStore } from "./store";
import { createSlug } from "~/utils/string";
import { modals } from "@mantine/modals";
import { MdOutlineCategory } from "react-icons/md";
import { useAuth } from "~/providers/Auth/useAuth";

export function Categories() {
  const { account, isLoggedIn } = useAuth();
  const categories = useCategoryStore((state) => state.categories);
  const isLoading = useCategoryStore((state) => state.isLoading);
  const fetchCategories = useCategoryStore((state) => (isLoggedIn ? state.fetchAllCategories : state.fetchPublicCategories));
  const resetState = useCategoryStore((state) => state.resetState);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const removeCategory = useCategoryStore((state) => state.removeCategory);
  const renameCategory = useCategoryStore((state) => state.renameCategory);
  const toggleVisibility = useCategoryStore((state) => state.toggleVisibility);

  const navigate = useNavigate();
  const events = useEvents();

  useEffect(() => {
    fetchCategories();
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
      name: (value) => (value.trim().length > 0 ? null : "Category name can not be empty."),
    },
  });

  const handleRemove = (category: ICategory) => {
    removeCategory(category.id);
    events.emit(CategoryEvent.CategoryUpdate);
  };

  const handleChangeVisibility = (category: ICategory) => {
    toggleVisibility(category.id);
    events.emit(CategoryEvent.CategoryUpdate);
  };

  const handleRename = (category: ICategory) => {
    renameCategory(category.id, form.getValues().name);
    form.reset();
    events.emit(CategoryEvent.CategoryUpdate);
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
    addCategory(payload);
    form.reset();
    events.emit(CategoryEvent.CategoryUpdate);
  };

  return (
    <Stack className="categories" gap="xs" px="sm">
      <Group
        gap="0"
        justify="space-between"
        style={{ borderBottom: "2px solid var(--mantine-color-default)", paddingBottom: "calc(var(--mantine-spacing-xs) / 1.3)" }}
      >
        <Group gap="calc(var(--mantine-spacing-xs) / 2)">
          <MdOutlineCategory size="18" className="level-up-icon" />
          <Title size="sm" fw={600}>
            Categories
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
                      title: "Create Category",
                      children: (
                        <>
                          <TextInput
                            type="text"
                            withAsterisk
                            label="Category Name"
                            description="This will be the name of your category."
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
                  New Category
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Incognito>
        </Group>
      </Group>
      {/* <form onSubmit={form.onSubmit(onSubmit)}></form> */}
      <List spacing="xs" size="xs" center listStyleType="none" withPadding={false}>
        {categories.length === 0 && !isLoading && (
          <List.Item c="dimmed" fw="500">
            No categories at the moment.
          </List.Item>
        )}
        {categories.map((category) => (
          <List.Item key={category.id} fw="500" w="100%" styles={{ itemWrapper: { width: "100%" }, itemLabel: { width: "100%" } }}>
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap">
                <Incognito>
                  {category.isPublic ? (
                    <VscUnlock size={14} className="level-up-icon" strokeWidth={1} />
                  ) : (
                    <VscLock size={14} className="level-up-icon" strokeWidth={1} />
                  )}
                </Incognito>
                <Text
                  style={{ cursor: "pointer" }}
                  size={category.name.length > 25 ? "xs" : "sm"}
                  fw={500}
                  onClick={() => {
                    navigate(`/categories/${category.slug}`);
                  }}
                >
                  {category.name}
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
                            title: "Update Category Name",
                            children: (
                              <>
                                <TextInput
                                  type="text"
                                  withAsterisk
                                  label="Category Name"
                                  description="This will be the name of your category."
                                  data-autofocus
                                  placeholder="Enter name"
                                  defaultValue={category.name}
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
                                      handleRename(category);
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
                      {category.isPublic && (
                        <Menu.Item
                          fz="xs"
                          fw="500"
                          onClick={() => handleChangeVisibility(category)}
                          leftSection={<VscLock className="level-up-icon" size={14} strokeWidth={1} />}
                        >
                          Set as Private
                        </Menu.Item>
                      )}

                      {!category.isPublic && (
                        <Menu.Item
                          fz="xs"
                          fw="500"
                          onClick={() => handleChangeVisibility(category)}
                          leftSection={<VscUnlock className="level-up-icon" size={14} strokeWidth={1} />}
                        >
                          Set as Public
                        </Menu.Item>
                      )}
                      {/* Position and reorder handlers removed because Zustand store does not support reorder */}
                      <Menu.Label>Danger zone</Menu.Label>
                      <Menu.Item fz="xs" fw="500" color="red" leftSection={<VscClose size={14} strokeWidth={1} />} onClick={() => handleRemove(category)}>
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
