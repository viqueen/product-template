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
    { label: "Dashboard", icon: IconHome, path: "/home" },
    { label: "Tasks", icon: IconChecklist, path: "/tasks" },
  ];

  return (
    <Stack p="md" align={opened ? "stretch" : "center"}>
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
                size="lg"
                onClick={() => navigate(item.path)}
                aria-label={item.label}
              >
                <item.icon size={20} />
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
            justify="flex-start"
            leftSection={<item.icon size={20} />}
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
