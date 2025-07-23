import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconPlus,
} from "@tabler/icons-react";
import { AppLayout } from "../../components";
import { TodoStatusBadge } from "../../components/ui";
import { getTodoStatusLabel } from "../../utils/todo-helpers";
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

const TasksPage = () => {
  const [todos, setTodos] = useState<TodoV1TodoModel.Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [addingTodo, setAddingTodo] = useState(false);

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
  const handleUpdateStatus = async (
    todoId: string,
    newStatus: TodoV1TodoModel.TodoStatus,
  ) => {
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
                <Text c="dimmed">
                  No tasks yet. Create your first task above!
                </Text>
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
                          todo.status === TodoV1TodoModel.TodoStatus.COMPLETED
                            ? "line-through"
                            : undefined
                        }
                        c={
                          todo.status === TodoV1TodoModel.TodoStatus.COMPLETED
                            ? "dimmed"
                            : undefined
                        }
                      >
                        {todo.description}
                      </Text>
                    </div>
                    <Group gap="xs">
                      <TodoStatusBadge status={todo.status} />
                      <Select
                        size="xs"
                        value={todo.status.toString()}
                        onChange={(value) =>
                          handleUpdateStatus(
                            todo.id,
                            parseInt(value!) as TodoV1TodoModel.TodoStatus,
                          )
                        }
                        data={[
                          {
                            value: TodoV1TodoModel.TodoStatus.PENDING.toString(),
                            label: getTodoStatusLabel(TodoV1TodoModel.TodoStatus.PENDING),
                          },
                          {
                            value: TodoV1TodoModel.TodoStatus.IN_PROGRESS.toString(),
                            label: getTodoStatusLabel(TodoV1TodoModel.TodoStatus.IN_PROGRESS),
                          },
                          {
                            value: TodoV1TodoModel.TodoStatus.COMPLETED.toString(),
                            label: getTodoStatusLabel(TodoV1TodoModel.TodoStatus.COMPLETED),
                          },
                          {
                            value: TodoV1TodoModel.TodoStatus.CANCELLED.toString(),
                            label: getTodoStatusLabel(TodoV1TodoModel.TodoStatus.CANCELLED),
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
