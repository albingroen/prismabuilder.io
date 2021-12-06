import { createContext, useContext } from "react";
import { Schema } from "./types";

export const SchemaContext = createContext<{
  schema: Schema;
  schemas: Schema[];
  setSchema: (schema: Schema) => void;
  setSchemas: (schemas: Schema[]) => void;
}>({
  schema: {} as Schema,
  schemas: [],
  setSchema: () => undefined,
  setSchemas: () => undefined,
});

export const useSchemaContext = () => {
  return useContext(SchemaContext);
};
