import Link from "next/link";
import { HeroIcon } from "../lib/types";
import { ReactNode } from "react";
import { classNames } from "react-cmdk";

interface SidebarItemProps {
  children: ReactNode;
  onClick?: () => void;
  isDragging?: boolean;
  isActive?: boolean;
  target?: string;
  icon: HeroIcon;
  href?: string;
  rel?: string;
}

export default function SidebarItem({
  isDragging,
  icon: Icon,
  children,
  isActive,
  onClick,
  href = "",
  ...rest
}: SidebarItemProps) {
  return (
    <Link
      {...rest}
      href={href}
      className={classNames(
        "select-none px-2 py-1.5 -mx-2 rounded-md flex items-center gap-2.5 group",
        isDragging
          ? "bg-gray-100 dark:bg-neutral-800"
          : classNames(
              "hover:bg-gray-100",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-black focus-visible:bg-gray-100",
              "dark:hover:bg-neutral-800 dark:focus-visible:ring-white dark:focus-visible:bg-neutral-800",
            ),
      )}
      onClick={
        onClick
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
    >
      <Icon
        className={classNames(
          "w-[18px] transition text-gray-500 group-hover:text-inherit group-focus-visible:text-inherit",
          "dark:text-neutral-500",
        )}
      />
      <p className="flex-1 truncate">{children}</p>
    </Link>
  );
}
