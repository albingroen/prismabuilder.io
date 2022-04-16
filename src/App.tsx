import Button from "./components/Button";
import Label from "./components/Label";
import Page from "./components/Page";
import Sidebar from "./components/Sidebar";
import Stack from "./components/Stack";
import { Link, useNavigate } from "react-router-dom";
import { Schema } from "./types";
import { ViewGridIcon } from "@heroicons/react/solid";
import { open } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";
import { useSchemaContext } from "./lib/context";
import { v4 as uuid } from "uuid";

export default function App() {
  const { schemas, setSchemas } = useSchemaContext();
  const navigate = useNavigate();

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
          <Stack
            direction="vertical"
            className="w-full"
            spacing="small"
            align="start"
          >
            <Label>Schemas</Label>

            {schemas.length ? (
              <ul className="w-full">
                {schemas.map((schema) => (
                  <li key={schema.id}>
                    <Link
                      className="flex items-center space-x-1.5 px-2 rounded py-2 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700/70 transition duration-100 -mx-2 group"
                      to={`/schemas/${schema.id}`}
                    >
                      <ViewGridIcon className="w-4 h-4 text-stone-500 group-hover:text-inherit transition duration-100" />
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
              New schema
            </Button>

            <Button
              onClick={async () => {
                const schemaPath = await open({
                  filters: [{ name: "Prisma schema", extensions: ["prisma"] }],
                });

                if (typeof schemaPath === "string") {
                  const schema = await readTextFile(schemaPath);
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
