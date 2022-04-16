import Stack from "./Stack";
import { TYPES } from "../lib/types";
import { FieldType } from "../types";

interface TypesProps {
  onClickType: (type: FieldType) => void;
}

export default function Types({ onClickType }: TypesProps) {
  return (
    <div className="w-64 bg-stone-800 dark:bg-stone-900 overflow-y-auto rounded-md border dark:border-stone-700/70 p-4 text-white">
      <Stack direction="vertical">
        <h2 className="text-lg">Add a field</h2>

        <Stack direction="vertical">
          {TYPES.map((type) => (
            <button
              key={type.name}
              className="bg-stone-800 rounded p-2.5 text-left border border-stone-700/70 hover:bg-stone-700 transition duration-100 group"
              onClick={() => {
                onClickType(type.name);
              }}
            >
              <Stack align="center">
                <div className="rounded-md bg-stone-500 bg-opacity-30 flex items-center justify-center w-10 h-10">
                  <type.icon className="w-5 text-stone-400 group-hover:text-inherit transition duration-100" />
                </div>
                <Stack direction="vertical" spacing="none">
                  <h4>{type.name}</h4>
                  <p className="text-sm text-stone-400">{type.description}</p>
                </Stack>
              </Stack>
            </button>
          ))}
        </Stack>
      </Stack>
    </div>
  );
}
