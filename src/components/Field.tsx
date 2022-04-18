import Stack from "./Stack";
import Tag from "./Tag";
import classNames from "../lib/classNames";
import { CubeIcon } from "@heroicons/react/solid";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { Field } from "../types";
import { MenuIcon, TrashIcon } from "@heroicons/react/outline";
import { prismaTypesToIcons } from "../lib/icons";

interface FieldProps {
  dragHandleProps?: DraggableProvidedDragHandleProps;
  onDelete: (id: string) => void;
  onClick?: () => void;
  field: Field;
}

export default function FieldComponent({
  dragHandleProps,
  onDelete,
  onClick,
  field,
}: FieldProps) {
  const Icon = prismaTypesToIcons[field.type] ?? CubeIcon;

  return (
    <div
      className={classNames(
        "cursor-pointer rounded-md transform bg-white shadow shadow-stone-300/30 hover:shadow-md active:shadow-md dark:shadow-stone-900 dark:bg-stone-700 border dark:border-stone-600 p-3 pr-4 text-left transition duration-100"
      )}
      onClick={onClick}
      role="button"
    >
      <Stack align="center" justify="between">
        <Stack align="center">
          {dragHandleProps && (
            <div {...dragHandleProps}>
              <MenuIcon className="w-4 text-stone-300 dark:text-stone-500 hover:text-inherit py-6 active:text-inherit transition duration-100" />
            </div>
          )}

          <div className="h-14 w-14 rounded-md bg-emerald-200 dark:bg-emerald-900 bg-opacity-40 dark:bg-opacity-50 flex items-center justify-center">
            <Icon className="w-7 text-emerald-400 dark:text-emerald-300" />
          </div>

          <Stack direction="vertical" spacing="small">
            <h3 className="text-lg leading-none">{field.name}</h3>

            <Stack align="center" spacing="small" className="!mt-px">
              <Tag>
                {field.list && "["}
                {field.type}
                {field.list && "]"}
              </Tag>
              {field.required && <Tag>Required</Tag>}
              {field.unique && <Tag>Unique</Tag>}
              {field.isId && <Tag>ID</Tag>}
              {field.default && <Tag>{field.default}</Tag>}
              {field.isUpdatedAt && <Tag>updatedAt</Tag>}
            </Stack>
          </Stack>
        </Stack>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            onDelete(field.id);
          }}
          aria-label="Delete field"
        >
          <TrashIcon className="w-5 text-red-400 hover:text-red-600 dark:text-red-600 dark:hover:text-red-800 transition" />
        </button>
      </Stack>
    </div>
  );
}
