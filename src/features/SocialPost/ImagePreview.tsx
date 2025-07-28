import { AspectRatio, Box, Image } from "@mantine/core";

export const ImagePreview: React.FC<{
  data: string;
}> = ({ data }) => {
  return (
    <Box>
      <AspectRatio ratio={3 / 4} style={{ cursor: "pointer" }}>
        <Image radius="sm" src={data} />
      </AspectRatio>
    </Box>
  );
};
