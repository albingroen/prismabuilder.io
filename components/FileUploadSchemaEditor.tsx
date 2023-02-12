import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@prisma/lens";
import { Enum, Model } from "../lib/types";
import { apiUrl } from "../lib/config";
import { useSchemaContext } from "../lib/context";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type ImportSchemaProps = {
  onClose: () => void;
};

const FileUploadSchemaEditor = ({ onClose }: ImportSchemaProps) => {
  const { schema, setSchema } = useSchemaContext();

  const [importSchemaLoading, setImportSchemaLoading] =
    useState<boolean>(false);
  const [importSchema, setImportSchema] = useState<string>("");

  const onDropAccepted = useCallback(
    ([firstAcceptedFile]) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImportSchema(reader.result.toString());
        }
      };
      reader.readAsText(firstAcceptedFile);
    },
    [setImportSchema]
  );

  const onDropRejected = useCallback(() => {
    toast.error("Invalid file format. The file extension should be '.prisma'.");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "text/plain": [".prisma"],
    },
    onDropRejected,
    onDropAccepted,
  });

  return (
    <div>
      <div>
        <div
          {...getRootProps({
            className: `flex p-8 mt-3 justify-center content-center border-dashed rounded-md border-2 ${
              isDragActive ? "border-grey-300 bg-blue-50" : "border-blue-300"
            }`,
          })}
        >
          <p className="text-sm px-14 text-center text-gray-800">
            Drag a file here or click to browse
          </p>
          <input {...getInputProps()} />
        </div>
        <textarea
          autoFocus
          value={importSchema}
          disabled={importSchemaLoading}
          onChange={(e) => {
            setImportSchema(e.target.value);
          }}
          className="font-mono h-96 w-full my-4 border rounded-lg resize-none p-4 whitespace-pre overflow-auto"
        />
      </div>
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

export default FileUploadSchemaEditor;
