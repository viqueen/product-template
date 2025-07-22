import { Burger, Group, Title, Button, Avatar } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "../../theme-toggle";

interface TopNavigationProps {
  opened: boolean;
  toggle: () => void;
}

const TopNavigation = ({ opened, toggle }: TopNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/home":
        return "Dashboard";
      case "/tasks":
        return "Tasks";
      default:
        return "Dashboard";
    }
  };

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Title order={3}>{getPageTitle()}</Title>
      </Group>
      <Group>
        <ThemeToggle />
        <Avatar color="blue" radius="xl">
          JD
        </Avatar>
        <Button variant="subtle" onClick={handleLogout}>
          Logout
        </Button>
      </Group>
    </Group>
  );
};

export { TopNavigation };
