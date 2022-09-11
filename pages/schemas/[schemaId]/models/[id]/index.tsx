import AddField from "../../../../../components/AddField";
import Models from "../../../../../components/Models";
import Tag from "../../../../../components/Tag";
import UpdateField from "../../../../../components/UpdateField";
import toast from "react-hot-toast";
import { Button, Menu, Separator, TextField, Title } from "@prisma/lens";
import {
  CheckSquare,
  Edit,
  MoreVertical,
  Trash2,
  Menu as MenuIcon,
} from "react-feather";
import { isFieldTypeEnum, TYPES } from "../../../../../lib/fields";
import { prismaTypesToIcons } from "../../../../../lib/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../../../../../lib/context";
import { Field, FieldType, Model } from "../../../../../lib/types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Model = () => {
  const { schema, setSchema } = useSchemaContext();
  const { query, asPath, push } = useRouter();
  const { id } = query;

  const model = schema.models?.[Number(id)];

  const [addingField, setAddingField] = useState<FieldType>();
  const [editingField, setEditingField] = useState<string>();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState<string>("");

  const handleFieldEdit = () => {
    if (editingName && name !== model.name) {
      if (schema.models.some((m: Model) => m.name === name)) {
        toast.error(`A model called ${name} already exists`);
        setName(model.name);
      } else {
        updateModel({ name });
      }
    }
    setEditingName(!editingName);
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

  useEffect(() => {
    setEditingName(false);
  }, [asPath]);

  if (!schema) return null;

  return (
    <>
      <AddField
        defaultType={addingField ?? ("" as FieldType)}
        onClose={() => setAddingField(undefined)}
        open={Boolean(addingField)}
        model={model}
        onSubmit={(field) => {
          updateModel({
            fields: [...model.fields, field],
          });

          setAddingField(undefined);
        }}
      />

      <UpdateField
        onClose={() => setEditingField(undefined)}
        model={model}
        defaultValues={
          model?.fields?.find((field: Field) => field.name === editingField) ??
          ({} as Field)
        }
        open={Boolean(editingField)}
        onSubmit={(field) => {
          updateModel({
            fields: model.fields.map((f: Field) =>
              f.name === editingField ? field : f
            ),
          });

          setEditingField(undefined);
        }}
      />

      <div className="flex">
        <Models />

        {model && (
          <div className="flex-1 p-12 bg-gray-100 h-screen flex flex-col space-y-4">
            <div className="flex items-center justify-between space-x-6">
              <div
                className={`flex ${
                  editingName ? "items-end" : "items-center"
                } space-x-4`}
              >
                {editingName ? (
                  <div>
                    <TextField
                      onChange={setName}
                      placeholder="User"
                      inputMode="text"
                      label="Name"
                      value={name}
                      autoFocus
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-semibold">{name}</h2>
                )}
                <button
                  onClick={handleFieldEdit}
                  className="focus:ring-2"
                  aria-label={
                    editingName ? "Save model name" : "Edit model name"
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
                      setSchema({
                        ...schema,
                        models: schema.models.filter(
                          (m: Model) => m.name !== model.name
                        ),
                      });
                      push(`/schemas/${schema.name}`);
                    }
                  }}
                  anchor="right"
                  title="Actions"
                >
                  <Menu.Option key="delete">
                    <span className="text-red-400">Delete model</span>
                  </Menu.Option>
                </Menu.Body>
              </Menu.Container>
            </div>

            <Separator />

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
                      {model?.fields?.map((field: Field, i) => {
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
                                className="mb-3 rounded-lg bg-white shadow-md text-left border border-transparent cursor-pointer py-3.5 px-4 flex items-center justify-between"
                                onClick={() => setEditingField(field.name)}
                              >
                                <div className="flex items-center space-x-4">
                                  <div {...dragHandleProps}>
                                    <MenuIcon
                                      size={20}
                                      className={`${
                                        isDragging
                                          ? "text-gray-700"
                                          : "text-gray-500 hover:text-gray-700"
                                      } transition`}
                                    />
                                  </div>

                                  <div
                                    className={`rounded-md ${
                                      field.relationField || enumType
                                        ? "bg-indigo-100"
                                        : "bg-blue-100"
                                    } flex items-center justify-center p-4`}
                                  >
                                    <Icon
                                      className={`${
                                        field.relationField || enumType
                                          ? "text-indigo-600"
                                          : "text-blue-600"
                                      }`}
                                      size={24}
                                    />
                                  </div>
                                  <div className="flex flex-col space-y-1">
                                    <h4 className="text-lg w-52 font-medium">
                                      {field.name}
                                    </h4>
                                    <div className="flex items-center space-x-2">
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
                                      {field.isUpdatedAt && (
                                        <Tag>Updated At</Tag>
                                      )}
                                      {field.isId && <Tag>ID</Tag>}
                                    </div>
                                  </div>
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
                                  aria-label="Delete field"
                                  className="px-4"
                                >
                                  <Trash2
                                    className="text-red-400 hover:text-red-600 transition"
                                    size={20}
                                  />
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
                <h2 className="font-semibold text-xl">Add field</h2>

                <div className="flex flex-col space-y-3">
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
                        className={`rounded-lg bg-white shadow-md text-left border border-transparent focus:border-blue-500 hover:border-blue-500 cursor-pointer transition py-3 px-4 flex items-center space-x-4 ${
                          type.type === "model" || type.type === "enum"
                            ? "bg-indigo-100"
                            : "bg-blue-100"
                        } `}
                        onClick={() => setAddingField(type.name as FieldType)}
                        key={type.name}
                      >
                        <div className="rounded-md bg-blue-100 flex items-center justify-center p-3">
                          <Icon
                            className={`${
                              type.type === "model" || type.type === "enum"
                                ? "text-indigo-600"
                                : "text-blue-600"
                            }`}
                            size={20}
                          />
                        </div>

                        <div className="flex flex-col">
                          <h4 className="font-medium">{type.name}</h4>
                          <p className="text-sm text-gray-700">
                            {type.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Model;
