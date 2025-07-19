import { ActionIcon, Flex, Group, Text, Tooltip } from "@mantine/core";
import { useAuth } from "~/providers/Auth/useAuth";
import { APP_NAME } from "~/configuration";
import { useNavigate } from "react-router";
import "./Footer.scss";
import { RiLoginCircleLine } from "react-icons/ri";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RiCopyrightFill } from "react-icons/ri";
import { FaCopyright } from "react-icons/fa6";
import { BsDot } from "react-icons/bs";

export function Footer() {
  const navigate = useNavigate();
  const { isLoggedIn, signOut } = useAuth();

  return (
    <Flex className={"footer-wrapper"}>
      <Group gap="4px">
        <Text fw="bold" fz="md">
          <RiCopyrightFill style={{ position: "relative", top: 2.5 }} />
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
        {!isLoggedIn ? (
          <Tooltip label="Sign in" color="dark">
            <ActionIcon onClick={() => navigate("/auth")} size="md" color="gray" variant="subtle">
              <RiLoginCircleLine size={20} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <Tooltip label="Sign out" color="dark">
            <ActionIcon onClick={() => signOut()} size="md" color="gray" variant="subtle">
              <RiLogoutCircleLine size={20} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Flex>
  );
}
