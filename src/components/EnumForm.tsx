import { TrashIcon } from "@heroicons/react/outline";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Label from "./Label";
import Stack from "./Stack";

interface EnumFormProps {
  onCancel: () => void;
  cta: string;
}

export default function EnumForm({ onCancel, cta }: EnumFormProps) {
  const [values, setValues] = useState<string[]>([""]);
  const [name, setName] = useState<string>("");

  return (
    <form
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

              {values.length ? (
                <Stack direction="vertical">
                  {values.map((value, i) => (
                    <Stack align="center" spacing="none">
                      <Input
                        key={`${name}-${i}`}
                        placeholder="ADMIN"
                        className="flex-1"
                        required
                        block
                      />
                      <button
                        onClick={() => {
                          setValues(values.filter((_, vi) => vi !== i));
                        }}
                        className="pl-3 py-2.5"
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
                setValues([...values, ""]);
              }}
              type="button"
            >
              Add value
            </Button>
          </Stack>
        </Stack>

        <Stack align="center" justify="end" className="!mt-3">
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
