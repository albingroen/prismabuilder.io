import Button from "../../../components/Button";
import Label from "../../../components/Label";
import Page from "../../../components/Page";
import Sidebar from "../../../components/Sidebar";
import Stack from "../../../components/Stack";
import Types from "../../../components/Types";
import { CubeIcon } from "@heroicons/react/solid";
import { ID_FIELD } from "../../../lib/fields";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MenuIcon, TrashIcon } from "@heroicons/react/outline";
import { FieldType, Schema } from "../../../types";
import { TYPES } from "../../../lib/types";
import { useSchemaContext } from "../../../lib/context";
import { useState } from "react";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import CreateField from "../../../components/CreateField";

export default function SchemaView() {
  const { schemaId, modelId } = useParams();
  const navigate = useNavigate();

  const { schemas, setSchema } = useSchemaContext();
  const schema = schemas.find((s) => s.id === schemaId);

  const [addingField, setAddingField] = useState<FieldType>();

  if (!schema) return null;

  const model = modelId && schema.models.find((m) => m.id === modelId);

  return (
    <Page>
      <Sidebar backLink="/" heading={schema.name}>
        <Stack direction="vertical" className="h-full" justify="between">
          <Stack
            direction="vertical"
            className="w-full"
            spacing="small"
            align="start"
          >
            <Label>Models</Label>
            {schema.models.length ? (
              <ul className="w-full">
                {schema.models.map((model) => (
                  <li key={model.id}>
                    <Link
                      className="flex items-center space-x-1.5 px-2 rounded py-2 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700/70 transition duration-100 -mx-2 group"
                      to={`/schemas/${schemaId}/models/${model.id}`}
                    >
                      <CubeIcon className="w-4 h-4 text-stone-500 group-hover:text-inherit transition duration-100" />
                      <span className="leading-none">{model.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No models created yet</p>
            )}
          </Stack>

          <Stack direction="vertical" spacing="small">
            <Button
              onClick={() => {
                const newModel = {
                  id: Math.random().toString(),
                  fields: [ID_FIELD],
                  name: "New model",
                };

                const newSchema: Schema = {
                  ...schema,
                  models: [...schema.models, newModel],
                };

                setSchema(schema.id, newSchema);
                navigate(`/schemas/${schema.id}/models/${newModel.id}`);
              }}
            >
              New model
            </Button>
          </Stack>
        </Stack>
      </Sidebar>

      <Page.Content>
        {model ? (
          <Stack className="h-full !gap-6">
            <Stack className="flex-1" direction="vertical" spacing="huge">
              <Stack align="center" spacing="small">
                <CubeIcon className="w-6 text-stone-500" />
                <h1 className="text-2xl leading-none">{model.name}</h1>
              </Stack>

              <Stack direction="vertical" spacing="small">
                {model.fields.map((field) => {
                  const type = TYPES.find((t) => t.name === field.type);

                  const Icon = type?.icon ?? CubeIcon;

                  return (
                    <button
                      className="rounded-md bg-white shadow shadow-stone-300/30 hover:shadow-md dark:shadow-stone-900/20 dark:bg-stone-700/60 dark:hover:bg-stone-700 transition duration-100 border dark:border-stone-600 p-3 pr-4 text-left"
                      key={field.name}
                    >
                      <Stack align="center" justify="between">
                        <Stack align="center">
                          <button>
                            <MenuIcon className="w-4 text-stone-300 dark:text-stone-500 hover:text-inherit transition duration-100" />
                          </button>
                          <div className="h-14 w-14 rounded-md bg-indigo-200 dark:bg-stone-500 bg-opacity-40 flex items-center justify-center">
                            <Icon className="w-7 text-indigo-400 group-hover:text-inherit transition duration-100" />
                          </div>
                          <Stack direction="vertical" spacing="small">
                            <h3 className="text-xl leading-none">
                              {field.name}
                            </h3>
                            <Stack align="center">
                              <span className="py-0.5 px-1 font-medium rounded text-xs transition duration-100 text-stone-700 border bg-stone-100 shadow-sm border-stone-300">
                                {type?.name}
                              </span>
                            </Stack>
                          </Stack>
                        </Stack>

                        <button>
                          <TrashIcon className="w-5 text-red-400 hover:text-red-600 dark:text-red-600 dark:hover:text-red-800 transition" />
                        </button>
                      </Stack>
                    </button>
                  );
                })}
              </Stack>
            </Stack>

            <Types onClickType={setAddingField} />

            {addingField && (
              <Modal
                description="Add a new field by filling out the form below"
                heading="Add field"
                onClose={() => {
                  setAddingField(undefined);
                }}
              >
                <CreateField defaultType={addingField} />
              </Modal>
            )}
          </Stack>
        ) : null}
      </Page.Content>
    </Page>
  );
}
