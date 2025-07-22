import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Badge,
  Button,
  TextInput,
  Select,
  ActionIcon,
  Loader,
  Center,
  Alert,
} from "@mantine/core";
import {
  IconPlus,
  IconCheck,
  IconClock,
  IconX,
  IconAlertCircle,
} from "@tabler/icons-react";
import { AppLayout } from "../../components";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createPromiseClient } from "@connectrpc/connect";
import { TodoService } from "@labset/product-template-web-sdk/todo/v1/todo_connect";
import { TodoStatus } from "@labset/product-template-web-sdk/todo/v1/todo_model_pb";

const transport = createConnectTransport({
  baseUrl: "http://localhost:8080",
});

const client = createPromiseClient(TodoService, transport);

const TasksPage = () => {
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [addingTodo, setAddingTodo] = useState(false);

  // Status badge colors
  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.TODO_STATUS_PENDING:
        return "blue";
      case TodoStatus.TODO_STATUS_IN_PROGRESS:
        return "yellow";
      case TodoStatus.TODO_STATUS_COMPLETED:
        return "green";
      case TodoStatus.TODO_STATUS_CANCELLED:
        return "red";
      default:
        return "gray";
    }
  };

  // Status icons
  const getStatusIcon = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.TODO_STATUS_PENDING:
        return <IconClock size={16} />;
      case TodoStatus.TODO_STATUS_IN_PROGRESS:
        return <IconClock size={16} />;
      case TodoStatus.TODO_STATUS_COMPLETED:
        return <IconCheck size={16} />;
      case TodoStatus.TODO_STATUS_CANCELLED:
        return <IconX size={16} />;
      default:
        return null;
    }
  };

  // Status display text
  const getStatusText = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.TODO_STATUS_PENDING:
        return "Pending";
      case TodoStatus.TODO_STATUS_IN_PROGRESS:
        return "In Progress";
      case TodoStatus.TODO_STATUS_COMPLETED:
        return "Completed";
      case TodoStatus.TODO_STATUS_CANCELLED:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  // Fetch todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.listTodos({
        pageLimit: 50,
        pageOffset: 0,
      });
      setTodos(response.todos);
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const handleCreateTodo = async () => {
    if (!newTodoDescription.trim()) return;

    try {
      setAddingTodo(true);
      await client.createTodo({
        description: newTodoDescription,
      });
      setNewTodoDescription("");
      await fetchTodos();
    } catch (err) {
      setError("Failed to create task");
      console.error("Error creating todo:", err);
    } finally {
      setAddingTodo(false);
    }
  };

  // Update todo status
  const handleUpdateStatus = async (todoId: string, newStatus: TodoStatus) => {
    try {
      await client.updateTodo({
        id: todoId,
        todo: {
          id: todoId,
          status: newStatus,
          description: "", // Will be ignored due to field mask
        },
        updateMask: {
          paths: ["status"],
        },
      });
      await fetchTodos();
    } catch (err) {
      setError("Failed to update task status");
      console.error("Error updating todo:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <AppLayout>
      <Container>
        <Stack gap="xl">
          <div>
            <Title order={2} mb="xs">
              Tasks
            </Title>
            <Text c="dimmed">Manage your tasks and track their progress</Text>
          </div>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {error}
            </Alert>
          )}

          {/* Add new todo */}
          <Card withBorder radius="md" p="md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateTodo();
              }}
            >
              <Group>
                <TextInput
                  placeholder="Add a new task..."
                  value={newTodoDescription}
                  onChange={(e) => setNewTodoDescription(e.target.value)}
                  style={{ flex: 1 }}
                  disabled={addingTodo}
                />
                <Button
                  type="submit"
                  leftSection={<IconPlus size={16} />}
                  loading={addingTodo}
                  disabled={!newTodoDescription.trim()}
                >
                  Add Task
                </Button>
              </Group>
            </form>
          </Card>

          {/* Todo list */}
          {loading ? (
            <Center py="xl">
              <Loader />
            </Center>
          ) : todos.length === 0 ? (
            <Card withBorder radius="md" p="xl">
              <Center>
                <Text c="dimmed">No tasks yet. Create your first task above!</Text>
              </Center>
            </Card>
          ) : (
            <Stack gap="sm">
              {todos.map((todo) => (
                <Card key={todo.id} withBorder radius="md" p="md">
                  <Group justify="space-between" align="center">
                    <div style={{ flex: 1 }}>
                      <Text
                        size="sm"
                        td={
                          todo.status === TodoStatus.TODO_STATUS_COMPLETED
                            ? "line-through"
                            : undefined
                        }
                        c={
                          todo.status === TodoStatus.TODO_STATUS_COMPLETED
                            ? "dimmed"
                            : undefined
                        }
                      >
                        {todo.description}
                      </Text>
                    </div>
                    <Group gap="xs">
                      <Badge
                        leftSection={getStatusIcon(todo.status)}
                        color={getStatusColor(todo.status)}
                        variant="light"
                      >
                        {getStatusText(todo.status)}
                      </Badge>
                      <Select
                        size="xs"
                        value={todo.status.toString()}
                        onChange={(value) =>
                          handleUpdateStatus(todo.id, parseInt(value!) as TodoStatus)
                        }
                        data={[
                          { value: TodoStatus.TODO_STATUS_PENDING.toString(), label: "Pending" },
                          {
                            value: TodoStatus.TODO_STATUS_IN_PROGRESS.toString(),
                            label: "In Progress",
                          },
                          {
                            value: TodoStatus.TODO_STATUS_COMPLETED.toString(),
                            label: "Completed",
                          },
                          {
                            value: TodoStatus.TODO_STATUS_CANCELLED.toString(),
                            label: "Cancelled",
                          },
                        ]}
                        style={{ width: 130 }}
                      />
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </AppLayout>
  );
};

export { TasksPage };
