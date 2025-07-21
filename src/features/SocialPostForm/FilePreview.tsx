import { ActionIcon, Avatar, Box, Flex, Group, Tooltip } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { VscChevronLeft, VscChevronRight, VscClose } from "react-icons/vsc";

export const FilePreview: React.FC<{
  file: File;
  onRemove(): void;
  onImageLoaded(base64Data: string): void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
}> = ({ file, onRemove, onImageLoaded, onMoveLeft, onMoveRight }) => {
  const loadImage = (file: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => (typeof reader.result === "string" ? resolve(reader.result) : reject(reader.result));
      reader.onerror = (error) => reject(error);
    });
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadImage(file).then((url) => {
      setImageUrl(url);
      onImageLoaded(url);
    });
  }, [file]);

  const { hovered, ref } = useHover();

  return (
    <Box ref={ref}>
      {imageUrl ? (
        <Tooltip label={file.name} maw={250} withArrow>
          <Box
            style={{
              paddingLeft: "10px",
              position: "relative",
              // marginTop: "var(--mantine-spacing-sm)",
              marginBottom: "var(--mantine-spacing-sm)",
            }}
          >
            {hovered ? (
              <Flex justify="space-between" style={{ zIndex: 1, position: "absolute", top: "-8px", width: "100%", left: 0 }}>
                <Group>
                  {onMoveLeft ? (
                    <ActionIcon size="xs" radius="xl" color="gray" onClick={onMoveLeft}>
                      <VscChevronLeft size={12} strokeWidth={1} />
                    </ActionIcon>
                  ) : (
                    <></>
                  )}
                  {onMoveRight ? (
                    <ActionIcon size="xs" radius="xl" color="gray" onClick={onMoveRight}>
                      <VscChevronRight size={12} strokeWidth={1} />
                    </ActionIcon>
                  ) : (
                    <></>
                  )}
                </Group>
                <Group>
                  <ActionIcon size="xs" radius="xl" color="red" onClick={onRemove}>
                    <VscClose size={12} strokeWidth={1} />
                  </ActionIcon>
                </Group>
              </Flex>
            ) : (
              <></>
            )}
            <Avatar
              style={
                {
                  //
                  // border: "1px solid var(--mantine-color-default)"
                }
              }
              size={128}
              src={imageUrl}
              radius="sm"
            />
          </Box>
        </Tooltip>
      ) : (
        <></>
      )}
    </Box>
  );
};
