import { AspectRatio, Box, Image, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export const ImagePreview: React.FC<{
  data: string;
}> = ({ data }) => {
  const [opened, { close }] = useDisclosure(false);

  return (
    <Box>
      <Modal size="xl" opened={opened} onClose={close} title="Preview">
        <Image radius="sm" src={data} />
      </Modal>
      <AspectRatio ratio={3 / 4} style={{ cursor: "pointer" }}>
        <Image
          radius="sm"
          src={data}
          // onClick={open}
        />
      </AspectRatio>
    </Box>
  );
};
