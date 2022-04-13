import { ArrowSmLeftIcon } from "@heroicons/react/outline";
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
    <div className="w-[300px] p-5 bg-stone-100 dark:bg-stone-900 border-r dark:border-stone-700/70 overflow-y-auto">
      <Stack
        direction="vertical"
        className="h-full"
        spacing="huge"
        align="start"
      >
        <Stack align="center" spacing="small">
          {backLink && (
            <Link
              className="px-1 py-1 rounded-md hover:bg-stone-200 transition duration-100 group border border-transparent hover:border-stone-300 -ml-1"
              to={backLink}
            >
              <ArrowSmLeftIcon className="w-5 text-stone-500 group-hover:text-stone-900 transition duration-100" />
            </Link>
          )}
          <h1 className="text-xl font-medium">{heading}</h1>
        </Stack>

        <div className="w-full flex-1">{children}</div>
      </Stack>
    </div>
  );
}
