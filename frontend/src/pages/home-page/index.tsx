import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  Badge,
  Stack,
  Group,
  Loader,
  Center,
  RingProgress,
  ThemeIcon,
} from "@mantine/core";
import {
  IconClock,
  IconPlayerPlay,
  IconCheck,
  IconX,
  IconChecklist,
} from "@tabler/icons-react";
import { AppLayout } from "../../components";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import {
  TodoV1TodoModel,
  TodoV1TodoService,
} from "@labset/product-template-api-web-sdk";

const transport = createConnectTransport({
  baseUrl: "http://localhost:8080",
});

const client = createClient(TodoV1TodoService.TodoService, transport);

const HomePage = () => {
  const [todos, setTodos] = useState<TodoV1TodoModel.Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await client.listTodos({
        pageLimit: 100,
        pageOffset: 0,
      });
      setTodos(response.todos);
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Calculate status counts
  const getStatusCounts = () => {
    const counts = {
      total: todos.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    };

    todos.forEach((todo) => {
      switch (todo.status) {
        case TodoV1TodoModel.TodoStatus.PENDING:
          counts.pending++;
          break;
        case TodoV1TodoModel.TodoStatus.IN_PROGRESS:
          counts.inProgress++;
          break;
        case TodoV1TodoModel.TodoStatus.COMPLETED:
          counts.completed++;
          break;
        case TodoV1TodoModel.TodoStatus.CANCELLED:
          counts.cancelled++;
          break;
      }
    });

    return counts;
  };

  const counts = getStatusCounts();
  const completionRate = counts.total > 0 
    ? Math.round((counts.completed / counts.total) * 100) 
    : 0;

  const stats = [
    {
      title: "Pending Tasks",
      value: counts.pending,
      description: "Waiting to start",
      color: "blue",
      icon: IconClock,
    },
    {
      title: "In Progress",
      value: counts.inProgress,
      description: "Currently working on",
      color: "yellow",
      icon: IconPlayerPlay,
    },
    {
      title: "Completed",
      value: counts.completed,
      description: "Successfully finished",
      color: "green",
      icon: IconCheck,
    },
    {
      title: "Cancelled",
      value: counts.cancelled,
      description: "No longer needed",
      color: "red",
      icon: IconX,
    },
  ];

  if (loading) {
    return (
      <AppLayout>
        <Container>
          <Center py="xl">
            <Loader size="lg" />
          </Center>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container>
        <Stack gap="xl">
          <div>
            <Title order={2} mb="xs">
              Welcome back!
            </Title>
            <Text c="dimmed">
              Here's your task overview and current progress.
            </Text>
          </div>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
            {stats.map((stat) => (
              <Card key={stat.title} withBorder p="md" radius="md">
                <Group justify="space-between" mb="xs">
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    {stat.title}
                  </Text>
                  <ThemeIcon color={stat.color} variant="light" size="sm">
                    <stat.icon size={16} />
                  </ThemeIcon>
                </Group>
                <Text fw={700} size="xl">
                  {stat.value}
                </Text>
                <Text size="xs" c="dimmed" mt={7}>
                  {stat.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Card withBorder radius="md" p="xl">
              <Title order={3} mb="md">
                Task Completion Rate
              </Title>
              <Center>
                <RingProgress
                  size={200}
                  thickness={20}
                  sections={[
                    { value: completionRate, color: "green" },
                  ]}
                  label={
                    <Center>
                      <ThemeIcon color="green" variant="light" radius="xl" size="xl">
                        <IconChecklist size={28} />
                      </ThemeIcon>
                    </Center>
                  }
                />
              </Center>
              <Text ta="center" mt="md" size="lg" fw={500}>
                {completionRate}% Complete
              </Text>
              <Text ta="center" size="sm" c="dimmed">
                {counts.completed} of {counts.total} tasks completed
              </Text>
            </Card>

            <Card withBorder radius="md" p="xl">
              <Title order={3} mb="md">
                Task Summary
              </Title>
              <Stack gap="md">
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Total Tasks
                  </Text>
                  <Text size="xl" fw={700}>
                    {counts.total}
                  </Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Active Tasks
                  </Text>
                  <Text size="xl" fw={700} c="blue">
                    {counts.pending + counts.inProgress}
                  </Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Recent Tasks
                  </Text>
                  <Stack gap="xs">
                    {todos.slice(0, 3).map((todo) => (
                      <Group key={todo.id} justify="space-between">
                        <Text size="sm" lineClamp={1} style={{ flex: 1 }}>
                          {todo.description}
                        </Text>
                        <Badge
                          size="xs"
                          color={
                            todo.status === TodoV1TodoModel.TodoStatus.COMPLETED
                              ? "green"
                              : todo.status === TodoV1TodoModel.TodoStatus.IN_PROGRESS
                              ? "yellow"
                              : todo.status === TodoV1TodoModel.TodoStatus.CANCELLED
                              ? "red"
                              : "blue"
                          }
                          variant="light"
                        >
                          {todo.status === TodoV1TodoModel.TodoStatus.PENDING
                            ? "Pending"
                            : todo.status === TodoV1TodoModel.TodoStatus.IN_PROGRESS
                            ? "In Progress"
                            : todo.status === TodoV1TodoModel.TodoStatus.COMPLETED
                            ? "Completed"
                            : "Cancelled"}
                        </Badge>
                      </Group>
                    ))}
                  </Stack>
                </div>
              </Stack>
            </Card>
          </SimpleGrid>
        </Stack>
      </Container>
    </AppLayout>
  );
};

export { HomePage };
