import ImportSchema from "./ImportSchema";
import Link from "next/link";
import Modal from "./Modal";
import Schema from "./Schema";
import toast from "react-hot-toast";
import {
  Button,
  Separator,
  Card,
  Title,
  TextField,
  Menu,
  Select,
  Label,
} from "@prisma/lens";
import { ID_FIELD, isFieldTypeEnum } from "../lib/fields";
import {
  Globe,
  Box,
  X,
  Edit,
  CheckSquare,
  MoreVertical,
  List,
} from "react-feather";
import { Enum, Model, Schema as SchemaType } from "../lib/types";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../lib/context";
import { useEffect, useState } from "react";
import { PRISMA_DATABASES } from "../lib/prisma";
import AddEnum from "./AddEnum";
import UpdateEnum from "./UpdateEnum";
import Links from "./Links";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";

export default function Models() {
  const { schema, schemas, setSchema, setSchemas } = useSchemaContext();
  const { push, pathname, asPath } = useRouter();

  const [showingImportSchema, setShowingImportSchema] =
    useState<boolean>(false);
  const [showingAddEnum, setShowingAddEnum] = useState<boolean>(false);
  const [showingSchema, setShowingSchema] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingEnum, setEditingEnum] = useState<string>();
  const [name, setName] = useState<string>("");
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

  const isGraphView = pathname.endsWith("/graph");

  useEffect(() => {
    if (schema.name) {
      setName(schema.name);
    }
  }, [schema]);

  useEffect(() => {
    setEditingName(false);
  }, [asPath]);

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
        items: schema.enums.map((e, i) => ({
          onClick: () => {
            setEditingEnum(e.name);
          },
          icon: "ViewListIcon",
          children: e.name,
          id: e.name,
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
          <div>
            <Link href="/">
              <a className="text-sm text-blue-500 hover:text-blue-700 transition focus:ring-2">
                &larr; Change schema
              </a>
            </Link>
          </div>

          <Separator />

          <div
            className={`flex justify-between ${
              editingName ? "items-start" : "items-center"
            }`}
          >
            <div
              className={`flex ${
                editingName ? "items-end" : "items-center"
              } space-x-4`}
            >
              {editingName ? (
                <div>
                  <TextField
                    onChange={setName}
                    placeholder="Blog"
                    inputMode="text"
                    label="Name"
                    value={name}
                    autoFocus
                  />
                </div>
              ) : (
                <Title>{name}</Title>
              )}

              <button
                onClick={() => {
                  if (editingName && name !== schema.name) {
                    if (schemas.some((s) => s.name === name)) {
                      toast.error(`A schema called ${name} exists`);
                      setName(schema.name);
                    } else {
                      updateSchema({ name });
                      push(`/schemas/${name}`);
                    }
                  }
                  setEditingName(!editingName);
                }}
                aria-label={
                  editingName ? "Save schema name" : "Edit schema name"
                }
                className="focus:ring-2"
              >
                {editingName ? (
                  <CheckSquare
                    className="text-gray-700 hover:text-gray-900 transition"
                    size={20}
                  />
                ) : (
                  <Edit
                    className="text-gray-700 hover:text-gray-900 transition"
                    size={20}
                  />
                )}
              </button>
            </div>

            <Menu.Container>
              <Button variant="quiet">
                <MoreVertical
                  className="text-gray-500 hover:text-gray-900 transition"
                  aria-label="More"
                  size={20}
                />
              </Button>
              <Menu.Body
                onSelectionChange={(key) => {
                  if (key === "delete") {
                    setSchemas(
                      schemas.filter((s: SchemaType) => s.name !== schema.name)
                    );
                    push("/");
                  }
                }}
                anchor="right"
                title="Actions"
              >
                <Menu.Option key="delete">
                  <span className="text-red-400">Delete schema</span>
                </Menu.Option>
              </Menu.Body>
            </Menu.Container>
          </div>

          <Select.Container
            selectedKey={schema.database}
            onSelectionChange={(key) => {
              setSchema({
                ...schema,
                database: key,
              });
            }}
            placeholder="Select a provider"
            label="Provider"
          >
            {PRISMA_DATABASES.map((db) => (
              <Select.Option key={db.value}>{db.label}</Select.Option>
            ))}
          </Select.Container>

          <Separator />

          <Label>Models</Label>

          {schema.models.map((model, i) => {
            return (
              <Link
                href={`/schemas/${schema.name}/models/${i}`}
                key={model.name}
              >
                <a className="border border-transparent focus:border-blue-500 hover:border-blue-500 transition rounded-lg">
                  <Card className="flex items-center space-x-3">
                    <Box size={20} className="text-gray-500" />
                    <h3>{model.name}</h3>
                  </Card>
                </a>
              </Link>
            );
          })}

          <Separator />

          {schema.database !== "sqlite" && (
            <>
              <Label>Enums</Label>

              {schema.enums.map((e) => {
                return (
                  <button
                    className="flex border border-transparent focus:border-blue-500 hover:border-blue-500 transition rounded-lg cursor-pointer"
                    onClick={() => {
                      setEditingEnum(e.name);
                    }}
                    key={e.name}
                  >
                    <Card className="w-full transition flex items-center space-x-3">
                      <List size={20} className="text-gray-500" />
                      <h3>{e.name}</h3>
                    </Card>
                  </button>
                );
              })}

              <Separator />
            </>
          )}

          <Button
            onPress={() => {
              handleCreateModel();
            }}
            variant="secondary"
          >
            New model
          </Button>

          {schema.database !== "sqlite" && (
            <Button
              onPress={() => {
                setShowingAddEnum(true);
              }}
              variant="secondary"
            >
              New enum
            </Button>
          )}

          <Button
            onPress={() => {
              setShowingImportSchema(true);
            }}
            variant="secondary"
          >
            Import schema
          </Button>

          {schema.models.length ? (
            <Button
              onPress={() => {
                setShowingSchema(true);
              }}
            >
              Generate schema
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col space-y-4 items-start">
          <Link
            passHref
            href={
              isGraphView
                ? `/schemas/${schema.name}`
                : `/schemas/${schema.name}/graph`
            }
          >
            <a
              className="text-gray-500 hover:text-gray-700 transition focus:ring-2"
              aria-label={isGraphView ? "Exit Graph view" : "Graph view"}
              title={isGraphView ? "Exit Graph view" : "Graph view"}
            >
              {isGraphView ? <X /> : <Globe />}
            </a>
          </Link>

          <Links />
        </div>
      </div>

      <Modal
        onClose={() => {
          setShowingSchema(false);
        }}
        open={showingSchema}
        heading="Schema"
      >
        <Schema
          onCancel={() => {
            setShowingSchema(false);
          }}
        />
      </Modal>

      <Modal
        onClose={() => {
          setShowingImportSchema(false);
        }}
        open={showingImportSchema}
        heading="Import schema"
      >
        <ImportSchema
          onClose={() => {
            setShowingImportSchema(false);
          }}
        />
      </Modal>

      <Modal
        onClose={() => {
          setShowingAddEnum(false);
        }}
        open={showingAddEnum}
        heading="New enum"
      >
        <AddEnum
          onCancel={() => {
            setShowingAddEnum(false);
          }}
        />
      </Modal>

      <Modal
        onClose={() => {
          setEditingEnum(undefined);
        }}
        open={Boolean(editingEnum)}
        heading="Update enum"
      >
        <UpdateEnum
          defaultValues={
            schema.enums.find((e) => e.name === editingEnum) ?? ({} as Enum)
          }
          onCancel={() => {
            setEditingEnum(undefined);
          }}
        />
      </Modal>
    </>
  );
}
