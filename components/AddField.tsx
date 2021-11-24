import Modal from "./Modal";
import { Button, Select, TextField } from "@prisma/lens";
import { FIELDS } from "../lib/fields";
import { Field } from "../lib/types";
import { PRISMA_DEFAULT_VALUE_FNS } from "../lib/prisma";
import { useEffect, useState } from "react";

type AddFieldProps = {
  onSubmit: (value: Field) => void;
  defaultType: string;
  onClose: () => void;
  open: boolean;
};

const AddField = ({ onSubmit, defaultType, open, onClose }: AddFieldProps) => {
  const [defaultValue, setDefaultValue] = useState<string>("");
  const [required, setRequired] = useState<boolean>(false);
  const [unique, setUnique] = useState<boolean>(false);
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
            default: defaultValue,
            relationField: false,
            documentation: "",
            list: false,
            isId: false,
            kind: "",
            required,
            unique,
            type,
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
          {FIELDS.map((field) => (
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
          hint="A Prisma deafault value function"
          label="Default value"
        >
          {PRISMA_DEFAULT_VALUE_FNS.map((field) => (
            <Select.Option description={field.description} key={field.value}>
              {field.label}
            </Select.Option>
          ))}
        </Select.Container>
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
          <label className="font-medium text-sm text-gray-800" htmlFor="unique">
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
        <Button isDisabled={!name || !type} fillParent>
          Add field
        </Button>
      </form>
    </Modal>
  );
};

export default AddField;
