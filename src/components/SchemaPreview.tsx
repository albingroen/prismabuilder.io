import Button from "./Button";
import Stack from "./Stack";
import { ClipboardCopyIcon } from "@heroicons/react/outline";
import { Schema } from "../types";
import { message } from "@tauri-apps/api/dialog";
import { useEffect, useState } from "react";
import { API_URL } from "../lib/config";
import axios, { AxiosError } from "axios";

interface SchemaPreviewProps {
  onCancel?: () => void;
  schema: Schema;
}

export default function SchemaPreview({
  onCancel,
  schema,
}: SchemaPreviewProps) {
  const [schemaString, setSchemaString] = useState<string>("");
  const [error, setError] = useState<AxiosError>();

  useEffect(() => {
    axios
      .post(`${API_URL}/generate`, {
        schema,
      })
      .then((res) => {
        setSchemaString(res.data);
      })
      .catch(setError);
  }, [schema]);

  return (
    <Stack
      direction="vertical"
      className="w-full"
      spacing="large"
      align="start"
    >
      <Button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(schemaString);
            message("Successfully copied the schema string to your clipboard!");
          } catch {
            message("Failed to copy the schema string to your clipboard...");
          }
        }}
        variant="primary"
      >
        <span>Copy to clipboard</span> <ClipboardCopyIcon className="w-3.5" />
      </Button>

      {schemaString ? (
        <code className="text-sm p-4 overflow-auto bg-stone-100 border border-stone-200 rounded-md w-full">
          <pre>{schemaString}</pre>
        </code>
      ) : error ? (
        <p>{error.message}</p>
      ) : null}

      {onCancel && (
        <Stack className="w-full" justify="end">
          <Button
            onClick={() => {
              if (onCancel) {
                onCancel();
              }
            }}
          >
            Cancel
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
