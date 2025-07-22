import type { PropsWithChildren } from "react";
import { TopNavigation } from "./top-navigation";
import { SideNavigation } from "./side-navigation";

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <TopNavigation />
      <SideNavigation />
      <div>{children}</div>
    </div>
  );
};

export { AppLayout };
