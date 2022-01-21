import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@prisma/lens";
import { Enum, Model } from "../lib/types";
import { apiUrl } from "../lib/config";
import { useSchemaContext } from "../lib/context";
import { useState } from "react";

type ImportSchemaProps = {
  onClose: () => void;
};

const ImportSchema = ({ onClose }: ImportSchemaProps) => {
  const { schema, setSchema } = useSchemaContext();

  const [importSchemaLoading, setImportSchemaLoading] =
    useState<boolean>(false);
  const [importSchema, setImportSchema] = useState<string>("");

  return (
    <div>
      <p className="text-sm text-gray-700">
        Be wary that importing a schema will omit any default values on fields.
      </p>
      <textarea
        autoFocus
        value={importSchema}
        onChange={(e) => {
          setImportSchema(e.target.value);
        }}
        className="font-mono h-96 w-full my-4 border rounded-lg resize-none p-4 whitespace-pre overflow-auto"
      />
      <Button
        onPress={() => {
          setImportSchemaLoading(true);
          axios
            .post(`${apiUrl}/parse`, { schema: importSchema })
            .then((res) => {
              const importedSchema = res.data;
              if (
                schema.models.some((model: Model) =>
                  importedSchema.models
                    .map((m: Model) => m.name)
                    .includes(model.name)
                )
              ) {
                toast.error("Some model has a colliding name");
                setImportSchemaLoading(false);
              } else if (
                schema.enums.some((enumValue: Enum) =>
                  importedSchema.enums
                    .map((e: Enum) => e.name)
                    .includes(enumValue.name)
                )
              ) {
                toast.error("Some enum has a colliding name");
                setImportSchemaLoading(false);
              } else if (importedSchema.models?.length) {
                setSchema({
                  ...schema,
                  models: [...schema.models, ...importedSchema.models],
                  enums: [...schema.enums, ...(importedSchema.enums ?? [])],
                });
                setImportSchemaLoading(false);
                setImportSchema("");
                onClose();
              } else {
                toast.error("Make sure to import a full schema");
                setImportSchemaLoading(false);
              }
            })
            .catch(() => {
              toast.error("Failed to import schema");
              setImportSchemaLoading(false);
            });
        }}
        isLoading={importSchemaLoading}
      >
        Import schema
      </Button>
    </div>
  );
};

export default ImportSchema;
