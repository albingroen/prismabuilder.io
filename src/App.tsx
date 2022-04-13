import Button from "./components/Button";
import Page from "./components/Page";
import Sidebar from "./components/Sidebar";
import Stack from "./components/Stack";
import { Link } from "react-router-dom";
import { ViewGridIcon } from "@heroicons/react/solid";
import { open } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";

export default function App() {
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
            <p className="text-stone-500 dark:text-stone-400 text-xs tracking-wider font-medium uppercase">
              Schemas
            </p>
            <ul className="w-full">
              <li>
                <Link
                  className="flex items-center space-x-1.5 px-2 rounded py-2 hover:bg-stone-200 dark:hover:bg-stone-800 border border-transparent hover:border-stone-300 dark:hover:border-stone-700/70 transition duration-100 -mx-2 group"
                  to={`/schemas/${1}`}
                >
                  <ViewGridIcon className="w-4 h-4 text-stone-500 group-hover:text-stone-900 transition duration-100" />
                  <span className="leading-none">School platform</span>
                </Link>
              </li>
            </ul>
          </Stack>

          <Stack className="w-full" direction="vertical" spacing="small">
            <Button>New schema...</Button>

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

      <Page.Content>hej</Page.Content>
    </Page>
  );
}
