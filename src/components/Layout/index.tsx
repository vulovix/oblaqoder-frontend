import { type PropsWithChildren, useEffect, useState } from "react";
import { AppShell, Burger, Container, Flex, ScrollArea, Stack } from "@mantine/core";
import { useClickOutside, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { DEFAULT_CONTENT_WIDTH, DEFAULT_DRAWER_WIDTH } from "~/configuration";
import { Footer } from "~/components/Footer/Footer";
import { Header } from "~/components/Header/Header";
import { Sidebar } from "~/features/Sidebar";
import { CollapseDesktopLayoutContext } from "./context";
import "./styles.scss";

export function CollapseDesktopLayout(props: PropsWithChildren) {
  const [opened, { toggle, close, open }] = useDisclosure(true);
  const [sidebarBurgerRef, setSidebarBurgerRef] = useState(null);
  const [sidebarBodyRef, setSidebarBodyRef] = useState(null);
  const [asideBodyRef] = useState(null);
  const sidebarRef = useClickOutside(
    () => {
      if (!isLayoutSm) {
        return;
      }
      if (opened) {
        close();
      }
    },
    null,
    [sidebarBurgerRef, sidebarBodyRef]
  );
  const [asideOpened, { toggle: toggleAsside, close: closeAsside, open: openAsside }] = useDisclosure(true);
  const [asideBurgerRef, setAsideBurgerRef] = useState(null);
  const asideRef = useClickOutside(
    () => {
      if (!isLayoutSm) {
        return;
      }
      if (asideOpened) {
        closeAsside();
      }
    },
    null,
    [asideBurgerRef, asideBodyRef]
  );
  const withBorders = false;
  const headerHeight = 55;
  const footerHeight = 55;
  const drawerWidth = DEFAULT_DRAWER_WIDTH;
  const shellWidth = DEFAULT_CONTENT_WIDTH;
  const isLayoutSm = useMediaQuery("(max-width: 48em)");
  useEffect(() => {
    if (isLayoutSm) {
      close();
      closeAsside();
    } else {
      open();
      openAsside();
    }
  }, [isLayoutSm]);
  return (
    <CollapseDesktopLayoutContext
      value={{
        isLayoutSm: isLayoutSm,
        sidebarOpened: opened,
        asideOpened: asideOpened,
      }}
    >
      <AppShell
        layout="alt"
        className="app-shell"
        withBorder={withBorders}
        header={{ height: headerHeight }}
        footer={{ height: footerHeight }}
        navbar={{ width: drawerWidth, breakpoint: "xl" }}
        aside={{ width: drawerWidth, breakpoint: "xl" }}
      >
        <AppShell.Header className="app-shell-header" maw={shellWidth}>
          <Flex className="wrapper">
            <Burger ref={setSidebarBurgerRef as any} opened={opened} onClick={toggle} size="xs" hiddenFrom="sm" />
            <Header />
            <Burger ref={setAsideBurgerRef as any} opened={asideOpened} onClick={toggleAsside} size="xs" hiddenFrom="sm" style={{ visibility: "hidden" }} />
          </Flex>
        </AppShell.Header>
        <AppShell.Main
          maw={shellWidth}
          className="app-shell-main"
          mah={`calc(100dvh - ${headerHeight}px - ${footerHeight}px - ${withBorders ? "2px" : "0px"} - var(--mantine-spacing-sm))`}
        >
          <Flex className="wrapper">
            <AppShell.Navbar
              ref={sidebarRef}
              miw={drawerWidth}
              maw={drawerWidth}
              top={headerHeight}
              className={`app-shell-navbar ${opened ? "opened" : "closed"}`}
              mah={`calc(100dvh - ${headerHeight}px - ${footerHeight}px - ${withBorders ? "2px" : "0px"})`}
            >
              <Stack className="wrapper" ref={setSidebarBodyRef as any}>
                <Sidebar />
              </Stack>
            </AppShell.Navbar>

            <ScrollArea className="wrapper-content" type="never" mah={`calc(100dvh - ${headerHeight}px - ${footerHeight}px - ${withBorders ? "2px" : "0px"})`}>
              <Container
                maw={shellWidth}
                className={`content-container ${withBorders ? "with-borders" : "without-borders"} ${opened ? "navbar-opened" : ""} ${
                  asideOpened ? "aside-opened" : ""
                }`}
              >
                {props.children}
              </Container>
            </ScrollArea>

            <AppShell.Aside
              miw={drawerWidth}
              maw={drawerWidth}
              top={headerHeight}
              mah={`calc(100dvh - ${headerHeight}px - ${footerHeight}px - ${withBorders ? "2px" : "0px"})`}
              className={`app-shell-aside ${asideOpened ? "opened" : "closed"}`}
              ref={asideRef}
            >
              {/* <Stack className="wrapper" ref={setAsideBodyRef as any}>
                <Flex justify="space-between" align="center">
                  <Text>Aside</Text>
                  <Burger opened={asideOpened} onClick={toggleAsside} hiddenFrom="sm" size="sm" />
                </Flex>

                {Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton key={index} h={28} mt="sm" animate={false} />
                  ))}
              </Stack> */}
            </AppShell.Aside>
          </Flex>
        </AppShell.Main>

        <AppShell.Footer className="app-shell-footer" maw={shellWidth}>
          <Flex className="wrapper">
            <Footer />
          </Flex>
        </AppShell.Footer>
      </AppShell>
    </CollapseDesktopLayoutContext>
  );
}
