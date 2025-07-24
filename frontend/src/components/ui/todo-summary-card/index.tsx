import { Card, Text, Group, ThemeIcon } from "@mantine/core";
import type { CardProps } from "@mantine/core";
import {
  IconClock,
  IconPlayerPlay,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { TodoV1TodoModel } from "@labset/product-template-api-web-sdk";
import {
  getTodoStatusColor,
  getTodoStatusLabel,
} from "../../../utils/todo-helpers";

interface TodoSummaryCardProps extends CardProps {
  status: TodoV1TodoModel.TodoStatus;
  count: number;
  description?: string;
}

const getStatusIcon = (status: TodoV1TodoModel.TodoStatus) => {
  switch (status) {
    case TodoV1TodoModel.TodoStatus.PENDING:
      return IconClock;
    case TodoV1TodoModel.TodoStatus.IN_PROGRESS:
      return IconPlayerPlay;
    case TodoV1TodoModel.TodoStatus.COMPLETED:
      return IconCheck;
    case TodoV1TodoModel.TodoStatus.CANCELLED:
      return IconX;
    default:
      return IconClock;
  }
};

const getStatusDescription = (status: TodoV1TodoModel.TodoStatus): string => {
  switch (status) {
    case TodoV1TodoModel.TodoStatus.PENDING:
      return "Waiting to start";
    case TodoV1TodoModel.TodoStatus.IN_PROGRESS:
      return "Currently working on";
    case TodoV1TodoModel.TodoStatus.COMPLETED:
      return "Successfully finished";
    case TodoV1TodoModel.TodoStatus.CANCELLED:
      return "No longer needed";
    default:
      return "";
  }
};

export const TodoSummaryCard = ({
  status,
  count,
  description,
  ...cardProps
}: TodoSummaryCardProps) => {
  const Icon = getStatusIcon(status);
  const color = getTodoStatusColor(status);
  const title = `${getTodoStatusLabel(status)} Tasks`;
  const defaultDescription = description || getStatusDescription(status);

  return (
    <Card withBorder p="md" radius="md" {...cardProps}>
      <Group justify="space-between" mb="xs">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed">
          {title}
        </Text>
        <ThemeIcon color={color} variant="light" size="sm">
          <Icon size={16} />
        </ThemeIcon>
      </Group>
      <Text fw={700} size="xl">
        {count}
      </Text>
      <Text size="xs" c="dimmed" mt={7}>
        {defaultDescription}
      </Text>
    </Card>
  );
};
