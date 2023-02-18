import { Enum, Schema } from "./types";

export const isEnumColliding = (
  { enums: existingEnums }: Schema,
  { enums: importedEnums }: Schema
): boolean => {
  return existingEnums.some((model: Enum) =>
    importedEnums.map((m: Enum) => m.name).includes(model.name)
  );
};
