import { createContext, useContext } from "react";
import { Schema } from "../types";

export const SchemaContext = createContext<{
  schemas: Schema[];
  setSchema: (id: string, schema: Schema) => void;
  setSchemas: (schemas: Schema[]) => void;
}>({
  schemas: [],
  setSchema: () => undefined,
  setSchemas: () => undefined,
});

export const useSchemaContext = () => {
  return useContext(SchemaContext);
};
