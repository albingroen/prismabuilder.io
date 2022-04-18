import Button from "./components/Button";
import Label from "./components/Label";
import Page from "./components/Page";
import Sidebar from "./components/Sidebar";
import Stack from "./components/Stack";
import axios from "axios";
import { API_URL } from "./lib/config";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, ViewGridIcon } from "@heroicons/react/solid";
import { Model, Schema, Enum } from "./types";
import { message, open } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";
import { useSchemaContext } from "./lib/context";
import { v4 as uuid } from "uuid";

export default function App() {
  const { schemas, setSchemas } = useSchemaContext();
  const navigate = useNavigate();

  async function handleImportSchema(schemaPath: string) {
    const schemaString = await readTextFile(schemaPath);

    try {
      const schema = await axios
        .post(`${API_URL}/parse`, {
          schema: schemaString,
        })
        .then((res) => res.data);

      if (schema) {
        setSchemas([
          ...schemas,
          {
            name: "Imported schema",
            path: schemaPath,
            id: uuid(),
            ...schema,
            models: schema.models.map((m: Model) => ({
              ...m,
              fields: m.fields.map((f) => ({ ...f, id: uuid() })),
              id: uuid(),
            })),
            enums: schema.enums.map((e: Enum) => ({ ...e, id: uuid() })),
          },
        ]);
      }
    } catch {
      message("Failed to import schema");
    }
  }

  return (
    <Page>
      <Sidebar heading="Prisma Schema Builder">
        <Stack
          direction="vertical"
          className="h-full"
          justify="between"
          spacing="large"
          align="start"
        >
          <Stack direction="vertical" spacing="mini" className="w-full">
            <Stack align="center" justify="between">
              <Label>Schemas</Label>
              <button
                className="rounded border border-transparent hover:bg-stone-100 hover:border-stone-200 p-1.5 transition duration-100 text-stone-400 hover:text-inherit"
                title="Add schema"
                onClick={() => {
                  const newSchema: Schema = {
                    database: "postgresql",
                    name: "New schema",
                    id: uuid(),
                    models: [],
                    enums: [],
                  };

                  setSchemas([...schemas, newSchema]);
                  navigate(`/schemas/${newSchema.id}`);
                }}
              >
                <PlusIcon className="w-4" />
              </button>
            </Stack>

            {schemas.length ? (
              <ul className="w-full">
                {schemas.map((schema) => (
                  <li key={schema.id}>
                    <Link
                      className="flex items-center space-x-1.5 px-2 rounded py-2 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700/70 transition duration-100 group"
                      to={`/schemas/${schema.id}`}
                    >
                      <ViewGridIcon className="w-4 h-4 text-emerald-500" />
                      <span className="leading-none">{schema.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No schemas created yet</p>
            )}
          </Stack>

          <Stack className="w-full" direction="vertical">
            <Button
              onClick={async () => {
                const schemaPath = await open({
                  filters: [{ name: "Prisma schema", extensions: ["prisma"] }],
                });

                if (typeof schemaPath === "string") {
                  handleImportSchema(schemaPath);
                }
              }}
            >
              Open schema...
            </Button>
          </Stack>
        </Stack>
      </Sidebar>

      <Page.Content>{""}</Page.Content>
    </Page>
  );
}
