import { useEffect, useMemo, useState } from "react";
import { MdToday } from "react-icons/md";
import { DatePicker, DatesProvider } from "@mantine/dates";
import { VscKebabVertical, VscTarget } from "react-icons/vsc";
import { ActionIcon, Group, Indicator, Menu, Stack, Title } from "@mantine/core";
import "./styles.scss";
// import { useWallPosts } from "routes/Index/Wall/useWallPosts";
// import { ICollectionPost } from "routes/Collections/types";
import { useLocation, useNavigate } from "react-router";
import { getFormattedDate } from "~/utils/date";
import { useCalendarPosts } from "./useCalendarPosts";
import type { Post } from "./types";

const checkIfPostExistForDate = (date: Date, data: Array<Post>): boolean => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const isActive = data.find((x) => {
    const postDate = new Date(x.createdAt);
    return postDate.getDate() === day && postDate.getMonth() === month && postDate.getFullYear() === year;
  });
  return Boolean(isActive);
};
const dayRenderer = (date: Date, data: Array<Post>) => {
  const day = date.getDate();
  const isActive = checkIfPostExistForDate(date, data);
  return (
    <Indicator size={6} color="gray" offset={-5} disabled={!isActive}>
      <div>{day}</div>
      {/* {isActive ? <div>{day}</div> : <div style={{ opacity: 0.5 }}>{day}</div>} */}
    </Indicator>
  );
};

export function Calendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const queryDate = query.get("date");

  const { posts: data } = useCalendarPosts();
  const [value, setValue] = useState<Date>(queryDate ? new Date(queryDate) : new Date());
  const [date, setDate] = useState(new Date());

  // const doesPostExistForChoosenDate = checkIfPostExistForDate(value, data);
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
            {/* <MdLocalActivity size="20" className="level-up-icon" /> */}
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
                {/* {!isSelectedDateEqualAsTodaysDate && (
                  <Menu.Item
                    fz="xs"
                    fw="500"
                    onClick={() => onShowPostForSelectedDate()}
                    disabled={!doesPostExistForChoosenDate || isSelectedDateEqualAsTodaysDate}
                    leftSection={<VscCalendar className="level-up-icon" size={14} strokeWidth={1} />}
                  >
                    Show Posts for Selected Date
                  </Menu.Item>
                )} */}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
        <DatePicker
          size="xs"
          color="gray"
          date={date}
          onDateChange={handleDateChange}
          value={value}
          onChange={handleChange}
          maxLevel="month"
          maxDate={new Date()}
          classNames={{
            calendarHeader: "header",
            weekday: "weekday",
            day: "day",
            weekNumber: "week-number",
            month: "month",
          }}
          renderDay={(date) => dayRenderer(new Date(date), data)}
          highlightToday
          weekdayFormat="ddd"
          // withCellSpacing={false}
        />
      </DatesProvider>
    </Stack>
  );
}
