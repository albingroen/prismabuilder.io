import { createContext, useContext } from "react";
import { Schema } from "./types";

export const SchemaContext = createContext<{
  schema: Schema;
  schemas: Schema[];
  setSchema: (schema: any) => void;
  setSchemas: (schemas: any[]) => void;
}>({
  schema: {} as Schema,
  schemas: [],
  setSchema: () => undefined,
  setSchemas: () => undefined,
});

export const useSchemaContext = () => {
  return useContext(SchemaContext);
};
