import { Box, ScrollArea, Stack, Tabs } from "@mantine/core";
import { useNavigate, useParams } from "react-router";
// import { CommunitiesRoute } from "routes/Communities";
// import { CollectionsRoute } from "routes/Collections";
// import { SocialPostForm } from "features/SocialPostForm";
import { useViewportSize } from "@mantine/hooks";
import { DEFAULT_CONTENT_WIDTH, DEFAULT_DRAWER_WIDTH } from "~/configuration";
import { useCollapseDesktopLayoutContext } from "~/components/Layout/context";
// import { CollectionPicker } from "features/CollectionPicker";
import { CommunityPicker } from "~/features/CommunityPicker";
import { Wall } from "./Wall";
import "./styles.scss";
import { Incognito } from "~/components/Incognito";
import { CollectionPicker } from "~/features/CollectionPicker";
import { SocialPostForm } from "~/features/SocialPostForm";
import { CategoryPicker } from "~/features/CategoryPicker";
import { FilteredWall } from "./FilteredWall";
import { TopicPicker } from "~/features/TopicPicker";

export function IndexRoute() {
  const navigate = useNavigate();
  const rootPath = "";
  const layoutContext = useCollapseDesktopLayoutContext();

  const { main } = useParams();
  const defaultMain = "wall";

  const handleMainChange = (value: string | null) => {
    if (!value) {
      return;
    }
    if (value === defaultMain) {
      navigate("/");
      return;
    }
    const independentModules = ["topics", "collections", "communities", "categories"];
    if (independentModules.includes(value)) {
      return;
    }
    navigate(`${rootPath}/${value}`);
  };

  const { width } = useViewportSize();

  return (
    <Stack className="index-container" gap="sm">
      <Box className="main">
        <Tabs
          defaultValue={defaultMain}
          value={main || defaultMain}
          keepMounted={false}
          styles={{
            tabLabel: { fontWeight: "600" },
            tab: { outlineColor: "transparent" },
            panel: { paddingTop: "var(--mantine-spacing-sm)" },
          }}
          onChange={handleMainChange}
        >
          <ScrollArea
            type="never"
            w={
              (width > DEFAULT_CONTENT_WIDTH ? DEFAULT_CONTENT_WIDTH : width) -
              (layoutContext.sidebarOpened && !layoutContext.isLayoutSm ? DEFAULT_DRAWER_WIDTH : 0) -
              (layoutContext.asideOpened && !layoutContext.isLayoutSm ? DEFAULT_DRAWER_WIDTH : 0)
            }
            className="sticky-container"
          >
            <Tabs.List className="main-tab-list">
              <Tabs.Tab className="tab" value="wall">
                Wall
              </Tabs.Tab>
              {/* <Tabs.Tab className="tab" value="achievements">
                Achievements
              </Tabs.Tab> */}
              <Tabs.Tab className="tab" value="topics">
                <TopicPicker />
              </Tabs.Tab>
              <Tabs.Tab className="tab" value="collections">
                <CollectionPicker />
              </Tabs.Tab>
              <Tabs.Tab className="tab" value="communities">
                <CommunityPicker />
              </Tabs.Tab>
              <Tabs.Tab className="tab" value="categories">
                <CategoryPicker />
              </Tabs.Tab>
              {/* <Tabs.Tab className="tab" value="thoughts">
                Thoughts
              </Tabs.Tab> */}
            </Tabs.List>
          </ScrollArea>

          <Box className="main-content">
            {main == "topics" ? (
              <></>
            ) : (
              <Incognito>
                <SocialPostForm />
              </Incognito>
            )}
            <Tabs.Panel value="wall">
              <Wall />
            </Tabs.Panel>
            <Tabs.Panel value="topics">
              <FilteredWall />
            </Tabs.Panel>
            <Tabs.Panel value="collections">
              <FilteredWall />
            </Tabs.Panel>
            <Tabs.Panel value="communities">
              <FilteredWall />
            </Tabs.Panel>
            <Tabs.Panel value="categories">
              <FilteredWall />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Box>
    </Stack>
  );
}
