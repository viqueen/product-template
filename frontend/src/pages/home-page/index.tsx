import {
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  Badge,
  Stack,
  Group,
} from "@mantine/core";
import { AppLayout } from "../../components";

const HomePage = () => {
  const stats = [
    { title: "Total Projects", value: "24", description: "Active projects" },
    { title: "Tasks Completed", value: "89", description: "This month" },
    { title: "Team Members", value: "12", description: "Collaborators" },
    { title: "Success Rate", value: "95%", description: "Project delivery" },
  ];

  return (
    <AppLayout>
      <Container>
        <Stack gap="xl">
          <div>
            <Title order={2} mb="xs">
              Welcome back!
            </Title>
            <Text c="dimmed">
              Here's what's happening with your projects today.
            </Text>
          </div>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
            {stats.map((stat) => (
              <Card key={stat.title} withBorder p="md" radius="md">
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  {stat.title}
                </Text>
                <Text fw={700} size="xl" mt="xs">
                  {stat.value}
                </Text>
                <Text size="xs" c="dimmed" mt={7}>
                  {stat.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>

          <Card withBorder radius="md" p="xl">
            <Title order={3} mb="md">
              Recent Activity
            </Title>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm">New project "Website Redesign" created</Text>
                <Badge color="blue" variant="light">
                  2 hours ago
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Task "Update homepage" completed</Text>
                <Badge color="green" variant="light">
                  5 hours ago
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">New team member John joined</Text>
                <Badge color="grape" variant="light">
                  1 day ago
                </Badge>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </AppLayout>
  );
};

export { HomePage };
