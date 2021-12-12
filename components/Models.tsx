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
import { ID_FIELD } from "../lib/fields";
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

  if (!schema) return null;

  return (
    <>
      <div className="flex flex-col border flex-1 max-w-sm h-screen overflow-y-auto p-4 space-y-3 bg-gray-100">
        <div className="flex flex-col space-y-3 flex-1">
          <div>
            <Link href="/">
              <a className="text-sm text-blue-500 hover:text-blue-700 transition">
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
                <a>
                  <Card className="border border-transparent hover:border-blue-500 cursor-pointer transition flex items-center space-x-3">
                    <Box size={20} className="text-gray-500" />
                    <h3>{model.name}</h3>
                  </Card>
                </a>
              </Link>
            );
          })}

          <Separator />

          <Label>Enums</Label>

          {schema.enums.map((e, i) => {
            return (
              <button
                onClick={() => {
                  setEditingEnum(e.name);
                }}
                className="flex"
                key={e.name}
              >
                <Card className="w-full border border-transparent hover:border-blue-500 cursor-pointer transition flex items-center space-x-3">
                  <List size={20} className="text-gray-500" />
                  <h3>{e.name}</h3>
                </Card>
              </button>
            );
          })}

          <Separator />

          <Button
            onClick={() => {
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
                push(
                  `/schemas/${schema.name}/models/${
                    newSchema.models.length - 1
                  }`
                );
              }
            }}
            variant="secondary"
          >
            New model
          </Button>

          <Button
            onClick={() => {
              setShowingAddEnum(true);
            }}
            variant="secondary"
          >
            New enum
          </Button>

          <Button
            onClick={() => {
              setShowingImportSchema(true);
            }}
            variant="secondary"
          >
            Import schema
          </Button>

          {schema.models.length ? (
            <Button
              onClick={() => {
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
              aria-label={isGraphView ? "Exit Graph view" : "Graph view"}
              className="text-gray-500 hover:text-gray-700 transition"
              title={isGraphView ? "Exit Graph view" : "Graph view"}
            >
              {isGraphView ? <X /> : <Globe />}
            </a>
          </Link>
          <div className="divide-x text-sm text-gray-600 justify-self-end">
            <a
              href="https://github.com/albingroen/prismabuilder.io"
              className="hover:underline hover:text-gray-700 pr-3"
              rel="noopener noreferrer"
              target="_blank"
            >
              Source code
            </a>

            <a
              href="https://github.com/albingroen/prismabuilder.io/issues/new?labels=bug"
              className="hover:underline hover:text-gray-700 px-3"
              rel="noopener noreferrer"
              target="_blank"
            >
              Report a bug
            </a>

            <a
              href="https://github.com/albingroen/prismabuilder.io/issues/new?labels=enhancement"
              className="hover:underline hover:text-gray-700 pl-3"
              rel="noopener noreferrer"
              target="_blank"
            >
              Suggest feature
            </a>
          </div>
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
