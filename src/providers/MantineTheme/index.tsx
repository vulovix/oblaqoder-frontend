import React, { type PropsWithChildren } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";

import { theme } from "./theme";
import { Notifications } from "@mantine/notifications";
import { cssVariableResolver } from "./cssVariableResolver";
import { ModalsProvider } from "@mantine/modals";

export function MantineThemeProvider(props: PropsWithChildren<unknown>) {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="dark"
      //
      cssVariablesResolver={cssVariableResolver}
    >
      <Notifications />
      <ModalsProvider>{props.children}</ModalsProvider>
    </MantineProvider>
  );
}
