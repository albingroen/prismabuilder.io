import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Stack from "./Stack";
import { Field, FieldType, Model, Schema } from "../types";
import { FormEvent, useState } from "react";
import { PRISMA_DEFAULT_VALUES } from "../lib/prisma";
import { TYPES } from "../lib/fields";
import { v4 as uuid } from "uuid";

interface CreateFieldProps {
  onSubmit: (field: Field) => void;
  defaultType?: FieldType;
  onCancel: () => void;
  schema: Schema;
}

export default function CreateField({
  defaultType,
  onCancel,
  onSubmit,
  schema,
}: CreateFieldProps) {
  const [type, setType] = useState<FieldType>(defaultType ?? ("" as FieldType));
  const [defaultValue, setDefaultValue] = useState<string>("");
  const [required, setRequired] = useState<boolean>(false);
  const [unique, setUnique] = useState<boolean>(false);
  const [list, setList] = useState<boolean>(false);
  const [isId, setIsId] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const enumType = schema.enums.find((e) => e.name === type && e.fields.length);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!type) return;

    onSubmit({
      relationField: schema.models.some((model: Model) => model.name === type),
      default: defaultValue,
      documentation: "",
      id: uuid(),
      required,
      kind: "",
      unique,
      list,
      name,
      type,
      isId,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Stack direction="vertical" spacing="large">
        <Stack direction="vertical">
          <Input
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
            placeholder="id"
            value={name}
            label="Name"
            type="text"
            block
          />

          <Select
            label="Type"
            defaultValue={type}
            onChange={(e) => {
              setType(e.currentTarget.value as FieldType);
            }}
          >
            {[
              ...TYPES(schema.database),
              ...schema.models.map((m) => ({ ...m, description: "Model" })),
              ...schema.enums.map((m) => ({ ...m, description: "Enum" })),
            ].map((type) => (
              <Select.Option key={type.name} value={type.name}>
                {type.name}
              </Select.Option>
            ))}
          </Select>

          {enumType || PRISMA_DEFAULT_VALUES(type).length ? (
            <Select
              onChange={(e) => {
                setDefaultValue(e.currentTarget.value);
              }}
              label="Default value"
              value={defaultValue}
            >
              <Select.Option value={undefined}>No default value</Select.Option>
              {(
                enumType?.fields?.map((field) => ({
                  description: "",
                  value: field,
                  label: field,
                })) || PRISMA_DEFAULT_VALUES(type)
              ).map((defaultValue) => (
                <Select.Option
                  value={defaultValue.value}
                  key={defaultValue.value}
                >
                  {defaultValue.label}
                </Select.Option>
              ))}
            </Select>
          ) : null}
        </Stack>

        <Stack spacing="huge" align="start">
          <Stack
            direction="vertical"
            align="center"
            spacing="small"
            className=""
          >
            <label
              htmlFor="required"
              className="text-center text-sm text-stone-500"
            >
              Required
            </label>
            <input
              onChange={(e) => {
                setRequired(e.currentTarget.checked);
              }}
              className="rounded border-stone-400"
              checked={required}
              type="checkbox"
              id="required"
            />
          </Stack>

          <Stack
            direction="vertical"
            align="center"
            spacing="small"
            className=""
          >
            <label
              htmlFor="unique"
              className="text-center text-sm text-stone-500"
            >
              Unique
            </label>
            <input
              onChange={(e) => {
                setUnique(e.currentTarget.checked);
              }}
              className="rounded border-stone-400"
              checked={unique}
              type="checkbox"
              id="unique"
            />
          </Stack>

          <Stack
            direction="vertical"
            align="center"
            spacing="small"
            className=""
          >
            <label
              htmlFor="list"
              className="text-center text-sm text-stone-500"
            >
              List
            </label>
            <input
              onChange={(e) => {
                setList(e.currentTarget.checked);
              }}
              className="rounded border-stone-400"
              type="checkbox"
              checked={list}
              id="list"
            />
          </Stack>

          <Stack
            direction="vertical"
            align="center"
            spacing="small"
            className=""
          >
            <label
              htmlFor="isId"
              className="text-center text-sm text-stone-500"
            >
              Is ID
            </label>
            <input
              onChange={(e) => {
                setIsId(e.currentTarget.checked);
              }}
              className="rounded border-stone-400"
              type="checkbox"
              checked={isId}
              id="isId"
            />
          </Stack>
        </Stack>

        <Stack align="center" justify="end" className="!mt-3">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name || !type} variant="primary">
            Add field
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
