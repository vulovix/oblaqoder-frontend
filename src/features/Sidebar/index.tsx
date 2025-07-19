import { Stack } from "@mantine/core";
// import { Calendar } from "~/features/Calendar";
// import { Collections } from "~/features/Collections";
// import { Communities } from "~/features/Communities";
import "./styles.scss";
import { Calendar } from "~/features/Calendar";
import { Collections } from "~/features/Collections";
import { Communities } from "../Communities";
import { Categories } from "../Categories";

export function Sidebar() {
  return (
    <Stack>
      <Calendar />
      <Collections />
      <Communities />
      <Categories />
    </Stack>
  );
}
