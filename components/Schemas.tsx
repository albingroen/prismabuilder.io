import Button from "./Button";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import Link from "next/link";
import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";
import toast from "react-hot-toast";
import { CircleStackIcon } from "@heroicons/react/24/outline";
import { LINKS } from "./Links";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Schema } from "../lib/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../lib/context";
import Stack from "./Stack";

export default function Schemas() {
  const { schemas, setSchemas } = useSchemaContext();
  const router = useRouter();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] =
    useState<boolean>(false);
  const [commandPaletteSearch, setCommandPaletteSearch] = useState<string>("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === "k") {
        e.preventDefault();
        e.stopPropagation();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleCreateSchema() {
    if (schemas.some((schema: Schema) => schema.name === "New schema")) {
      toast.error("A schema called New schema exists");
    } else {
      const newSchema: Schema = {
        database: "postgresql",
        name: "New schema",
        models: [],
        enums: [],
      };
      setSchemas([...schemas, newSchema]);
      router.push(`/schemas/${newSchema.name}`);
    }
  }

  const filteredCommandPaletteItems = filterItems(
    [
      {
        heading: "Quick actions",
        id: "quick-actions",
        items: [
          {
            id: "quick-actions.new-schema",
            onClick: handleCreateSchema,
            children: "New schema",
            icon: "PlusIcon",
          },
        ],
      },
      {
        heading: "Schemas",
        id: "schemas",
        items: schemas.map((schema) => ({
          href: `/schemas/${schema.name}`,
          children: schema.name,
          icon: "CircleStackIcon",
          id: schema.name,
        })),
      },
      {
        heading: "Links",
        id: "links",
        items: LINKS.map((LINK) => ({
          rel: "noreferrer noopener",
          icon: "ArrowTopRightOnSquareIcon",
          children: LINK.label,
          href: LINK.href,
          id: LINK.label,
          target: "_blank",
        })),
      },
    ],
    commandPaletteSearch
  );

  return (
    <>
      <CommandPalette
        onChangeSearch={setCommandPaletteSearch}
        onChangeOpen={setIsCommandPaletteOpen}
        isOpen={isCommandPaletteOpen}
        search={commandPaletteSearch}
        renderLink={({ href, ...rest }) => (
          <Link href={href ?? ""} className={rest.className} style={rest.style}>
            {rest.children}
          </Link>
        )}
      >
        {filteredCommandPaletteItems.map(({ id, items, ...rest }) => (
          <CommandPalette.List key={id} {...rest}>
            {items.map(({ id, ...rest }) => (
              <CommandPalette.ListItem
                index={getItemIndex(filteredCommandPaletteItems, id)}
                iconType="outline"
                key={id}
                {...rest}
              />
            ))}
          </CommandPalette.List>
        ))}
      </CommandPalette>

      <Sidebar>
        <div className="p-5">
          <p className="text-gray-600 font-medium text-sm">Schemas</p>

          <ul className="mt-2.5 w-full">
            {schemas.map((schema) => (
              <li key={schema.name}>
                <SidebarItem
                  href={`/schemas/${schema.name}`}
                  icon={CircleStackIcon}
                >
                  {schema.name}
                </SidebarItem>
              </li>
            ))}
          </ul>

          <Button
            className="mt-3.5"
            icon={PlusIcon}
            type="button"
            onClick={() => {
              handleCreateSchema();
            }}
          >
            New schema
          </Button>
        </div>
      </Sidebar>

      <Stack className="flex-1" justify="center" align="center">
        <Stack
          direction="vertical"
          align="start"
          className="p-7 rounded-md border border-gray-300 border-dashed"
        >
          <ol className="list-decimal space-y-2 list-inside text-gray-700">
            <li>Click &ldquo;New schema&rdquo;</li>
            <li>Name your schema</li>
            <li>Choose a provider</li>
            <li>Create your models</li>
            <li>Click &ldquo;Generate schema&rdquo;</li>
          </ol>
        </Stack>
      </Stack>
    </>
  );
}
