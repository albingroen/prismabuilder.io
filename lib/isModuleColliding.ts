import { Model, Schema } from "./types";

export const isModuleColliding = (
  { models: existingModels }: Schema,
  { models: importedModels }: Schema
): boolean => {
  return existingModels.some((model: Model) =>
    importedModels.map((m: Model) => m.name).includes(model.name)
  );
};
