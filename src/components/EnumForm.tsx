import Button from "./Button";
import Input from "./Input";
import Label from "./Label";
import Stack from "./Stack";
import { Enum } from "../types";
import { FormEvent, useState } from "react";
import { TrashIcon } from "@heroicons/react/outline";
import { v4 as uuid } from "uuid";

interface EnumFormProps {
  onSubmit: (values: Enum) => void;
  onDelete?: () => void;
  defaultValues?: Enum;
  onCancel: () => void;
  cta: string;
}

export default function EnumForm({
  defaultValues,
  onCancel,
  onSubmit,
  onDelete,
  cta,
}: EnumFormProps) {
  const [fields, setFields] = useState<string[]>(defaultValues?.fields || [""]);
  const [name, setName] = useState<string>(defaultValues?.name || "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!name) return;

    onSubmit({
      id: uuid(),
      fields,
      name,
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
        <Stack direction="vertical" className="!gap-6">
          <Input
            placeholder="Role"
            label="Enum name"
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
            value={name}
            type="text"
            required
            block
          />

          <Stack direction="vertical" spacing="large">
            <Stack direction="vertical" spacing="mini">
              <Label formLabel>Enum values*</Label>

              {fields.length ? (
                <Stack direction="vertical">
                  {fields.map((value, i) => (
                    <Stack align="center" spacing="none" key={i}>
                      <Input
                        placeholder="ADMIN"
                        className="flex-1"
                        value={value}
                        onChange={(e) => {
                          setFields(
                            fields.map((v, vi) =>
                              vi === i ? e.currentTarget.value : v
                            )
                          );
                        }}
                        required
                        block
                      />
                      <button
                        onClick={() => {
                          setFields(fields.filter((_, vi) => vi !== i));
                        }}
                        className="pl-3 py-2.5"
                        type="button"
                      >
                        <TrashIcon className="w-4 text-red-500" />
                      </button>
                    </Stack>
                  ))}
                </Stack>
              ) : null}
            </Stack>

            <Button
              onClick={() => {
                setFields([...fields, ""]);
              }}
              type="button"
            >
              Add value
            </Button>
          </Stack>
        </Stack>

        <Stack align="center" justify="end" className="!mt-3">
          {onDelete && (
            <Button type="button" onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name} variant="primary">
            {cta}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
