import Stack from "./Stack";
import { FieldType, Schema } from "../types";
import { TYPES } from "../lib/fields";
import { prismaTypesToIcons } from "../lib/icons";

interface TypesProps {
  onClickType: (type: FieldType) => void;
  schema: Schema;
}

export default function Types({ schema, onClickType }: TypesProps) {
  return (
    <div className="w-64 bg-stone-800 dark:bg-stone-900 overflow-y-auto rounded-md border dark:border-stone-700/70 p-4 text-white">
      <Stack direction="vertical">
        <h2 className="text-lg">Add a field</h2>

        <Stack direction="vertical">
          {[
            ...TYPES(schema.database).map((t) => ({
              ...t,
              type: "type",
            })),
            ...schema.models.map((m) => ({
              ...m,
              description: "",
              type: "model",
            })),
            ...schema.enums.map((e) => ({
              ...e,
              description: "",
              type: "enum",
            })),
          ].map((type) => {
            const Icon =
              type.type === "enum"
                ? prismaTypesToIcons.Enum
                : type.type === "model"
                ? prismaTypesToIcons.Model
                : prismaTypesToIcons[type.name] ?? prismaTypesToIcons.default;

            return (
              <Type
                key={type.name}
                onClick={() => {
                  onClickType(type.name as FieldType);
                }}
                description={type.description}
                name={type.name}
                Icon={Icon}
              />
            );
          })}
        </Stack>
      </Stack>
    </div>
  );
}

interface TypeProps {
  onClick: () => void;
  description: string;
  name: string;
  Icon: any;
}

function Type({ name, description, Icon, onClick }: TypeProps) {
  return (
    <button
      className="bg-stone-800 rounded p-2.5 text-left border border-stone-700/70 hover:bg-stone-700 transition duration-100 group"
      onClick={onClick}
    >
      <Stack align="center">
        <div className="rounded-md bg-stone-500 bg-opacity-30 flex items-center justify-center w-10 h-10">
          <Icon className="w-5 text-stone-400 group-hover:text-inherit transition duration-100" />
        </div>
        <Stack direction="vertical" spacing="none">
          <h4>{name}</h4>
          <p className="text-sm text-stone-400">{description}</p>
        </Stack>
      </Stack>
    </button>
  );
}
