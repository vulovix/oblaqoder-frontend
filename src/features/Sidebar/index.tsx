import { Stack } from "@mantine/core";
import "./styles.scss";
import { Calendar } from "~/features/Calendar";
import { Collections } from "~/features/Collections";
import { Communities } from "~/features/Communities";
import { Categories } from "~/features/Categories";
import { Topics } from "~/features/Topics";

export function Sidebar() {
  return (
    <Stack>
      <Calendar />
      <Topics />
      <Collections />
      <Communities />
      <Categories />
    </Stack>
  );
}
