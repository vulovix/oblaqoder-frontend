import { Group, Menu, Text } from "@mantine/core";
import { useState } from "react";
import { VscCheck } from "react-icons/vsc";
import { BsDot } from "react-icons/bs";

export function CategorySelect({
  data,
  value,
  category,
  onChange,
  onLabelClick,
  onCategoryClick,
}: {
  value: string;
  category: string;
  onLabelClick?: () => void;
  onCategoryClick: () => void;
  onChange(value: string): void;
  data: Array<{ value: string; label: string }>;
}) {
  const [opened, setOpened] = useState(false);
  const selectedOption = data.find((x) => x.value === value);

  return (
    <Menu position="bottom" disabled={!selectedOption} width="target" opened={opened} onChange={setOpened}>
      <Menu.Target>
        <Group gap={2} wrap={"nowrap"}>
          <Text
            fz="sm"
            fw={600}
            c="dimmed"
            onClick={() => {
              onCategoryClick();
              setTimeout(() => {
                setOpened(false);
              }, 0);
            }}
          >
            {category} <BsDot strokeWidth={1} style={{ position: "relative", top: "2px" }} />
          </Text>
          {selectedOption ? (
            <Text fz="sm" fw={600} onClick={onLabelClick} c="var(--mantine-color-text)">
              {selectedOption.label}&nbsp;
            </Text>
          ) : (
            <Text fz="sm" fw={600} onClick={onLabelClick} c="dimmed">
              None
            </Text>
          )}
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        {[...data].map((item) => (
          <Menu.Item key={item.value} rightSection={item.value === selectedOption?.value ? <VscCheck /> : <></>} onClick={() => onChange(item.value)}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
