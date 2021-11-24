import { createContext, useContext } from "react";

export const SchemaContext = createContext<{
  schema: any;
  setSchema: (schema: any) => void;
}>({ schema: {}, setSchema: () => undefined });

export const useSchemaContext = () => {
  return useContext(SchemaContext);
};
