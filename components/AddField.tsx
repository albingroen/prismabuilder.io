import Modal from "./Modal";
import { Button, Select, TextField } from "@prisma/lens";
import { TYPES } from "../lib/fields";
import { Field, FieldType, Model } from "../lib/types";
import { PRISMA_DEFAULT_VALUES } from "../lib/prisma";
import { useEffect, useState } from "react";
import { useSchemaContext } from "../lib/context";

type AddFieldProps = {
  onSubmit: (value: Field) => void;
  defaultType: FieldType;
  onClose: () => void;
  open: boolean;
  model: Model;
};

const AddField = ({
  defaultType,
  onSubmit,
  onClose,
  model,
  open,
}: AddFieldProps) => {
  const { schema } = useSchemaContext();

  const [isCustomDefaultValue, setIsCustomDefaultValue] =
    useState<boolean>(false);
  const [isUpdatedAt, setIsUpdatedAt] = useState<boolean>(false);
  const [type, setType] = useState<FieldType>("" as FieldType);
  const [defaultValue, setDefaultValue] = useState<string>("");
  const [required, setRequired] = useState<boolean>(false);
  const [unique, setUnique] = useState<boolean>(false);
  const [isId, setIsId] = useState<boolean>(false);
  const [list, setList] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

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
      heading="New field"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSubmit({
            relationField: schema.models.some(
              (model: Model) => model.name === type
            ),
            default: defaultValue,
            documentation: "",
            isUpdatedAt,
            kind: "",
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

        <Select.Container
          defaultSelectedKey={defaultValue}
          onSelectionChange={(key) => {
            if (key === "custom") {
              setIsCustomDefaultValue(true);
            } else {
              setIsCustomDefaultValue(false);
              setDefaultValue(key);
            }
          }}
          hint="A Prisma default value function"
          label="Default value"
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
          <Select.Option key="custom" description="Add a custom default value">
            Custom default value
          </Select.Option>
        </Select.Container>

        {isCustomDefaultValue && (
          <TextField label="Custom default value" onChange={setDefaultValue} />
        )}

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
          {type === "String" && !model.fields.some((field) => field.isId) && (
            <div className="flex flex-col space-y-3">
              <label
                className="font-medium text-sm text-gray-800"
                htmlFor="unique"
              >
                Is ID
              </label>
              <input
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
          Add field
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

export default AddField;
