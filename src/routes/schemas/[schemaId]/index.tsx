import Button from "../../../components/Button";
import EnumForm from "../../../components/EnumForm";
import Label from "../../../components/Label";
import Modal from "../../../components/Modal";
import Model from "../../../components/Model";
import Page from "../../../components/Page";
import SchemaPreview from "../../../components/SchemaPreview";
import Select from "../../../components/Select";
import Sidebar from "../../../components/Sidebar";
import Stack from "../../../components/Stack";
import {
  CubeIcon,
  CubeTransparentIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import { ID_FIELD } from "../../../lib/fields";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PRISMA_DATABASES } from "../../../lib/prisma";
import { PrismaDatabase, Schema } from "../../../types";
import { ask } from "@tauri-apps/api/dialog";
import { useSchemaContext } from "../../../lib/context";
import { useState } from "react";
import { v4 as uuid } from "uuid";

export default function SchemaView() {
  const { schemaId, modelId } = useParams();
  const navigate = useNavigate();

  const { schemas, setSchemas, setSchema } = useSchemaContext();
  const schema = schemas.find((s) => s.id === schemaId);

  const [showingSchema, setShowingSchema] = useState<boolean>(false);
  const [addingEnum, setAddingEnum] = useState<boolean>(false);
  const [editingEnum, setEditingEnum] = useState<string>();

  if (!schema) return null;

  const model = modelId && schema.models.find((m) => m.id === modelId);

  async function handleDeleteSchema() {
    if (
      await ask("Are you sure you want to delete this schema?", "Delete schema")
    ) {
      setSchemas(schemas.filter((s) => s.id !== schema!.id));
      navigate("/");
    }
  }

  async function handleDeletEnum(id: string) {
    if (!schema) return false;

    if (
      await ask("Are you sure you want to delete this enum?", "Delete enum")
    ) {
      setSchema(schema.id, {
        ...schema,
        enums: schema.enums.filter((e) => e.id !== id),
      });
      return true;
    }
    return false;
  }

  return (
    <Page>
      <Sidebar
        backLink="/"
        heading={schema.name}
        onChangeHeading={(name) => {
          setSchema(schema.id, {
            ...schema,
            name,
          });
        }}
      >
        <Stack direction="vertical" className="h-full" justify="between">
          <Stack className="w-full !gap-6" direction="vertical" spacing="small">
            <Select
              value={schema.database}
              onChange={(e) => {
                setSchema(schema.id, {
                  ...schema,
                  database: e.currentTarget.value as PrismaDatabase,
                });
              }}
            >
              {PRISMA_DATABASES.map((database) => (
                <Select.Option key={database.value} value={database.value}>
                  {database.label}
                </Select.Option>
              ))}
            </Select>

            <Stack direction="vertical" spacing="mini" className="w-full">
              <Stack align="center" justify="between">
                <Label>Models</Label>
                <button
                  onClick={() => {
                    const newModel = {
                      fields: [ID_FIELD],
                      name: "New",
                      id: uuid(),
                    };

                    const newSchema: Schema = {
                      ...schema,
                      models: [...schema.models, newModel],
                    };

                    setSchema(schema.id, newSchema);
                    navigate(`/schemas/${schema.id}/models/${newModel.id}`);
                  }}
                  className="rounded border border-transparent hover:bg-stone-100 hover:border-stone-200 p-1.5 transition duration-100 text-stone-400 hover:text-inherit"
                  title="Add model"
                >
                  <PlusIcon className="w-4" />
                </button>
              </Stack>

              {schema.models.length ? (
                <ul className="w-full">
                  {schema.models.map((model) => (
                    <li key={model.id}>
                      <Link
                        className="flex items-center space-x-1.5 px-2 rounded py-2 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700/70 transition duration-100 group"
                        to={`/schemas/${schemaId}/models/${model.id}`}
                      >
                        <CubeIcon className="w-4 h-4 text-emerald-500" />
                        <span className="leading-none">{model.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-stone-400">No models created yet</p>
              )}
            </Stack>

            <Stack direction="vertical" spacing="mini" className="w-full">
              <Stack align="center" justify="between">
                <Label>Enums</Label>

                <button
                  className="rounded border border-transparent hover:bg-stone-100 hover:border-stone-200 p-1.5 transition duration-100 text-stone-400 hover:text-inherit"
                  title="Add enum"
                  onClick={() => {
                    setAddingEnum(true);
                  }}
                >
                  <PlusIcon className="w-4" />
                </button>
              </Stack>

              {schema.enums.length ? (
                <ul className="w-full">
                  {schema.enums.map((e) => (
                    <li key={e.id}>
                      <button
                        className="w-full flex items-center space-x-1.5 px-2 rounded py-2 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700/70 transition duration-100 group"
                        onClick={() => {
                          setEditingEnum(e.id);
                        }}
                      >
                        <CubeTransparentIcon className="w-4 h-4 text-emerald-500" />
                        <span className="leading-none">{e.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-stone-400">No enums created yet</p>
              )}
            </Stack>
          </Stack>

          <Stack direction="vertical">
            <Button
              variant="primary"
              onClick={() => {
                setShowingSchema(true);
              }}
            >
              Generate schema
            </Button>

            <Button onClick={handleDeleteSchema}>Delete schema</Button>
          </Stack>
        </Stack>
      </Sidebar>

      <Page.Content>
        {model ? (
          <Model model={model} schema={schema} onChangeSchema={setSchema} />
        ) : null}
      </Page.Content>

      {showingSchema && (
        <Modal
          description="Here's what your generated Prisma schema looks like."
          heading="Schema"
          onClose={() => {
            setShowingSchema(false);
          }}
        >
          {({ onClose }) => (
            <SchemaPreview onCancel={onClose} schema={schema} />
          )}
        </Modal>
      )}

      {addingEnum && (
        <Modal
          description="Add a new enum by filling out the form below."
          heading="Add enum"
          onClose={() => {
            setAddingEnum(false);
          }}
        >
          {({ onClose }) => (
            <EnumForm
              cta="Add enum"
              onSubmit={(values) => {
                setSchema(schema.id, {
                  ...schema,
                  enums: [...schema.enums, values],
                });

                if (onClose) {
                  onClose();
                }
              }}
              onCancel={() => {
                if (onClose) {
                  onClose();
                }
              }}
            />
          )}
        </Modal>
      )}

      {editingEnum && (
        <Modal
          description="Update enum by filling out the form below."
          heading="Update enum"
          onClose={() => {
            setEditingEnum(undefined);
          }}
        >
          {({ onClose }) => (
            <EnumForm
              cta="Update enum"
              defaultValues={schema.enums.find((e) => e.id === editingEnum)}
              onDelete={async () => {
                if ((await handleDeletEnum(editingEnum)) && onClose) {
                  onClose();
                }
              }}
              onSubmit={(values) => {
                setSchema(schema.id, {
                  ...schema,
                  enums: schema.enums.map((e) =>
                    e.id === editingEnum ? { ...e, ...values } : e
                  ),
                });

                if (onClose) {
                  onClose();
                }
              }}
              onCancel={() => {
                if (onClose) {
                  onClose();
                }
              }}
            />
          )}
        </Modal>
      )}
    </Page>
  );
}
