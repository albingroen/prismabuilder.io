import Modal from "./Modal";
import { Button, Select, TextField } from "@prisma/lens";
import { FIELDS } from "../lib/fields";
import { Field, Model } from "../lib/types";
import { PRISMA_DEFAULT_VALUE_FNS } from "../lib/prisma";
import { useEffect, useState } from "react";
import { useSchemaContext } from "../lib/context";

type AddFieldProps = {
  onSubmit: (value: Field) => void;
  defaultType: string;
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

  const [defaultValue, setDefaultValue] = useState<string>("");
  const [required, setRequired] = useState<boolean>(false);
  const [unique, setUnique] = useState<boolean>(false);
  const [isId, setIsId] = useState<boolean>(false);
  const [list, setList] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setDefaultValue("");
        setRequired(false);
        setUnique(false);
        setList(false);
        setIsId(false);
        setName("");
        setType("");
        onClose();
      }}
      heading="New field"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSubmit({
            relationField: schema.models.some((model) => model.name === type),
            default: defaultValue,
            documentation: "",
            kind: "",
            required,
            unique,
            isId,
            type,
            list,
            name,
          });
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
            setType(key);
          }}
          hint="The database type for the field"
          label="Type"
          key={type}
        >
          {[...FIELDS, ...schema.models].map((field) => (
            <Select.Option description={field.description} key={field.name}>
              {field.name}
            </Select.Option>
          ))}
        </Select.Container>
        <Select.Container
          defaultSelectedKey={defaultValue}
          onSelectionChange={(key) => {
            setDefaultValue(key);
          }}
          hint="A Prisma default value function"
          label="Default value"
        >
          {PRISMA_DEFAULT_VALUE_FNS.map((field) => (
            <Select.Option description={field.description} key={field.value}>
              {field.label}
            </Select.Option>
          ))}
        </Select.Container>
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
          <div className="flex flex-col space-y-3">
            <label
              className="font-medium text-sm text-gray-800"
              htmlFor="unique"
            >
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
      </form>
    </Modal>
  );
};

export default AddField;
