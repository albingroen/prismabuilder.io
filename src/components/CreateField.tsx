import Input from "./Input";
import Select from "./Select";
import Stack from "./Stack";
import { FieldType } from "../types";
import { TYPES } from "../lib/types";
import { useState } from "react";
import Button from "./Button";

interface CreateFieldProps {
  defaultType?: FieldType;
}

export default function CreateField({ defaultType }: CreateFieldProps) {
  const [type, setType] = useState<FieldType | undefined>(defaultType);
  const [required, setRequired] = useState<boolean>(false);
  const [unique, setUnique] = useState<boolean>(false);
  const [list, setList] = useState<boolean>(false);
  const [isId, setIsId] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  return (
    <Stack direction="vertical" className="w-full" spacing="large">
      <Stack direction="vertical" className="w-full">
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
          {TYPES.map((type) => (
            <Select.Option>{type.name}</Select.Option>
          ))}
        </Select>

        <Select label="Default value">
          {TYPES.map((type) => (
            <Select.Option>{type.name}</Select.Option>
          ))}
        </Select>
      </Stack>

      <Stack spacing="huge" align="start">
        <Stack direction="vertical" align="center" spacing="small" className="">
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

        <Stack direction="vertical" align="center" spacing="small" className="">
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

        <Stack direction="vertical" align="center" spacing="small" className="">
          <label htmlFor="list" className="text-center text-sm text-stone-500">
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

        <Stack direction="vertical" align="center" spacing="small" className="">
          <label htmlFor="isId" className="text-center text-sm text-stone-500">
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

      <Button className="!mt-3">Add field</Button>
    </Stack>
  );
}
