import { ReactNode, useEffect, useState } from "react";
import { forage } from "@tauri-apps/tauri-forage";
import { Schema } from "../types";
import { SchemaContext } from "../lib/context";

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
          setSchemas(
            schemas.map((s) =>
              s.id === id
                ? {
                    ...s,
                    ...newValues,
                  }
                : s
            )
          );
        },
      }}
    >
      <main className="fade-in">{children}</main>
    </SchemaContext.Provider>
  );
}
