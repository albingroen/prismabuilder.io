import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import Link from "next/link";
import Links from "./Links";
import toast from "react-hot-toast";
import { Button, Separator, Card } from "@prisma/lens";
import { Layers } from "react-feather";
import { Schema } from "../lib/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../lib/context";

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
          icon: "CollectionIcon",
          id: schema.name,
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
          <Link href={href ?? ""} passHref>
            <a {...rest} />
          </Link>
        )}
      >
        {filteredCommandPaletteItems.map(({ id, items, ...rest }) => (
          <CommandPalette.List key={id} {...rest}>
            {items.map(({ id, ...rest }) => (
              <CommandPalette.ListItem
                index={getItemIndex(filteredCommandPaletteItems, id)}
                key={id}
                {...rest}
              />
            ))}
          </CommandPalette.List>
        ))}
      </CommandPalette>

      <div className="flex flex-col border flex-1 max-w-sm h-screen overflow-y-auto p-4 space-y-3 bg-gray-100">
        <div className="flex flex-col space-y-3 flex-1">
          {schemas.map((schema: Schema) => {
            return (
              <Link href={`/schemas/${schema.name}`} key={schema.name}>
                <a className="border border-transparent hover:border-blue-500 focus:border-blue-500 transition rounded-lg">
                  <Card className="flex items-center space-x-3">
                    <Layers size={20} className="text-gray-500" />
                    <h3>{schema.name}</h3>
                  </Card>
                </a>
              </Link>
            );
          })}

          {schemas.length ? <Separator /> : null}

          <Button
            onPress={() => {
              handleCreateSchema();
            }}
            variant="secondary"
          >
            New schema
          </Button>
        </div>

        <Links />
      </div>
    </>
  );
}
