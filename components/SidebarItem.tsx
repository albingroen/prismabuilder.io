import Link from "next/link";
import { HeroIcon } from "../lib/types";
import { ReactNode } from "react";
import { classNames } from "react-cmdk";

interface SidebarItemProps {
  children: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  target?: string;
  icon: HeroIcon;
  href?: string;
  rel?: string;
}

export default function SidebarItem({
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
        "hover:bg-gray-100 px-2 py-1.5 -mx-2 rounded-md flex items-center gap-2.5 group w-full",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-black focus:bg-gray-100"
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
      <Icon className="w-[18px] transition text-gray-500 group-hover:text-inherit" />
      <p className="flex-1 truncate">{children}</p>
    </Link>
  );
}
