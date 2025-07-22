import { Burger, Group, Title, Button, Avatar } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../../theme-toggle";

interface TopNavigationProps {
  opened: boolean;
  toggle: () => void;
}

const TopNavigation = ({ opened, toggle }: TopNavigationProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
        <Title order={3}>Dashboard</Title>
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
