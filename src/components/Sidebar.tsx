import { ChevronLeftIcon } from "@heroicons/react/outline";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Stack from "./Stack";

interface SidebarProps {
  children: ReactNode;
  backLink?: string;
  heading: string;
}

export default function Sidebar({ heading, backLink, children }: SidebarProps) {
  return (
    <div className="w-[300px] p-5 bg-white dark:bg-stone-900 border-r dark:border-stone-700/70 overflow-y-auto">
      <Stack
        direction="vertical"
        className="h-full"
        spacing="huge"
        align="start"
      >
        <Stack align="center" spacing="small">
          {backLink && (
            <Link className="p-0.5 group -ml-1" to={backLink}>
              <ChevronLeftIcon className="w-5 text-stone-400 dark:text-stone-500 group-hover:text-inherit transition duration-100" />
            </Link>
          )}
          <h1 className="text-xl font-medium">{heading}</h1>
        </Stack>

        <div className="w-full flex-1">{children}</div>
      </Stack>
    </div>
  );
}
