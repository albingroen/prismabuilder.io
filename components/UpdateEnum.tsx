import { TextField, Label, Button, Separator } from "@prisma/lens";
import { Trash2 } from "react-feather";
import { useEffect, useState } from "react";
import { useSchemaContext } from "../lib/context";
import { Enum } from "../lib/types";

type UpdateEnumProps = {
  onCancel: () => void;
  defaultValues: Enum;
};

const UpdateEnum = ({ onCancel, defaultValues }: UpdateEnumProps) => {
  const { schema, setSchema } = useSchemaContext();

  const [fields, setFields] = useState<string[]>([""]);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    setFields(defaultValues.fields);
    setName(defaultValues.name);
  }, [defaultValues]);

  const handleSubmit = () => {
    setSchema({
      ...schema,
      enums: schema.enums.map((e) =>
        e.name === defaultValues.name ? { fields, name } : e
      ),
      models: schema.models.map((model) => ({
        ...model,
        fields: model.fields.map((field) =>
          field.type === defaultValues.name
            ? {
                ...field,
                type: name,
              }
            : field
        ),
      })),
    });

    onCancel();
  };

  const handleDelete = () => {
    setSchema({
      ...schema,
      enums: schema.enums.filter((e) => e.name !== defaultValues.name),
      models: schema.models.map((model) => ({
        ...model,
        fields: model.fields.filter(
          (field) => field.type !== defaultValues.name
        ),
      })),
    });

    onCancel();
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col space-y-6">
        <TextField
          hint="The database name for the enum"
          onChange={setName}
          placeholder="Role"
          label="Enum name"
          value={name}
          autoFocus
        />

        <div className="flex flex-col space-y-3">
          <Label>Enum values</Label>

          <div className="flex flex-col space-y-2">
            {fields.map((value, i) => (
              <div key={i} className="flex items-center space-x-4">
                <TextField
                  value={value}
                  onChange={(e) => {
                    setFields(fields.map((v, vi) => (vi === i ? e : v)));
                  }}
                  autoFocus={i === fields.length - 1 && fields.length > 1}
                  placeholder="ADMIN"
                />

                <button
                  onClick={() => {
                    setFields(fields.filter((_, vi) => vi !== i));
                  }}
                  className="text-red-400 hover:text-red-500 transition focus:ring-2"
                  aria-label="Delete enum value"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        onPress={() => {
          setFields([...fields, ""]);
        }}
        variant="secondary"
      >
        Add value +
      </Button>

      <Separator />

      <Button
        isDisabled={!name || fields.some((v) => !v) || !fields.length}
        onPress={handleSubmit}
      >
        Update enum
      </Button>

      <Button onPress={onCancel} variant="secondary">
        Cancel
      </Button>

      <Separator />

      <Button onPress={handleDelete} variant="negative">
        Delete enum
      </Button>
    </div>
  );
};

export default UpdateEnum;
