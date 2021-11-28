import { createContext, useContext } from "react";

export const SchemaContext = createContext<{
  schema: any;
  schemas: any[];
  setSchema: (schema: any) => void;
  setSchemas: (schemas: any[]) => void;
}>({
  schema: {},
  schemas: [],
  setSchema: () => undefined,
  setSchemas: () => undefined,
});

export const useSchemaContext = () => {
  return useContext(SchemaContext);
};
