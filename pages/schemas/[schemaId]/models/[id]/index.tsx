import Dropdown from "../../../../../components/Dropdown";
import FieldComponent from "../../../../../components/Field";
import Models from "../../../../../components/Models";
import Stack from "../../../../../components/Stack";
import Tag from "../../../../../components/Tag";
import toast from "react-hot-toast";
import {
  Bars3Icon,
  ClipboardDocumentIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Field, FieldType, Model } from "../../../../../lib/types";
import { TYPES } from "../../../../../lib/fields";
import { classNames } from "react-cmdk";
import { prismaTypesToIcons } from "../../../../../lib/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../../../../../lib/context";

const Model = () => {
  const { schema, setSchema } = useSchemaContext();
  const { query, asPath, push } = useRouter();
  const { id } = query;

  const model = schema.models?.[Number(id)];

  const [addingField, setAddingField] = useState<FieldType>();
  const [editingField, setEditingField] = useState<string>();
  const [name, setName] = useState<string>("");

  const handleChangeName = (newName: string) => {
    if (newName && newName !== model.name) {
      if (schema.models.some((m: Model) => m.name === newName)) {
        toast.error(`A model called ${newName} already exists`);
      } else {
        updateModel({ name: newName });
      }
    }
  };

  const updateModel = (values: any) => {
    setSchema({
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
  };

  useEffect(() => {
    if (model?.name) {
      setName(model.name);
    }
  }, [model]);

  if (!schema) return null;

  return (
    <>
      {addingField && (
        <FieldComponent
          defaultType={addingField ?? ("" as FieldType)}
          onClose={() => setAddingField(undefined)}
          model={model}
          onSubmit={(field) => {
            updateModel({
              fields: [...model.fields, field],
            });

            setAddingField(undefined);
          }}
        />
      )}

      {editingField && (
        <FieldComponent
          onClose={() => {
            setEditingField(undefined);
          }}
          model={model}
          defaultValues={
            model?.fields?.find(
              (field: Field) => field.name === editingField
            ) ?? ({} as Field)
          }
          onSubmit={(field) => {
            updateModel({
              fields: model.fields.map((f: Field) =>
                f.name === editingField ? field : f
              ),
            });
          }}
        />
      )}

      <Models />

      {model && (
        <div className="flex-1 p-8 flex flex-col space-y-4">
          <Stack align="center" justify="between">
            <h2
              className="text-2xl p-2 -m-2 hover:bg-gray-200 focus:bg-gray-300 transition rounded-md font-medium focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
              onBlur={(e) => {
                const newName = e.currentTarget.innerText.trim();

                if (newName && newName !== model.name) {
                  handleChangeName(newName);
                }
              }}
              contentEditable
            >
              {name}
            </h2>

            <Dropdown
              align="end"
              items={[
                {
                  label: "Duplicate model",
                  icon: DocumentDuplicateIcon,
                  onClick: () => {
                    const duplicatedModelName = `${model.name} copy`;

                    if (
                      schema.models.some((m) => m.name === duplicatedModelName)
                    ) {
                      toast.error("A model with this name already exists");
                      return;
                    }

                    setSchema({
                      ...schema,
                      models: [
                        ...schema.models,
                        {
                          ...model,
                          name: duplicatedModelName,
                        },
                      ],
                    });
                    push(
                      `/schemas/${schema.name}/models/${schema.models.length}`
                    );
                  },
                },
                {
                  label: "Delete model",
                  icon: TrashIcon,
                  onClick: () => {
                    setSchema({
                      ...schema,
                      models: schema.models.filter(
                        (m: Model) => m.name !== model.name
                      ),
                    });
                    push(`/schemas/${schema.name}`);
                  },
                },
              ]}
            >
              <button type="button" className="icon-button">
                <EllipsisVerticalIcon className="icon-button-icon" />
              </button>
            </Dropdown>
          </Stack>

          <hr />

          <div className="flex space-x-8">
            <DragDropContext
              onDragEnd={(result) => {
                const newFields = [...model.fields];

                if (result.destination) {
                  newFields.splice(result.source.index, 1);

                  newFields.splice(
                    result.destination.index,
                    0,
                    model.fields[result.source.index]
                  );

                  updateModel({
                    fields: newFields,
                  });
                }
              }}
            >
              <Droppable droppableId={model.name} direction="vertical">
                {({ droppableProps, innerRef, placeholder }) => (
                  <div
                    {...droppableProps}
                    ref={innerRef}
                    className="flex flex-col flex-1 model-fields p-1 overflow-y-auto"
                  >
                    {model?.fields.map((field: Field, i) => {
                      const enumType = schema.enums.find(
                        (e) => e.name === field.type && e.fields.length
                      );

                      const Icon = enumType
                        ? prismaTypesToIcons.Enum
                        : field.relationField
                        ? prismaTypesToIcons.Model
                        : prismaTypesToIcons[field.type] ??
                          prismaTypesToIcons.default;

                      return (
                        <Draggable
                          draggableId={field.name}
                          key={field.name}
                          index={i}
                        >
                          {(
                            { dragHandleProps, draggableProps, innerRef },
                            { isDragging }
                          ) => (
                            <button
                              {...draggableProps}
                              ref={innerRef}
                              type="button"
                              className={classNames(
                                "bg-white rounded-lg mb-3 w-full flex text-left items-center justify-between p-4 border focus:outline-none focus:ring-0",
                                isDragging
                                  ? "border-indigo-500 shadow-lg"
                                  : "shadow border-white hover:border-indigo-500 focus-visible:border-indigo-500"
                              )}
                              onClick={() => setEditingField(field.name)}
                            >
                              <div className="flex items-center space-x-4">
                                <div {...dragHandleProps}>
                                  <Bars3Icon
                                    className={`w-5 ${
                                      isDragging
                                        ? "text-inherit"
                                        : "text-gray-400 hover:text-inherit"
                                    } transition`}
                                  />
                                </div>

                                <div className="rounded-md !bg-gray-100 flex items-center justify-center p-5">
                                  <Icon className="w-6" />
                                </div>

                                <Stack direction="vertical" spacing="small">
                                  <h4 className="text-lg w-52 font-medium">
                                    {field.name}
                                  </h4>

                                  <Stack
                                    wrap
                                    align="center"
                                    justify="start"
                                    spacing="small"
                                  >
                                    <Tag>
                                      {field.list ? "[" : ""}
                                      {field.type}
                                      {field.list ? "]" : ""}
                                    </Tag>
                                    {field.unique && <Tag>Unique</Tag>}
                                    {field.required && <Tag>Required</Tag>}
                                    {field.default && (
                                      <Tag>{field.default}</Tag>
                                    )}
                                    {field.isUpdatedAt && <Tag>Updated At</Tag>}
                                    {field.isId && <Tag>ID</Tag>}
                                  </Stack>
                                </Stack>
                              </div>

                              <div className="flex items-center">
                                <div
                                  role="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const duplicatedFieldName = `${field.name} copy`;

                                    if (
                                      model.fields.some(
                                        (f) => f.name === duplicatedFieldName
                                      )
                                    ) {
                                      toast.error(
                                        "Field with this name already exists"
                                      );
                                      return;
                                    }

                                    updateModel({
                                      fields: [
                                        ...model.fields,
                                        {
                                          ...field,
                                          name: duplicatedFieldName,
                                        },
                                      ],
                                    });
                                  }}
                                  title="Duplicate field"
                                  className="pl-4 pr-2"
                                >
                                  <ClipboardDocumentIcon className="w-5 text-gray-600 hover:text-gray-900 transition" />
                                </div>

                                <div
                                  role="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    updateModel({
                                      fields: model.fields.filter(
                                        (f: Field) => f.name !== field.name
                                      ),
                                    });
                                  }}
                                  title="Delete field"
                                  className="px-4"
                                >
                                  <TrashIcon className="text-red-400 hover:text-red-600 transition w-5" />
                                </div>
                              </div>
                            </button>
                          )}
                        </Draggable>
                      );
                    })}

                    {placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className="flex-1 max-w-sm model-fields overflow-y-auto bg-gray-200 rounded-lg p-4 flex flex-col space-y-4">
              <h2 className="font-medium text-xl">Add field</h2>

              <Stack direction="vertical">
                {[
                  ...TYPES(schema.database).map((t) => ({
                    ...t,
                    type: "type",
                  })),
                  ...schema.models.map((m) => ({
                    ...m,
                    description: "",
                    type: "model",
                  })),
                  ...(schema.database !== "sqlite" &&
                  schema.database !== "sqlserver"
                    ? schema.enums.map((e) => ({
                        ...e,
                        description: "",
                        type: "enum",
                      }))
                    : []),
                ].map((type) => {
                  const Icon =
                    type.type === "enum"
                      ? prismaTypesToIcons.Enum
                      : type.type === "model"
                      ? prismaTypesToIcons.Model
                      : prismaTypesToIcons[type.name] ??
                        prismaTypesToIcons.default;

                  return (
                    <button
                      type="button"
                      className={classNames(
                        "rounded-lg bg-white shadow text-left border border-transparent focus:outline-none focus:ring-0 focus:border-indigo-500 hover:border-indigo-500 py-3 px-4 flex items-center space-x-3.5",
                        type.type === "model" || type.type === "enum"
                          ? "bg-indigo-100"
                          : "bg-blue-100"
                      )}
                      onClick={() => setAddingField(type.name as FieldType)}
                      key={type.name}
                    >
                      <div className="rounded-md !bg-gray-100 flex items-center justify-center p-3">
                        <Icon className={classNames("w-5")} />
                      </div>

                      <Stack direction="vertical" spacing="tiny">
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-gray-500">
                          {type.description}
                        </p>
                      </Stack>
                    </button>
                  );
                })}
              </Stack>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Model;
