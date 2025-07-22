import { Stack, Button } from "@mantine/core";
import {
  IconHome,
  IconFolders,
  IconChecklist,
  IconUsers,
  IconSettings,
} from "@tabler/icons-react";

const SideNavigation = () => {
  const navItems = [
    { label: "Dashboard", icon: IconHome, active: true },
    { label: "Projects", icon: IconFolders },
    { label: "Tasks", icon: IconChecklist },
    { label: "Team", icon: IconUsers },
    { label: "Settings", icon: IconSettings },
  ];

  return (
    <Stack p="md">
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant={item.active ? "light" : "subtle"}
          fullWidth
          justify="flex-start"
          leftSection={<item.icon size={20} />}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  );
};

export { SideNavigation };
