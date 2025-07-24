import type { Client } from "@connectrpc/connect";
import type { TodoV1TodoService } from "@labset/product-template-api-web-sdk";
import { createContext } from "react";

export interface ConnectApi {
  todo: Client<typeof TodoV1TodoService.TodoService>;
}

export const ConnectApiContext = createContext<ConnectApi | undefined>(
  undefined,
);
