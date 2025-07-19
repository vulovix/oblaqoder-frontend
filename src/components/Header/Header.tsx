import { useDisclosure } from "@mantine/hooks";
import { NavLink, useNavigate, useResolvedPath } from "react-router";
import { Center, Group, Menu } from "@mantine/core";

import "./Header.scss";
import { LogoQ } from "../LogoQ/Logo";

export interface Link {
  link: string;
  label: string;
  links: Array<Link>;
}
const links: Array<Link> = [
  { link: "/", label: "Home", links: [] },
  // { link: "/about", label: "About", links: [] },
  { link: "/profile", label: "Profile", links: [] },
  // { link: "/blog", label: "Blog", links: [] },
  // {
  //   link: "#learn",
  //   label: "Learn",
  //   links: [
  //     { link: "/documentation", label: "Documentation", links: [] },
  //     { link: "/resources", label: "Resources", links: [] },
  //     { link: "/community", label: "Community", links: [] },
  //   ],
  // },
  // {
  //   link: "#support",
  //   label: "Support",
  //   links: [
  //     { link: "/faq", label: "FAQ", links: [] },
  //     { link: "/demo", label: "Book a demo", links: [] },
  //     { link: "/forums", label: "Forums", links: [] },
  //   ],
  // },
  // { link: "/sign-in", label: "Sign in", links: [] },
];

export function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
    close();
  };

  const { pathname } = useResolvedPath("");

  const items = links.map((link) => {
    const { links } = link;
    const menuItems = links.length
      ? links.map((item) => (
          <Menu.Item onClick={() => handleNavigate(item.link)} key={item.link}>
            {item.label}
          </Menu.Item>
        ))
      : null;

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a href={link.link} className={"link"} onClick={(event) => event.preventDefault()}>
              <Center>
                <span className={"linkLabel"}>{link.label}</span>
                &darr;
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <NavLink key={link.label} to={link.link} className={"link"}>
        {link.label}
      </NavLink>
    );
  });

  const mobileItems = links.map((link) => {
    const menuItems = link.links.length
      ? link.links.map((item) => (
          <Menu.Item className={`${pathname === link.link ? "active" : ""}`} onClick={() => handleNavigate(item.link)} key={item.link}>
            {item.label}
          </Menu.Item>
        ))
      : null;

    if (menuItems) {
      return (
        <Menu keepMounted key={link.label} trigger="click" transitionProps={{ exitDuration: 10 }} withinPortal={false}>
          <Menu.Target>
            <a
              href={link.link}
              className={"link"}
              onClick={(event) => {
                event.preventDefault();
              }}
            >
              <Group justify="space-between">
                <span className={"linkLabel"}>{link.label}</span>
                &darr;
              </Group>
            </a>
          </Menu.Target>
          <Menu.Dropdown w={"100%"} className={"mobileDropdown"}>
            {menuItems}
          </Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <NavLink key={link.label} to={link.link} onClick={close} className={({ isActive }) => (isActive ? `link active` : "link")}>
        {link.label}
      </NavLink>
    );
  });

  return (
    <header className={"header-wrapper"}>
      <div className={"inner"}>
        {/* <Logo /> */}
        <LogoQ />
        {/* <Group gap={5} visibleFrom="sm">
            {items}
          </Group> */}
        {/* {opened ? (
            <Stack gap={5} hiddenFrom="sm" className={"mobileLinks"}>
              {mobileItems}
            </Stack>
          ) : null} */}
        {/* <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" /> */}
      </div>
    </header>
  );
}
