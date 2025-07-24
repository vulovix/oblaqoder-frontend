import { ActionIcon, Avatar, Box, Button, FileInput, Flex, Group, Stack, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { LiaImage } from "react-icons/lia";
import { useForm } from "@mantine/form";
import { useHover, useListState } from "@mantine/hooks";
import { FilePreview } from "./FilePreview";
import { RichEditor } from "~/components/RichEditor";
import { VscLock, VscUnlock } from "react-icons/vsc";
import { useCreatePostStore } from "./store";
import { useCollectionStore } from "../Collections/store";
import { useCommunityStore } from "../Communities/store";
import { useCategoryStore } from "../Categories/store";
import { useParams } from "react-router";
import { useAuth } from "~/providers/Auth/useAuth";
import type { Post } from "./types";
import { convertToBase64, convertImageUrlToFile } from "~/utils";
import { modals } from "@mantine/modals";
import { CREATE_POST_CONTENT_STORAGE_KEY, defaultInitialValues } from "./constants";
import { RiEraserLine } from "react-icons/ri";
import { GrRevert } from "react-icons/gr";
import "./styles.scss";

export interface SocialPostFormProps {
  model?: Post;
}

export function SocialPostForm({ model }: SocialPostFormProps) {
  const { account } = useAuth();
  const [key, setKey] = useState(new Date().getTime());
  const { main, section } = useParams();

  const { createPost, updatePost, isLoading, isUpdating } = useCreatePostStore();

  const [, handleLoadedImages] = useListState<string>([]);
  const [fileList, handleFileList] = useListState<File>([]);

  const collections = useCollectionStore((state) => state.collections);
  const communities = useCommunityStore((state) => state.communities);
  const categories = useCategoryStore((state) => state.categories);

  const forceRerender = () => setKey(new Date().getTime());

  const getRelation = () => {
    if (!main) {
      return undefined;
    }
    switch (main) {
      case "categories":
        return { relation: main, relationId: categories.find((x) => x.slug === section)!.id };
      case "collections":
        return { relation: main, relationId: collections.find((x) => x.slug === section)!.id };
      case "communities":
        return { relation: main, relationId: communities.find((x) => x.slug === section)!.id };
      default:
        return undefined;
    }
  };

  const getContentInitialValue = () => {
    if (model) {
      return "";
    }
    return localStorage.getItem(CREATE_POST_CONTENT_STORAGE_KEY) || "";
  };

  const form = useForm({
    mode: "controlled",
    initialValues: {
      ...defaultInitialValues,
      content: getContentInitialValue(),
    },
    onValuesChange: ({ content }) => {
      if (!model) {
        let contentValue = content;
        if (content === "<p></p>") {
          contentValue = "";
          form.setFieldValue("content", contentValue);
        }
        localStorage.setItem(CREATE_POST_CONTENT_STORAGE_KEY, contentValue);
      }
    },
  });

  useEffect(() => {
    // ordered files as a source of truth
    form.setFieldValue("files", fileList as any);
  }, [fileList]);

  useEffect(() => {
    if (model) {
      async function initModel(m: Post) {
        form.setFieldValue("content", m.content);
        form.setFieldValue("isPublic", m.isPublic);
        if (m.files) {
          const filesAsBase64 = await Promise.all(m.files.map((url) => convertToBase64(url.publicUrl)));
          filesAsBase64.map((file, index) => onImageLoaded(file, index));

          const files = await Promise.all(m.files.map((url) => convertImageUrlToFile(url.publicUrl)));
          handleFileList.setState(files);
          form.setFieldValue("files", files as any);
        }
        forceRerender();
      }
      initModel(model);
    }
  }, [model]);

  const onRemoveFile = (index: number) => {
    handleFileList.remove(index);
    handleLoadedImages.remove(index);
  };

  const onImageLoaded = (base64Data: string, index: number) => {
    handleLoadedImages.setItem(index, base64Data);
  };

  const handleSubmit = async (values: { content: string; files: File[]; isPublic: boolean }) => {
    if (!account) {
      return;
    }
    let { content } = values;
    const { files, isPublic } = values;
    if (content === "<p></p>") {
      content = "";
    }
    const payload = {
      content,
      isPublic,
      userId: account.id,
      files: files.map((_file, index) => fileList[index]) as any,
    };

    const relation = getRelation();

    if (model) {
      await updatePost(model, payload, relation);
      modals.closeAll();
    } else {
      await createPost(payload, relation);
      form.setInitialValues(defaultInitialValues);
      localStorage.removeItem(CREATE_POST_CONTENT_STORAGE_KEY);
    }
    form.reset();
    handleFileList.setState([]);
    forceRerender();
  };

  const { hovered: filesInputHovered, ref: filesInputRef } = useHover();
  const isContentEmpty = form.values.content === "" || form.values.content === "<p></p>";
  const isFilesAvailable = form.values.files.length;

  let isFormInvalid = isContentEmpty;

  if (isFilesAvailable) {
    isFormInvalid = false;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(form.getValues());
      }}
    >
      <Stack className="social-post-form" gap={0}>
        <RichEditor key={key} value={form.getValues().content} placeholder="What's happening?" onChange={(value) => form.setValues({ content: value })} />
        <Box>
          <Tooltip.Group openDelay={300} closeDelay={100}>
            <Avatar.Group p="0">
              {form.values.files.map((file, i) => (
                <FilePreview
                  key={i}
                  file={file}
                  onRemove={() => onRemoveFile(i)}
                  onImageLoaded={(base64Data: string) => onImageLoaded(base64Data, i)}
                  onMoveLeft={i > 0 ? () => handleFileList.swap({ from: i, to: i - 1 }) : undefined}
                  onMoveRight={i + 1 < fileList.length ? () => handleFileList.swap({ from: i, to: i + 1 }) : undefined}
                />
              ))}
            </Avatar.Group>
          </Tooltip.Group>
        </Box>

        <Flex justify={"space-between"}>
          <Flex align={"center"}>
            <Group p={0} ref={filesInputRef} style={{ position: "relative" }}>
              <Tooltip position="bottom" withArrow events={{ hover: true, focus: true, touch: true }} color="gray" fz="xs" fw="500" label="Media">
                {/* This is an incredible level of shit code. */}
                <Box style={{ position: "relative", top: 0, right: 0, width: 28, height: 28 }}>
                  <LiaImage size={18} strokeWidth={1} style={{ position: "relative", top: 5, left: 5 }} />
                  <FileInput
                    variant="unstyled"
                    styles={{
                      wrapper: {
                        padding: 0,
                        right: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 28,
                        height: 28,
                        overflow: "hidden",
                        borderRadius: "var(--mantine-radius-sm)",
                      },
                      input: {
                        transition: "none",
                        // background: "#FFFFFFAA",
                        background: filesInputHovered ? "var(--mantine-color-gray-light-hover)" : "",
                      },
                    }}
                    accept="image/png"
                    valueComponent={() => null}
                    multiple
                    {...form.getInputProps("files")}
                    onChange={(files) => {
                      files.forEach((file) => handleFileList.append(file));
                    }}
                  />
                </Box>
              </Tooltip>
            </Group>

            <Tooltip
              withArrow
              color="gray"
              position="bottom"
              events={{ hover: true, focus: true, touch: true }}
              fz="xs"
              fw="500"
              label={`Audience: ${form.values.isPublic ? "Everyone" : "Only You"}`}
            >
              <ActionIcon style={{ transform: "none" }} variant="subtle" color="gray" onClick={() => form.setFieldValue("isPublic", !form.values.isPublic)}>
                {form.values.isPublic ? (
                  <VscUnlock size={15} className="level-up-icon" strokeWidth={0.8} />
                ) : (
                  <VscLock size={15} className="level-up-icon" strokeWidth={0.8} />
                )}
              </ActionIcon>
            </Tooltip>

            {!model && form.getValues().content?.length ? (
              <Tooltip withArrow color="gray" position="bottom" events={{ hover: true, focus: true, touch: true }} fz="xs" fw="500" label={`Clear Content`}>
                <ActionIcon
                  style={{ transform: "none" }}
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    localStorage.removeItem(CREATE_POST_CONTENT_STORAGE_KEY);
                    form.setFieldValue("content", "");
                    forceRerender();
                  }}
                >
                  <RiEraserLine size={15} className="level-up-icon" strokeWidth={0.8} />
                </ActionIcon>
              </Tooltip>
            ) : (
              <></>
            )}
            {!model && JSON.stringify(defaultInitialValues) !== JSON.stringify(form.getValues()) ? (
              <Tooltip withArrow color="gray" position="bottom" events={{ hover: true, focus: true, touch: true }} fz="xs" fw="500" label={`Reset Form`}>
                <ActionIcon
                  style={{ transform: "none" }}
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    form.setInitialValues(defaultInitialValues);
                    form.reset();
                    localStorage.removeItem(CREATE_POST_CONTENT_STORAGE_KEY);
                    handleFileList.setState([]);
                    forceRerender();
                  }}
                >
                  <GrRevert size={15} className="level-up-icon" strokeWidth={0.8} />
                </ActionIcon>
              </Tooltip>
            ) : (
              <></>
            )}
          </Flex>
          <Group>
            <Button
              type="submit"
              color="gray"
              disabled={model ? isUpdating || isFormInvalid : isLoading || isFormInvalid}
              loading={model ? isUpdating : isLoading}
              loaderProps={{ size: "xs" }}
              size="xs"
            >
              {model ? "Update" : ""} Post
            </Button>
          </Group>
        </Flex>
      </Stack>
    </form>
  );
}
