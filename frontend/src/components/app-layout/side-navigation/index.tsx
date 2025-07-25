import { Stack, Button, ActionIcon, Tooltip } from "@mantine/core";
import { IconHome, IconChecklist } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SideNavigationProps {
  opened: boolean;
}

const SideNavigation = ({ opened }: SideNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: IconHome, path: "/" },
    { label: "Tasks", icon: IconChecklist, path: "/tasks" },
  ];

  return (
    <Stack p="xs" gap="xs" align={opened ? "stretch" : "center"}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        if (!opened) {
          // Show only icon when collapsed
          return (
            <Tooltip
              key={item.label}
              label={item.label}
              position="right"
              withArrow
            >
              <ActionIcon
                variant={isActive ? "light" : "subtle"}
                size="md"
                onClick={() => navigate(item.path)}
                aria-label={item.label}
              >
                <item.icon size={18} />
              </ActionIcon>
            </Tooltip>
          );
        }

        // Show full button when expanded
        return (
          <Button
            key={item.label}
            variant={isActive ? "light" : "subtle"}
            fullWidth
            size="sm"
            justify="flex-start"
            leftSection={<item.icon size={18} />}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );
};

export { SideNavigation };
