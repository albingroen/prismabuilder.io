import { ReactNode, useEffect, useState } from "react";
import { forage } from "@tauri-apps/tauri-forage";
import { Schema } from "../types";
import { SchemaContext } from "../lib/context";
import { writeFile } from "@tauri-apps/api/fs";
import { getSchemaString } from "../lib/prisma";
import { message } from "@tauri-apps/api/dialog";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  const [schemas, setSchemas] = useState<Schema[]>([]);

  useEffect(() => {
    forage
      .getItem({
        key: "schemas",
      })()
      .then((lcValue) => {
        if (lcValue) {
          setSchemas(JSON.parse(lcValue));
        }
      });
  }, []);

  useEffect(() => {
    if (window) {
      forage.setItem({
        key: "schemas",
        value: JSON.stringify(schemas),
      })();
    }
  }, [schemas]);

  return (
    <SchemaContext.Provider
      value={{
        schemas,
        setSchemas,
        setSchema: (id, newValues) => {
          const schema = schemas.find((s) => s.id === id);

          const newSchema = {
            ...schema,
            ...newValues,
          };

          setSchemas(schemas.map((s) => (s.id === id ? newSchema : s)));

          if (newSchema.path) {
            try {
              getSchemaString(newSchema).then((res) => {
                writeFile({ path: newSchema.path!, contents: res });
              });
            } catch {
              message("Failed to sync schema file");
            }
          }
        },
      }}
    >
      <main className="fade-in">{children}</main>
    </SchemaContext.Provider>
  );
}
