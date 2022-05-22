import Modal from "./Modal";
import { Button, Select, Separator, TextField } from "@prisma/lens";
import { TYPES } from "../lib/fields";
import { Field, FieldType, Model } from "../lib/types";
import { PRISMA_DEFAULT_VALUES } from "../lib/prisma";
import { useEffect, useState } from "react";
import { useSchemaContext } from "../lib/context";

type UpdateFieldProps = {
  onSubmit: (value: Field) => void;
  defaultValues: Field;
  onClose: () => void;
  open: boolean;
  model: Model;
};

const UpdateField = ({
  defaultValues,
  onSubmit,
  onClose,
  open,
  model,
}: UpdateFieldProps) => {
  const { schema } = useSchemaContext();

  const [isUpdatedAt, setIsUpdatedAt] = useState<boolean>(false);
  const [defaultValue, setDefaultValue] = useState<string>("");
  const [type, setType] = useState<FieldType>("" as FieldType);
  const [required, setRequired] = useState<boolean>(false);
  const [unique, setUnique] = useState<boolean>(false);
  const [isId, setIsId] = useState<boolean>(false);
  const [list, setList] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    setIsUpdatedAt(defaultValues.isUpdatedAt);
    setDefaultValue(defaultValues.default);
    setRequired(defaultValues.required);
    setUnique(defaultValues.unique);
    setList(defaultValues.list);
    setIsId(defaultValues.isId);
    setName(defaultValues.name);
    setType(defaultValues.type);
  }, [defaultValues]);

  const resetState = () => {
    setType("" as FieldType);
    setIsUpdatedAt(false);
    setDefaultValue("");
    setRequired(false);
    setUnique(false);
    setList(false);
    setIsId(false);
    setName("");
  };

  const enumType = schema.enums.find((e) => e.name === type && e.fields.length);

  return (
    <Modal
      open={open}
      onClose={() => {
        resetState();
        onClose();
      }}
      heading="Update field"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSubmit({
            ...defaultValues,
            default: defaultValue,
            isUpdatedAt,
            required,
            unique,
            isId,
            type,
            list,
            name,
          });
          resetState();
        }}
        className="flex flex-col space-y-4"
      >
        <TextField
          placeholder="published"
          onChange={setName}
          value={name}
          label="Name"
          autoFocus
        />
        <Select.Container
          defaultSelectedKey={type}
          onSelectionChange={(key) => {
            setDefaultValue("");
            setType(key);
          }}
          hint="The database type for the field"
          label="Type"
          key={type}
        >
          {[
            ...TYPES(schema.database),
            ...schema.models.map((m) => ({ ...m, description: "Model" })),
            ...schema.enums.map((m) => ({ ...m, description: "Enum" })),
          ].map((type) => (
            <Select.Option description={type.description} key={type.name}>
              {type.name}
            </Select.Option>
          ))}
        </Select.Container>
        {enumType || PRISMA_DEFAULT_VALUES(type).length ? (
          <Select.Container
            defaultSelectedKey={defaultValue}
            onSelectionChange={(key) => {
              setDefaultValue(key);
            }}
            hint="A Prisma default value function"
            label="Default value"
            key={defaultValue}
          >
            <Select.Option key="">No default value</Select.Option>
            {(
              enumType?.fields?.map((field) => ({
                description: "",
                value: field,
                label: field,
              })) || PRISMA_DEFAULT_VALUES(type)
            ).map((defaultValue) => (
              <Select.Option
                description={defaultValue.description}
                key={defaultValue.value}
              >
                {defaultValue.label}
              </Select.Option>
            ))}
          </Select.Container>
        ) : null}
        <div className="flex space-x-8 items-start py-2">
          <div className="flex flex-col space-y-3">
            <label
              className="font-medium text-sm text-gray-800"
              htmlFor="required"
            >
              Required
            </label>
            <input
              onChange={(e) => {
                setRequired(e.target.checked);
              }}
              checked={required}
              type="checkbox"
              id="required"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <label
              className="font-medium text-sm text-gray-800"
              htmlFor="unique"
            >
              Unique
            </label>
            <input
              onChange={(e) => {
                setUnique(e.target.checked);
              }}
              checked={unique}
              type="checkbox"
              id="unique"
            />
          </div>
          {type === "DateTime" && (
            <div className="flex flex-col space-y-3">
              <label
                className="font-medium text-sm text-gray-800"
                htmlFor="isUpdatedAt"
              >
                Updated At
              </label>
              <input
                onChange={(e) => {
                  setIsUpdatedAt(e.target.checked);
                }}
                checked={isUpdatedAt}
                type="checkbox"
                id="isUpdatedAt"
              />
            </div>
          )}
          <div className="flex flex-col space-y-3">
            <label className="font-medium text-sm text-gray-800" htmlFor="list">
              List
            </label>
            <input
              onChange={(e) => {
                setList(e.target.checked);
              }}
              checked={list}
              type="checkbox"
              id="list"
            />
          </div>
          {type === "String" && (
            <div className="flex flex-col space-y-3">
              <label
                className="font-medium text-sm text-gray-800"
                htmlFor="unique"
              >
                Is ID
              </label>
              <input
                disabled={model.fields.some(
                  (field) => field.isId && field.name !== defaultValues.name
                )}
                onChange={(e) => {
                  setIsId(e.target.checked);
                }}
                checked={isId}
                type="checkbox"
                id="isId"
              />
            </div>
          )}
        </div>
        <Button isDisabled={!name || !type} fillParent>
          Update field
        </Button>
        <Button
          variant="secondary"
          fillParent
          onPress={() => {
            resetState();
            onClose();
          }}
        >
          Cancel
        </Button>
      </form>
    </Modal>
  );
};

export default UpdateField;
