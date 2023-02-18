import toast from "react-hot-toast";
import { Button } from "@prisma/lens";
import { Enum } from "../lib/types";
import { useSchemaContext } from "../lib/context";
import React, { useState } from "react";
import { parseSchema } from "../lib/schemaApi";
import { isModuleColliding } from "../lib/isModuleColliding";

type ImportSchemaProps = {
  onClose: () => void;
};

const ManualSchemaEditor = ({ onClose }: ImportSchemaProps) => {
  const { schema, setSchema } = useSchemaContext();

  const [importSchemaLoading, setImportSchemaLoading] =
    useState<boolean>(false);
  const [importSchema, setImportSchema] = useState<string>("");

  return (
    <div>
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
          parseSchema(importSchema)
            .then((importedSchema) => {
              if (isModuleColliding(schema, importedSchema)) {
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

export default ManualSchemaEditor;
