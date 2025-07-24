import { TodoV1TodoModel } from "@labset/product-template-api-web-sdk";

export const getTodoStatusColor = (
  status: TodoV1TodoModel.TodoStatus,
): string => {
  switch (status) {
    case TodoV1TodoModel.TodoStatus.PENDING:
      return "blue";
    case TodoV1TodoModel.TodoStatus.IN_PROGRESS:
      return "yellow";
    case TodoV1TodoModel.TodoStatus.COMPLETED:
      return "green";
    case TodoV1TodoModel.TodoStatus.CANCELLED:
      return "red";
    default:
      return "gray";
  }
};

export const getTodoStatusLabel = (
  status: TodoV1TodoModel.TodoStatus,
): string => {
  switch (status) {
    case TodoV1TodoModel.TodoStatus.PENDING:
      return "Pending";
    case TodoV1TodoModel.TodoStatus.IN_PROGRESS:
      return "In Progress";
    case TodoV1TodoModel.TodoStatus.COMPLETED:
      return "Completed";
    case TodoV1TodoModel.TodoStatus.CANCELLED:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

export const calculateTodoStats = (todos: TodoV1TodoModel.Todo[]) => {
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

  const completionRate =
    counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;

  const activeCount = counts.pending + counts.inProgress;

  return {
    counts,
    completionRate,
    activeCount,
  };
};
