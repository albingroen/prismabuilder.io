import Button from "./Button";
import Checkbox from "./Checkbox";
import Input from "./Input";
import Select from "./Select";
import Stack from "./Stack";
import { Field, FieldType, Model, Schema } from "../types";
import { PRISMA_DEFAULT_VALUES } from "../lib/prisma";
import { TYPES } from "../lib/fields";
import { useState, FormEvent } from "react";
import { v4 as uuid } from "uuid";

interface FieldFormProps {
  onSubmit: (field: Field) => void;
  defaultValues?: Field;
  onCancel: () => void;
  schema: Schema;
  cta: string;
}

export default function FieldForm({
  defaultValues,
  onCancel,
  onSubmit,
  schema,
  cta,
}: FieldFormProps) {
  const [isUpdatedAt, setIsUpdatedAt] = useState<boolean>(
    defaultValues?.isUpdatedAt || false
  );
  const [defaultValue, setDefaultValue] = useState<string>(
    defaultValues?.default || ""
  );
  const [type, setType] = useState<FieldType>(
    defaultValues?.type || ("" as FieldType)
  );
  const [required, setRequired] = useState<boolean>(
    defaultValues?.required || false
  );
  const [unique, setUnique] = useState<boolean>(defaultValues?.unique || false);
  const [list, setList] = useState<boolean>(defaultValues?.list || false);
  const [isId, setIsId] = useState<boolean>(defaultValues?.isId || false);
  const [name, setName] = useState<string>(defaultValues?.name || "");

  const enumType = schema.enums.find((e) => e.name === type && e.fields.length);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!type) return;

    onSubmit({
      relationField: schema.models.some((model: Model) => model.name === type),
      default: defaultValue,
      documentation: "",
      isUpdatedAt,
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
    <form
      onSubmit={handleSubmit}
      autoCapitalize="off"
      className="w-full"
      autoComplete="off"
      autoCorrect="off"
    >
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
            <Checkbox
              onChange={(e) => {
                setRequired(e.currentTarget.checked);
              }}
              checked={required}
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
            <Checkbox
              onChange={(e) => {
                setUnique(e.currentTarget.checked);
              }}
              checked={unique}
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
            <Checkbox
              onChange={(e) => {
                setList(e.currentTarget.checked);
              }}
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
              title="This will mark this field as the ID of the model"
              className="text-center text-sm text-stone-500"
              htmlFor="isId"
            >
              Id
            </label>
            <Checkbox
              onChange={(e) => {
                setIsId(e.currentTarget.checked);
              }}
              checked={isId}
              id="isId"
            />
          </Stack>

          <Stack
            direction="vertical"
            align="center"
            spacing="small"
            className=""
          >
            <label
              title="This will set the value as the current date each time a row of this model is updated"
              className="text-center text-sm text-stone-500"
              htmlFor="isUpdatedAt"
            >
              Updated at
            </label>
            <Checkbox
              onChange={(e) => {
                setIsUpdatedAt(e.currentTarget.checked);
              }}
              checked={isUpdatedAt}
              id="isUpdatedAt"
            />
          </Stack>
        </Stack>

        <Stack align="center" justify="end" className="!mt-3">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name || !type} variant="primary">
            {cta}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
