import Button from "./Button";
import Spinner from "./Spinner";
import Stack from "./Stack";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipboardIcon } from "@heroicons/react/24/solid";
import { SchemaContext } from "../lib/context";
import { apiUrl } from "../lib/config";
import { useContext, useEffect, useState } from "react";
import { copyToClipboard } from "../lib/utils";

type SchemaProps = {
  onCancel: () => void;
};

const Schema = ({ onCancel }: SchemaProps) => {
  const { schema } = useContext(SchemaContext);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("");

  useEffect(() => {
    axios
      .post(`${apiUrl}/generate`, { schema })
      .then((res) => {
        setResult(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to generate schema");
        setLoading(false);
      });
  }, [schema]);

  return (
    <div>
      {result ? (
        <div className="flex flex-col space-y-4">
          <div>
            <Button
              icon={ClipboardIcon}
              onClick={() => {
                copyToClipboard(result, "schema");
              }}
            >
              Copy to clipboard
            </Button>
          </div>
          <pre className="max-h-[500px] bg-gray-200 dark:bg-neutral-800 overflow-auto p-4 rounded-md overflow-auto">
            {result}
          </pre>
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        </div>
      ) : (
        loading && (
          <Stack align="center" justify="center" className="h-64">
            <Spinner />
          </Stack>
        )
      )}
    </div>
  );
};

export default Schema;
