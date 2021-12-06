import { TextField, Label, Button, Separator } from "@prisma/lens";
import { Trash2 } from "react-feather";
import { useState } from "react";
import { useSchemaContext } from "../lib/context";

type AddEnumProps = {
  onCancel: () => void;
};

const AddEnum = ({ onCancel }: AddEnumProps) => {
  const { schema, setSchema } = useSchemaContext();

  const [fields, setFields] = useState<string[]>([""]);
  const [name, setName] = useState<string>("");

  const handleSubmit = () => {
    setSchema({
      ...schema,
      enums: [...schema.enums, { name, fields }],
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
                  className="text-red-400 hover:text-red-500 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={() => {
          setFields([...fields, ""]);
        }}
        variant="secondary"
      >
        Add value +
      </Button>

      <Separator />

      <Button
        isDisabled={!name || fields.some((v) => !v) || !fields.length}
        onClick={handleSubmit}
      >
        Create enum
      </Button>

      <Button onClick={onCancel} variant="secondary">
        Cancel
      </Button>
    </div>
  );
};

export default AddEnum;
