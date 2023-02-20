import Button from "./Button";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import Dropdown from "./Dropdown";
import EnumComponent from "./Enum";
import ImportSchema from "./ImportSchema";
import Link from "next/link";
import Modal from "./Modal";
import Schema from "./Schema";
import Select from "./Select";
import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";
import Stack from "./Stack";
import toast from "react-hot-toast";
import { ArrowLeftIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import {
  ArrowUpTrayIcon,
  CubeIcon,
  EyeIcon,
  ListBulletIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { BoltIcon, CubeIcon as CubeIconSolid } from "@heroicons/react/24/solid";
import {
  Enum,
  Model,
  PrismaDatabase,
  Schema as SchemaType,
} from "../lib/types";
import { ID_FIELD } from "../lib/fields";
import { LINKS } from "./Links";
import { PRISMA_DATABASES } from "../lib/prisma";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../lib/context";

export default function Models() {
  const { schema, schemas, setSchema, setSchemas } = useSchemaContext();
  const { push, query } = useRouter();

  const [showingImportSchema, setShowingImportSchema] =
    useState<boolean>(false);
  const [showingAddEnum, setShowingAddEnum] = useState<boolean>(false);
  const [showingSchema, setShowingSchema] = useState<boolean>(false);
  const [editingEnum, setEditingEnum] = useState<string>();
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

  const updateSchema = (values: any) => {
    setSchema({
      ...schema,
      ...values,
    });
  };

  const handleCreateModel = () => {
    if (schema.models.some((model: Model) => model.name === "New")) {
      toast.error("A model called New exists");
    } else {
      const newSchema = {
        ...schema,
        models: [
          ...schema.models,
          {
            name: "New",
            fields: [ID_FIELD],
            enums: [],
          },
        ],
      };
      setSchema(newSchema);
      push(`/schemas/${schema.name}/models/${newSchema.models.length - 1}`);
    }
  };

  const handleDeleteSchema = () => {
    setSchemas(schemas.filter((s: SchemaType) => s.name !== schema.name));
    push("/");
  };

  const filteredCommandPaletteItems = filterItems(
    [
      {
        heading: "Pages",
        id: "pages",
        items: [
          {
            id: "pages.home",
            children: "Home",
            icon: "HomeIcon",
            href: "/",
          },
          {
            id: "pages.graph-view",
            children: "Visualize schema",
            icon: "EyeIcon",
            href: `/schemas/${schema.name}/graph`,
          },
        ],
      },
      {
        heading: "Quick actions",
        id: "quick-actions",
        items: [
          {
            id: "quick-actions.new-model",
            onClick: handleCreateModel,
            children: "New model",
            icon: "PlusIcon",
          },
          {
            id: "quick-actions.new-enum",
            onClick: () => {
              setShowingAddEnum(true);
            },
            children: "New enum",
            icon: "PlusIcon",
          },
          {
            id: "quick-actions.import-schema",
            onClick: () => {
              setShowingImportSchema(true);
            },
            children: "Import schema",
            icon: "ArrowUpTrayIcon",
          },
          {
            id: "quick-actions.generate-schema",
            onClick: () => {
              setShowingSchema(true);
            },
            children: "Generate schema",
            icon: "BoltIcon",
          },
          {
            id: "quick-actions.delete-schema",
            onClick: () => {
              handleDeleteSchema();
            },
            children: "Delete schema",
            icon: "TrashIcon",
          },
        ],
      },
      {
        heading: "Models",
        id: "models",
        items: schema.models.map((model, i) => ({
          href: `/schemas/${schema.name}/models/${i}`,
          children: model.name,
          icon: "CubeIcon",
          id: model.name,
        })),
      },
      {
        heading: "Enums",
        id: "enums",
        items: schema.enums.map((e) => ({
          onClick: () => {
            setEditingEnum(e.name);
          },
          icon: "ListBulletIcon",
          children: e.name,
          id: e.name,
        })),
      },
      {
        heading: "Links",
        id: "links",
        items: LINKS.map((LINK, i) => ({
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

  if (!schema) return null;

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

      <Sidebar
        withLinks={false}
        extra={
          <Stack direction="vertical">
            <Button
              type="button"
              variant="secondary"
              icon={EyeIcon}
              onClick={() => {
                push(`/schemas/${schema.name}/graph`);
              }}
            >
              Visualize schema
            </Button>

            <Button
              type="button"
              variant="secondary"
              icon={ArrowUpTrayIcon}
              onClick={() => [setShowingImportSchema(true)]}
            >
              Import schema
            </Button>

            <Button
              icon={BoltIcon}
              type="button"
              onClick={() => {
                setShowingSchema(true);
              }}
            >
              Generate schema
            </Button>
          </Stack>
        }
      >
        <div className="p-5">
          <Link
            href="/"
            className="text-gray-600 font-medium text-sm flex items-center gap-2 hover:underline underline-offset-4"
          >
            <ArrowLeftIcon className="w-4" />
            <span>Back</span>
          </Link>

          <Stack align="center" className="mt-5" justify="between">
            <h1
              className="text-2xl p-2 -m-2 hover:bg-gray-100 focus:bg-gray-200 transition rounded-md font-medium truncate leading-none focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
              onBlur={(e) => {
                const newName = e.currentTarget.innerText.trim();

                if (newName && newName !== schema.name) {
                  updateSchema({
                    name: newName,
                  });

                  push(`/schemas/${newName}`);
                }
              }}
              contentEditable
            >
              {schema.name}
            </h1>

            <Dropdown
              items={[
                {
                  label: "Delete schema",
                  icon: TrashIcon,
                  onClick: handleDeleteSchema,
                },
              ]}
            >
              <button type="button" className="icon-button">
                <EllipsisVerticalIcon className="w-5 icon-button-button" />
              </button>
            </Dropdown>
          </Stack>

          <Select
            label="Provider"
            className="mt-3"
            id="provider"
            value={schema.database}
            onChange={(e) => {
              setSchema({
                ...schema,
                database: e.currentTarget.value as PrismaDatabase,
              });
            }}
          >
            {PRISMA_DATABASES.map((PRISMA_DATABASE) => (
              <option key={PRISMA_DATABASE.value} value={PRISMA_DATABASE.value}>
                {PRISMA_DATABASE.label}
              </option>
            ))}
          </Select>

          <hr className="mt-5 border-gray-200/80 -mx-5" />

          <Stack direction="vertical" className="mt-4" spacing="small">
            <div>
              <p className="label">Models</p>

              {schema.models.length ? (
                <ul className="w-full">
                  {schema.models.map((model, i) => {
                    const isActive = query.id === String(i);

                    return (
                      <li key={model.name}>
                        <SidebarItem
                          href={`/schemas/${schema.name}/models/${i}`}
                          icon={isActive ? CubeIconSolid : CubeIcon}
                          isActive={isActive}
                        >
                          {model.name}
                        </SidebarItem>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={handleCreateModel}
            >
              New model
            </Button>
          </Stack>

          <hr className="mt-5 mb-4 border-gray-200/80 -mx-5" />

          <Stack direction="vertical" spacing="small">
            <div>
              <p className="label">Enums</p>

              {schema.enums.length ? (
                <ul className="w-full">
                  {schema.enums.map((schemaEnum, i) => (
                    <li key={schemaEnum.name}>
                      <SidebarItem
                        icon={ListBulletIcon}
                        onClick={() => {
                          setEditingEnum(schemaEnum.name);
                        }}
                      >
                        {schemaEnum.name}
                      </SidebarItem>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowingAddEnum(true);
              }}
            >
              New enum
            </Button>
          </Stack>
        </div>
      </Sidebar>

      {showingSchema && (
        <Modal
          onClose={() => {
            setShowingSchema(false);
          }}
          heading="Schema"
        >
          {({ close }) => <Schema onCancel={close} />}
        </Modal>
      )}

      {showingImportSchema && (
        <Modal
          onClose={() => {
            setShowingImportSchema(false);
          }}
          heading="Import schema"
        >
          {() => (
            <ImportSchema
              onClose={() => {
                setShowingImportSchema(false);
              }}
            />
          )}
        </Modal>
      )}

      {showingAddEnum && (
        <Modal
          onClose={() => {
            setShowingAddEnum(false);
          }}
          heading="New enum"
        >
          {({ close }) => <EnumComponent onCancel={close} />}
        </Modal>
      )}

      {editingEnum && (
        <Modal
          onClose={() => {
            setEditingEnum(undefined);
          }}
          heading="Update enum"
        >
          {({ close }) => (
            <EnumComponent
              defaultValues={
                schema.enums.find((e) => e.name === editingEnum) ?? ({} as Enum)
              }
              onCancel={close}
            />
          )}
        </Modal>
      )}
    </>
  );
}
