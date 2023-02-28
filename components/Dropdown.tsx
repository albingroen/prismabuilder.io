import React, { ReactNode } from "react";
import {
  Root,
  Trigger,
  Item,
  Sub,
  SubTrigger,
  Portal,
  SubContent,
  Content,
} from "@radix-ui/react-dropdown-menu";
import { HeroIcon } from "../lib/types";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import classNames from "../lib/classNames";

type DropdownItem = {
  onClick?: () => void;
  disabled?: boolean;
  extra?: string;
  icon?: HeroIcon;
  href?: string;
  label: string;
};

type DropdownItems = DropdownItem | DropdownItemsGroup;

type DropdownItemsGroup = {
  label: string;
  icon?: HeroIcon;
  items: DropdownItems[];
  disabled?: boolean;
};

type RenderLink = (href: string, item: ReactNode) => ReactNode;

export type DropdownProps = {
  renderLink?: RenderLink;
  children: ReactNode;
  items: DropdownItems[];
  dropdownClassName?: string;
  align?: "start" | "end" | "center";
};

const itemStyles = (disabled?: boolean, isSubMenuTrigger?: boolean) =>
  classNames(
    "group py-2 px-2.5 rounded-md flex items-center justify-between gap-2 text-left w-full text-sm disabled:opacity-50 transition duration-75 dropdown-menu-item",
    isSubMenuTrigger && "cursor-default dropdown-menu-subtrigger",
    disabled && "opacity-40 cursor-default"
  );

const contentStyles =
  "fade-in bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-1.5 border dark:border-neutral-800 min-w-[256px] font-[Inter]";

const iconStyles = "w-4 icon opacity-50 transition-opacity duration-75";

const Dropdown = ({
  dropdownClassName,
  renderLink,
  children,
  align,
  items,
}: DropdownProps) => {
  return (
    <Root>
      <Trigger asChild>{children}</Trigger>

      <Portal>
        <Content
          sideOffset={10}
          align={align}
          className={classNames(contentStyles, dropdownClassName)}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          {renderItems(items, dropdownClassName, renderLink)}
        </Content>
      </Portal>
    </Root>
  );
};

function renderItemContent(item: DropdownItem, isSubMenuTrigger?: boolean) {
  return (
    <>
      <div className="flex items-center gap-2">
        {item.icon && (
          <i>
            <item.icon className={iconStyles} />
          </i>
        )}

        <span>{item.label}</span>
      </div>

      {isSubMenuTrigger ? (
        <ChevronRightIcon className="w-3.5" />
      ) : item.extra ? (
        <p className="text-sm opacity-50 extra transition-opacity duration-75">
          {item.extra}
        </p>
      ) : null}
    </>
  );
}

function renderItem(
  item: DropdownItem,
  isSubMenuTrigger?: boolean,
  renderLink?: RenderLink
) {
  if (item.href) {
    if (renderLink) {
      return renderLink(item.href, renderItemContent(item));
    }

    return (
      <a
        href={item.href}
        className={itemStyles(item.disabled)}
        onClick={item.onClick}
      >
        {renderItemContent(item)}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={itemStyles(item.disabled, isSubMenuTrigger)}
      onClick={item.onClick}
    >
      {renderItemContent(item, isSubMenuTrigger)}
    </button>
  );
}

function renderItems(
  subItems: DropdownItems[] | DropdownItems,
  dropdownClassName?: string,
  renderLink?: RenderLink
): ReactNode {
  const isArray = Array.isArray(subItems);

  if (isArray) {
    return subItems.map((item) => renderItems(item));
  }

  if ("items" in subItems) {
    return (
      <Sub>
        <SubTrigger asChild disabled={subItems.disabled}>
          {renderItem(subItems, true, renderLink)}
        </SubTrigger>

        <SubContent className={classNames(contentStyles, dropdownClassName)}>
          {renderItems(subItems.items)}
        </SubContent>
      </Sub>
    );
  }

  return (
    <Item asChild key={subItems.label} disabled={subItems.disabled}>
      {renderItem(subItems, false, renderLink)}
    </Item>
  );
}

export default Dropdown;
