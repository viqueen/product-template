import { Badge } from "@mantine/core";
import type { BadgeProps, MantineSize } from "@mantine/core";
import {
  IconClock,
  IconPlayerPlay,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { TodoV1TodoModel } from "@labset/product-template-api-web-sdk";

interface TodoStatusBadgeProps extends Omit<BadgeProps, "color"> {
  status: TodoV1TodoModel.TodoStatus;
  showIcon?: boolean;
  iconSize?: number;
  size?: MantineSize;
}

export const TodoStatusBadge = ({
  status,
  showIcon = true,
  iconSize = 16,
  size = "sm",
  ...badgeProps
}: TodoStatusBadgeProps) => {
  const getStatusConfig = (status: TodoV1TodoModel.TodoStatus) => {
    switch (status) {
      case TodoV1TodoModel.TodoStatus.PENDING:
        return {
          color: "blue",
          label: "Pending",
          icon: <IconClock size={iconSize} />,
        };
      case TodoV1TodoModel.TodoStatus.IN_PROGRESS:
        return {
          color: "yellow",
          label: "In Progress",
          icon: <IconPlayerPlay size={iconSize} />,
        };
      case TodoV1TodoModel.TodoStatus.COMPLETED:
        return {
          color: "green",
          label: "Completed",
          icon: <IconCheck size={iconSize} />,
        };
      case TodoV1TodoModel.TodoStatus.CANCELLED:
        return {
          color: "red",
          label: "Cancelled",
          icon: <IconX size={iconSize} />,
        };
      default:
        return {
          color: "gray",
          label: "Unknown",
          icon: null,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      color={config.color}
      variant="light"
      size={size}
      leftSection={showIcon ? config.icon : undefined}
      {...badgeProps}
    >
      {config.label}
    </Badge>
  );
};