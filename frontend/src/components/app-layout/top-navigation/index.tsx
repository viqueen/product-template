import { Group, Title, Avatar, ActionIcon } from "@mantine/core";
import {
  IconChecklist,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";
import { ThemeToggle } from "../../theme-toggle";

interface TopNavigationProps {
  opened: boolean;
  toggle: () => void;
}

const TopNavigation = ({ opened, toggle }: TopNavigationProps) => {
  return (
    <Group h="100%" px="sm" justify="space-between">
      <Group gap="xs">
        <ActionIcon
          onClick={toggle}
          variant="subtle"
          size="sm"
          aria-label={opened ? "Collapse sidebar" : "Expand sidebar"}
        >
          {opened ? (
            <IconLayoutSidebarLeftCollapse size={18} stroke={1.5} />
          ) : (
            <IconLayoutSidebarLeftExpand size={18} stroke={1.5} />
          )}
        </ActionIcon>
        <Group gap={4}>
          <IconChecklist size={20} stroke={1.5} />
          <Title order={4}>Product</Title>
        </Group>
      </Group>
      <Group gap="xs">
        <ThemeToggle />
        <Avatar size="sm" color="blue" radius="xl">
          JD
        </Avatar>
      </Group>
    </Group>
  );
};

export { TopNavigation };
