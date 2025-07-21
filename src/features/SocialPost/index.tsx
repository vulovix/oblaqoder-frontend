import { ActionIcon, Avatar, Chip, Flex, Group, Menu, Paper, Pill, Stack, Text, TypographyStylesProvider } from "@mantine/core";
import { RichEditor } from "~/components/RichEditor";
import "./styles.scss";
import { ImagePreview } from "./ImagePreview";
import { Carousel } from "@mantine/carousel";
import { formatRelativeTime } from "~/utils/date";
import { useNavigate } from "react-router";
import avatar from "./avatar.png";
import type { Post } from "./types";
import { GoDotFill } from "react-icons/go";
import { Incognito } from "~/components/Incognito";
import { VscClose, VscEdit, VscKebabVertical, VscLock, VscUnlock } from "react-icons/vsc";
import { APP_NAME } from "~/configuration";
import { RiAtLine } from "react-icons/ri";
import { modals } from "@mantine/modals";
import { SocialPostForm } from "../SocialPostForm";

export type SocialPostProps = {
  // onEdit(postId: number): void;
  onRemove(postId: number, deleteFiles: boolean): void;
  onVisibilityToggle(postId: number, isPublic: boolean): void;
} & Post;
export function SocialPost(props: SocialPostProps) {
  const navigate = useNavigate();
  const { content, createdAt, updatedAt, files, id, communities, collections, categories, isPublic, onRemove, onVisibilityToggle, user } = props;

  return (
    <Paper radius={0} className={"social-post"}>
      <Group gap={"xs"}>
        <Avatar src={avatar} style={{ filter: "invert(1) brightness(1.5)" }} radius="xl" size="md" />
        <Flex justify="space-between" flex={1}>
          <Group gap="4">
            <Group gap="0">
              <Text fz="sm" fw={500}>
                {user.name}
              </Text>
              <RiAtLine />
              <Text fz="sm" ff="Albert Sans">
                {APP_NAME}
              </Text>
              {/* <Text c="dimmed" fw="bold">
              <MdOutlineAlternateEmail size={16} style={{ position: "relative", top: "3px" }} />
            </Text>
            <Text fz="sm" fw="bold">
              36⅚
            </Text> */}
            </Group>

            <Text c="dimmed" fw="bold">
              <GoDotFill size={6} style={{ position: "relative", bottom: "2px" }} />
            </Text>
            <Group justify="space-between">
              <Text fz="14">{formatRelativeTime(new Date(createdAt))}</Text>
            </Group>

            <Incognito>
              <Text c="dimmed" fw="bold">
                <GoDotFill size={6} style={{ position: "relative", bottom: "2px" }} />
              </Text>
              <Group justify="space-between">
                <Chip
                  styles={{
                    label: {
                      padding: 0,
                    },
                  }}
                  p={0}
                  m={0}
                  color="dimmed"
                  icon={isPublic ? <VscUnlock /> : <VscLock />}
                  checked={true}
                  size="xs"
                  variant="filled"
                >
                  {isPublic ? "Everyone" : "Only You"}
                </Chip>
              </Group>
            </Incognito>
          </Group>

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
                {isPublic && (
                  <Menu.Item
                    fz="xs"
                    fw="500"
                    onClick={() => onVisibilityToggle(id, false)}
                    leftSection={<VscLock className="level-up-icon" size={14} strokeWidth={1} />}
                  >
                    Set as Private
                  </Menu.Item>
                )}
                {!isPublic && (
                  <Menu.Item
                    fz="xs"
                    fw="500"
                    onClick={() => onVisibilityToggle(id, true)}
                    leftSection={<VscUnlock className="level-up-icon" size={14} strokeWidth={1} />}
                  >
                    Set as Public
                  </Menu.Item>
                )}
                <Menu.Item
                  fz="xs"
                  fw="500"
                  leftSection={<VscEdit size={14} strokeWidth={1} />}
                  onClick={() => {
                    modals.open({
                      title: "Update Post",
                      children: (
                        <>
                          <SocialPostForm
                            model={{
                              id,
                              user,
                              files,
                              content,
                              userId: user.id,
                              isPublic,
                              updatedAt,
                              createdAt,
                            }}
                          />
                        </>
                      ),
                    });
                  }}
                >
                  Edit
                </Menu.Item>
                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  fz="xs"
                  fw="500"
                  color="red"
                  leftSection={<VscClose size={14} strokeWidth={1} />}
                  onClick={() => onRemove(id, Boolean(files?.length))}
                >
                  Remove
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Incognito>
        </Flex>
      </Group>
      <TypographyStylesProvider className={"body"}>
        <Stack gap={"sm"}>
          <RichEditor readonly={true} key={id} value={content} />
          {files?.length ? (
            <Carousel
              // key={files?.length ? files.map((file) => file.id).join("_") : "0"}
              className="carousel"
              withControls={false}
              withIndicators={files ? files.length > 1 : false}
              controlSize={14}
              classNames={{
                indicator: "carousel-indicator",
                controls: "carousel-controls",
              }}
            >
              {files.map((postFile) => (
                <Carousel.Slide key={postFile.id}>
                  <ImagePreview data={postFile.publicUrl} />
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <></>
          )}
          {collections?.length ? (
            <Group m="0" justify="space-between">
              {collections.map((entity) => (
                <Pill style={{ cursor: "pointer" }} size="sm" fw="500" onClick={() => navigate(`/collections/${entity.slug}`)}>
                  {entity.name}
                </Pill>
              ))}
            </Group>
          ) : (
            <></>
          )}
          {communities?.length ? (
            <Group mt={"0"} justify="space-between">
              {communities.map((entity) => (
                <Pill style={{ cursor: "pointer" }} size="sm" fw="500" onClick={() => navigate(`/communities/${entity.slug}`)}>
                  {entity.name}
                </Pill>
              ))}
            </Group>
          ) : (
            <></>
          )}
          {categories?.length ? (
            <Group mt={"0"} justify="space-between">
              {categories.map((entity) => (
                <Pill style={{ cursor: "pointer" }} size="sm" fw="500" onClick={() => navigate(`/categories/${entity.slug}`)}>
                  {entity.name}
                </Pill>
              ))}
            </Group>
          ) : (
            <></>
          )}
        </Stack>
        {/* <Group mt={files?.length ? "sm" : "0"} justify="space-between">
          <Text fz="xs" c="dimmed">
              {formatDateTime(new Date(createdAt))}
            </Text>
          <Tooltip color="dark" label="Share">
              <CloseButton size="xs" color="gray" icon={<IoIosShareAlt />}></CloseButton>
            </Tooltip>
        </Group> */}
        {/* <ScrollAreaAutosize>
          <Avatar.Group spacing={0}>
            {images.reverse().map((base64Data, i) => (
              <ImagePreview data={base64Data} key={i} />
            ))}
            {images.reverse().map((base64Data, i) => (
              <ImagePreview data={base64Data} key={i} />
            ))}
            {images.reverse().map((base64Data, i) => (
              <ImagePreview data={base64Data} key={i} />
            ))}
          </Avatar.Group>
        </ScrollAreaAutosize> */}
      </TypographyStylesProvider>
    </Paper>
  );
}
