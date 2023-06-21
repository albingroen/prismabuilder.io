import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Schema } from "./types";

export const SchemaContext = createContext<{
  schema: Schema;
  schemas: Schema[];
  setSchema: (schema: Schema) => void;
  setSchemas: Dispatch<SetStateAction<any[]>>;
}>({
  schema: {} as Schema,
  schemas: [],
  setSchema: () => undefined,
  setSchemas: () => undefined,
});

export const useSchemaContext = () => {
  return useContext(SchemaContext);
};
