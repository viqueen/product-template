import type { PropsWithChildren } from "react";
import { ConnectApiContext } from "./connect-api-context.ts";
import { createConnectTransport } from "@connectrpc/connect-web";
import { TodoV1TodoService } from "@labset/product-template-api-web-sdk";
import { createClient } from "@connectrpc/connect";

export const ConnectApiProvider = ({ children }: PropsWithChildren) => {
  const transport = createConnectTransport({
    baseUrl: "http://localhost:8080",
  });

  const todo = createClient(TodoV1TodoService.TodoService, transport);

  return (
    <ConnectApiContext.Provider value={{ todo }}>
      {children}
    </ConnectApiContext.Provider>
  );
};
