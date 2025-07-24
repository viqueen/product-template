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
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <ActionIcon
          onClick={toggle}
          variant="subtle"
          size="lg"
          aria-label={opened ? "Collapse sidebar" : "Expand sidebar"}
        >
          {opened ? (
            <IconLayoutSidebarLeftCollapse size={22} stroke={1.5} />
          ) : (
            <IconLayoutSidebarLeftExpand size={22} stroke={1.5} />
          )}
        </ActionIcon>
        <Group gap="xs">
          <IconChecklist size={24} stroke={1.5} />
          <Title order={3}>Product</Title>
        </Group>
      </Group>
      <Group>
        <ThemeToggle />
        <Avatar color="blue" radius="xl">
          JD
        </Avatar>
      </Group>
    </Group>
  );
};

export { TopNavigation };
