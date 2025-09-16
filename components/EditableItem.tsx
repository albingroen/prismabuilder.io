import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { useSchemaContext } from "../lib/context";
import { Model } from "../lib/types";

const EditableItem = ({
  name,
  schemaName,
}: {
  name: string;
  schemaName: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState(name ?? "");
  const { push } = useRouter();
  const { schema, setSchema } = useSchemaContext();

  const handleChangeName = (newName: string) => {
    if (newName.trim() === name.trim()) {
      setIsEditing(false);
      return;
    }
    if (newName && newName !== name) {
      setSchema({
        ...schema,
        models: schema.models.map((m: Model) =>
          m.name === name
            ? {
                ...m,
                name: newName,
              }
            : m,
        ),
      });
      push(`/schemas/${schemaName}/models/${newName}`);
      setIsEditing(false);
    }
  };
  return (
    <div className="w-full max-w-sm">
      {isEditing ? (
        <input
          type="text"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
          onBlur={() => {
            if (updatedName.trim() === "") {
              setUpdatedName(name);
              setIsEditing(false);
              return;
            }
            handleChangeName(updatedName);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleChangeName(updatedName);
            }
          }}
          autoFocus
          className="w-full bg-transparent h-0 focus:outline-none focus:ring-0 border-none"
        />
      ) : (
        <div className="flex items-center justify-between">
          <p className="truncate">{updatedName}</p>
          <div
            role="button"
            aria-label="Edit name"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
          >
            <PencilSquareIcon className="w-4 text-gray-500 dark:text-neutral-500 hover:text-inherit dark:hover:text-inherit transition" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableItem;
