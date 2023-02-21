import Links from "./Links";
import Stack from "./Stack";
import { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
  withLinks?: boolean;
  extra?: ReactNode;
}

export default function Sidebar({
  withLinks = true,
  children,
  extra,
}: SidebarProps) {
  return (
    <aside className="flex flex-col w-full max-w-[300px] h-screen bg-white dark:bg-neutral-900 border-r dark:border-neutral-700/60">
      <div className="flex-1 w-full overflow-y-auto">{children}</div>

      <Stack direction="vertical" spacing="small" className="w-full p-5">
        {extra}

        {withLinks && <Links />}
      </Stack>
    </aside>
  );
}
