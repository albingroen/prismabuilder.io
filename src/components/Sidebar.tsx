import Input from "./Input";
import Stack from "./Stack";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { PencilIcon, CheckIcon } from "@heroicons/react/solid";
import { ReactNode, useState } from "react";

interface SidebarProps {
  onChangeHeading?: (value: string) => void;
  children: ReactNode;
  backLink?: string;
  heading: string;
}

export default function Sidebar({
  onChangeHeading,
  backLink,
  children,
  heading,
}: SidebarProps) {
  const [editingHeading, setEditingHeading] = useState<boolean>(false);

  return (
    <div className="w-[300px] p-5 bg-white dark:bg-stone-900 border-r dark:border-stone-700/70 overflow-y-auto">
      <Stack
        direction="vertical"
        className="h-full"
        spacing="huge"
        align="start"
      >
        <Stack align="center" className="w-full" spacing="small">
          <Stack align="center" spacing="small">
            {backLink && (
              <Link className="p-0.5 group -ml-1" to={backLink}>
                <ChevronLeftIcon className="w-5 text-stone-400 dark:text-stone-500 group-hover:text-inherit transition duration-100" />
              </Link>
            )}

            {editingHeading && onChangeHeading ? (
              <Input
                placeholder={heading}
                defaultValue={heading}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();

                    onChangeHeading(e.currentTarget.value);
                    setEditingHeading(false);
                  }
                }}
                onBlur={(e) => {
                  onChangeHeading(e.currentTarget.value);
                  setEditingHeading(false);
                }}
              />
            ) : (
              <h1 className="text-xl font-medium">{heading}</h1>
            )}
          </Stack>

          {onChangeHeading && (
            <button
              onClick={() => {
                setEditingHeading(!editingHeading);
              }}
              className="p-0.5 group"
            >
              {editingHeading ? (
                <CheckIcon className="w-4 text-stone-400 dark:text-stone-500 group-hover:text-inherit transition duration-100" />
              ) : (
                <PencilIcon className="w-4 text-stone-400 dark:text-stone-500 group-hover:text-inherit transition duration-100" />
              )}
            </button>
          )}
        </Stack>

        <div className="w-full flex-1">{children}</div>
      </Stack>
    </div>
  );
}
