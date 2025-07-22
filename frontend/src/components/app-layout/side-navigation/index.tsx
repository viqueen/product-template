import { Stack, Button } from "@mantine/core";
import { IconHome, IconChecklist } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";

const SideNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: IconHome, path: "/home" },
    { label: "Tasks", icon: IconChecklist, path: "/tasks" },
  ];

  return (
    <Stack p="md">
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant={location.pathname === item.path ? "light" : "subtle"}
          fullWidth
          justify="flex-start"
          leftSection={<item.icon size={20} />}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  );
};

export { SideNavigation };
