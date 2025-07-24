import { useContext } from "react";
import { ConnectApiContext } from "./connect-api-context.ts";

export const useConnectApi = () => {
  const context = useContext(ConnectApiContext);
  if (!context) {
    throw new Error("useConnectApi must be used within a ConnectApiProvider");
  }
  return context;
};
