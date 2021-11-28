import AddField from "../../../../../components/AddField";
import Models from "../../../../../components/Models";
import Tag from "../../../../../components/Tag";
import UpdateField from "../../../../../components/UpdateField";
import toast from "react-hot-toast";
import { Button, Menu, Separator, TextField, Title } from "@prisma/lens";
import { CheckSquare, Edit, MoreVertical, Trash2 } from "react-feather";
import { FIELDS } from "../../../../../lib/fields";
import { prismaTypesToIcons } from "../../../../../lib/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../../../../../lib/context";
import { Field, Model } from "../../../../../lib/types";

const Model = () => {
  const { schema, setSchema } = useSchemaContext();
  const { query, asPath, push } = useRouter();
  const { id } = query;

  const model = schema.models?.[id as string];

  const [editingField, setEditingField] = useState<string>();
  const [addingField, setAddingField] = useState<string>();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState<string>("");

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

  return (
    <>
      <AddField
        onClose={() => setAddingField(undefined)}
        defaultType={addingField ?? ""}
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
          {}
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
                  <Title>{name}</Title>
                )}
                <button
                  onClick={() => {
                    if (editingName && name !== model.name) {
                      if (schema.models.some((m: Model) => m.name === name)) {
                        toast.error(`A model called ${name} already exists`);
                        setName(model.name);
                      } else {
                        updateModel({ name });
                      }
                    }
                    setEditingName(!editingName);
                  }}
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
                  <Menu.Option key="delete">Delete model</Menu.Option>
                </Menu.Body>
              </Menu.Container>
            </div>

            <Separator />

            <div className="flex space-x-8">
              <div className="flex flex-col space-y-3 flex-1 model-fields p-1 overflow-y-auto">
                {model?.fields?.map((field: Field) => {
                  const Icon = field.type
                    ? prismaTypesToIcons[field.type] ??
                      prismaTypesToIcons.Relation
                    : prismaTypesToIcons.default;

                  return (
                    <button
                      className="rounded-lg bg-white shadow-md text-left border border-transparent hover:border-blue-500 cursor-pointer transition py-3.5 px-4 flex items-center justify-between"
                      onClick={() => setEditingField(field.name)}
                      key={field.name}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-md bg-blue-100 flex items-center justify-center p-4">
                          <Icon className="text-blue-600" size={24} />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <h3 className="text-lg w-52 font-medium">
                            {field.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Tag>{field.type}</Tag>
                            {field.unique && <Tag>Unique</Tag>}
                            {field.required && <Tag>Required</Tag>}
                            {field.default && <Tag>{field.default}</Tag>}
                            {field.isId && <Tag>ID</Tag>}
                          </div>
                        </div>
                      </div>

                      <button
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
                      </button>
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 max-w-sm model-fields overflow-y-auto bg-gray-200 rounded-lg p-4 flex flex-col space-y-4">
                <h2 className="font-semibold text-xl">Add field</h2>

                <div className="flex flex-col space-y-3">
                  {[...FIELDS, ...schema.models].map((field) => {
                    const Icon = field.name
                      ? prismaTypesToIcons[field.name] ??
                        prismaTypesToIcons.Relation
                      : prismaTypesToIcons.default;

                    return (
                      <button
                        className="rounded-lg bg-white shadow-md text-left border border-transparent hover:border-blue-500 cursor-pointer transition py-3 px-4 flex items-center space-x-4"
                        onClick={() => setAddingField(field.name)}
                        key={field.name}
                      >
                        <div className="rounded-md bg-blue-100 flex items-center justify-center p-3">
                          <Icon className="text-blue-600" size={20} />
                        </div>

                        <div className="flex flex-col">
                          <h3 className="font-medium">{field.name}</h3>
                          <p className="text-sm text-gray-700">
                            {field.description}
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
