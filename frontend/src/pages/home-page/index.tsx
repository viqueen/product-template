import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  Stack,
  Group,
  Loader,
  Center,
  RingProgress,
  ThemeIcon,
} from "@mantine/core";
import { IconChecklist } from "@tabler/icons-react";
import { AppLayout } from "../../components";
import { TodoSummaryCard, TodoStatusBadge } from "../../components/ui";
import { calculateTodoStats } from "../../utils/todo-helpers";
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
  const { counts, completionRate } = calculateTodoStats(todos);

  const todoStatuses = [
    TodoV1TodoModel.TodoStatus.PENDING,
    TodoV1TodoModel.TodoStatus.IN_PROGRESS,
    TodoV1TodoModel.TodoStatus.COMPLETED,
    TodoV1TodoModel.TodoStatus.CANCELLED,
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
            {todoStatuses.map((status) => {
              const count =
                status === TodoV1TodoModel.TodoStatus.PENDING
                  ? counts.pending
                  : status === TodoV1TodoModel.TodoStatus.IN_PROGRESS
                    ? counts.inProgress
                    : status === TodoV1TodoModel.TodoStatus.COMPLETED
                      ? counts.completed
                      : counts.cancelled;

              return (
                <TodoSummaryCard key={status} status={status} count={count} />
              );
            })}
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
                  sections={[{ value: completionRate, color: "green" }]}
                  label={
                    <Center>
                      <ThemeIcon
                        color="green"
                        variant="light"
                        radius="xl"
                        size="xl"
                      >
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
                        <TodoStatusBadge
                          status={todo.status}
                          size="xs"
                          showIcon={false}
                        />
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
