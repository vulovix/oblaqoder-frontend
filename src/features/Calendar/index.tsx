import { useEffect, useMemo, useState } from "react";
import { MdToday } from "react-icons/md";
import { DatePicker, DatesProvider } from "@mantine/dates";
import { VscKebabVertical, VscTarget } from "react-icons/vsc";
import { ActionIcon, Group, Indicator, Menu, Stack, Title } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
import { getFormattedDate } from "~/utils/date";
import type { Post } from "./types";
import dayjs from "dayjs";
import { useAuth } from "~/providers/Auth/useAuth";
import { useCalendarPostsStore } from "./store";
import "./styles.scss";

const checkIfPostExistForDate = (date: Date, data: Array<Post>): boolean => {
  const target = dayjs(date).startOf("day");
  return data.some((x) => dayjs.utc(x.createdAt).local().isSame(target, "day"));
};

const dayRenderer = (date: Date, data: Array<Post>) => {
  const day = date.getDate();
  const isActive = checkIfPostExistForDate(date, data);
  return (
    <Indicator size={6} color="var(--mantine-color-dimmed)" offset={-5} disabled={!isActive}>
      <div>{day}</div>
    </Indicator>
  );
};

export function Calendar() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const queryDate = query.get("date");

  const { posts, fetchInitialPosts, resetPosts } = useCalendarPostsStore();
  const [value, setValue] = useState<Date>(queryDate ? new Date(queryDate) : new Date());
  const [date, setDate] = useState(new Date());

  const isSelectedDateEqualAsTodaysDate = value.toDateString() === new Date().toDateString();

  const handleChange = (newValue: string | null) => {
    const v = newValue ? new Date(newValue) : new Date();
    setValue(v);
  };

  const handleDateChange = (newValue: string) => {
    setDate(new Date(newValue));
  };

  const onFocusOnMostRecent = () => {
    handleChange(new Date().toDateString());
    navigate(`/`);
  };

  const onShowPostForSelectedDate = () => {
    if (isSelectedDateEqualAsTodaysDate) {
      if (location.pathname == "/") {
        navigate("/");
      }
    } else {
      navigate(`/?date=${getFormattedDate(new Date(value))}`);
    }
  };

  useEffect(() => {
    fetchInitialPosts(isLoggedIn);
    return () => resetPosts();
  }, [isLoggedIn]);

  useEffect(() => {
    onShowPostForSelectedDate();
  }, [value]);

  useEffect(() => {
    if (!queryDate) {
      setValue(new Date());
      setDate(new Date());
    }
  }, [queryDate]);

  return (
    <Stack className="calendar" gap="xs">
      <DatesProvider settings={{ consistentWeeks: true }}>
        <Group
          gap="0"
          justify="space-between"
          style={{ borderBottom: "2px solid var(--mantine-color-default)", paddingBottom: "calc(var(--mantine-spacing-xs) / 1.3)" }}
        >
          <Group gap="calc(var(--mantine-spacing-xs) / 2)">
            <MdToday size="20" className="level-up-icon" />
            <Title size="sm" fw={600}>
              Calendar
            </Title>
          </Group>
          <Group justify="center">
            <Menu withArrow position="bottom" transitionProps={{ transition: "pop" }} withinPortal={false}>
              <Menu.Target>
                <ActionIcon size="sm" variant="subtle" color="gray">
                  <VscKebabVertical size={14} style={{ transform: "rotate(90deg)" }} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Options</Menu.Label>
                <Menu.Item
                  fz="xs"
                  fw="500"
                  onClick={() => onFocusOnMostRecent()}
                  disabled={isSelectedDateEqualAsTodaysDate}
                  leftSection={<VscTarget className="level-up-icon" size={14} strokeWidth={1} />}
                >
                  Focus on Today
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
        <DatePicker
          size="xs"
          date={date}
          color="gray"
          value={value}
          highlightToday
          maxLevel="month"
          weekdayFormat="ddd"
          maxDate={new Date()}
          onChange={handleChange}
          onDateChange={handleDateChange}
          renderDay={(date) => dayRenderer(new Date(date), posts)}
          classNames={{
            day: "day",
            month: "month",
            weekday: "weekday",
            calendarHeader: "header",
            weekNumber: "week-number",
          }}
        />
      </DatesProvider>
    </Stack>
  );
}
