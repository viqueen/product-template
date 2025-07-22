import type { PropsWithChildren } from "react";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TopNavigation } from "./top-navigation";
import { SideNavigation } from "./side-navigation";

const AppLayout = ({ children }: PropsWithChildren) => {
  const [opened, { toggle }] = useDisclosure(true); // Default to open

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: opened ? 300 : 80,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <TopNavigation opened={opened} toggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar>
        <SideNavigation opened={opened} />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export { AppLayout };
