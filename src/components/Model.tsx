import CreateField from "./CreateField";
import Modal from "./Modal";
import Stack from "./Stack";
import Tag from "./Tag";
import Types from "./Types";
import { CubeIcon, MenuIcon, TrashIcon } from "@heroicons/react/outline";
import { Schema, Field, Model, FieldType } from "../types";
import { TYPES } from "../lib/fields";
import { prismaTypesToIcons } from "../lib/icons";
import { useState } from "react";

interface ModelProps {
  onChangeSchema: (id: string, values: Schema) => void;
  schema: Schema;
  model: Model;
}

export default function ModelView({
  onChangeSchema,
  schema,
  model,
}: ModelProps) {
  const [addingField, setAddingField] = useState<FieldType>();

  function updateModel(values: any) {
    if (!schema || !model) return;

    onChangeSchema(schema.id, {
      ...schema,
      models: schema.models.map((m: Model) =>
        m.name === model.name
          ? {
              ...model,
              ...values,
            }
          : m
      ),
    });
  }

  return (
    <Stack className="h-full !gap-6">
      <Stack className="flex-1" direction="vertical" spacing="huge">
        <Stack align="center" spacing="small">
          <CubeIcon className="w-6 text-stone-500" />
          <h1 className="text-2xl leading-none">{model.name}</h1>
        </Stack>

        <Stack direction="vertical" spacing="small" className="pb-12">
          {model.fields.map((field) => {
            const type = TYPES(schema.database).find(
              (t) => t.name === field.type
            );

            const Icon = prismaTypesToIcons[field.type] ?? CubeIcon;

            return (
              <button
                className="rounded-md bg-white shadow shadow-stone-300/30 hover:shadow-md dark:shadow-stone-900/20 dark:bg-stone-700/60 dark:hover:bg-stone-700 transition duration-100 border dark:border-stone-600 p-3 pr-4 text-left"
                key={field.id}
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
                      <h3 className="text-lg leading-none">{field.name}</h3>
                      <Stack align="center" spacing="small">
                        <Tag>
                          {field.list && "["}
                          {type?.name ?? field.type}
                          {field.list && "]"}
                        </Tag>
                        {field.required && <Tag>Required</Tag>}
                        {field.unique && <Tag>Unique</Tag>}
                        {field.isId && <Tag>ID</Tag>}
                        {field.default && <Tag>{field.default}</Tag>}
                      </Stack>
                    </Stack>
                  </Stack>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      console.log(model.fields);

                      updateModel({
                        fields: model.fields.filter(
                          (f: Field) => f.id !== field.id
                        ),
                      });
                    }}
                    aria-label="Delete field"
                  >
                    <TrashIcon className="w-5 text-red-400 hover:text-red-600 dark:text-red-600 dark:hover:text-red-800 transition" />
                  </button>
                </Stack>
              </button>
            );
          })}
        </Stack>
      </Stack>

      <Types schema={schema} onClickType={setAddingField} />

      {addingField && (
        <Modal
          description="Add a new field by filling out the form below"
          heading="Add field"
          onClose={() => {
            setAddingField(undefined);
          }}
        >
          {({ onClose }) => (
            <CreateField
              schema={schema}
              onSubmit={(field) => {
                updateModel({
                  fields: [...model.fields, field],
                });

                if (onClose) {
                  onClose();
                }
              }}
              defaultType={addingField}
            />
          )}
        </Modal>
      )}
    </Stack>
  );
}
