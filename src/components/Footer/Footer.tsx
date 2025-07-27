import { ActionIcon, Flex, Group, Text, Tooltip, useMantineColorScheme } from "@mantine/core";
import { useAuth } from "~/providers/Auth/useAuth";
import { APP_NAME } from "~/configuration";
import { useNavigate } from "react-router";
import "./Footer.scss";
import { RiLoginCircleLine } from "react-icons/ri";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RiCopyrightLine } from "react-icons/ri";
import { BsDot } from "react-icons/bs";
import { RiSunLine, RiMoonLine } from "react-icons/ri";

export function Footer() {
  const navigate = useNavigate();
  const { isLoggedIn, signOut } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Flex className={"footer-wrapper"}>
      <Group gap="4px">
        <Text fw="bold" fz="md">
          <RiCopyrightLine style={{ position: "relative", top: 2.5 }} />
        </Text>
        <Text fw="bold" fz="xs" ff="Albert Sans">
          {new Date().getFullYear()}
        </Text>
        <Text fw="bold" fz="xs" ff="Albert Sans">
          {APP_NAME}
        </Text>
        <Text fw="bold" fz="md">
          <BsDot style={{ position: "relative", top: 2 }} />
        </Text>
        <Text fw="bold" fz="xs" tt="uppercase">
          All Rights Reserved
        </Text>
      </Group>
      <Group gap={0} className={"links"} justify="flex-end" wrap="nowrap">
        {colorScheme === "light" ? (
          <Tooltip label="Dark Theme" color="dark">
            <ActionIcon onClick={toggleColorScheme} size="md" color="gray" variant="subtle">
              <RiMoonLine size={16} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <Tooltip label="Light Theme" color="dark">
            <ActionIcon onClick={toggleColorScheme} size="md" color="gray" variant="subtle">
              <RiSunLine size={16} />
            </ActionIcon>
          </Tooltip>
        )}
        {!isLoggedIn ? (
          <Tooltip label="Sign in" color="dark">
            <ActionIcon onClick={() => navigate("/auth")} size="md" color="gray" variant="subtle">
              <RiLoginCircleLine size={16} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <Tooltip label="Sign out" color="dark">
            <ActionIcon onClick={() => signOut()} size="md" color="gray" variant="subtle">
              <RiLogoutCircleLine size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Flex>
  );
}
