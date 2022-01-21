import axios from "axios";
import toast from "react-hot-toast";
import { Button, Loader } from "@prisma/lens";
import { SchemaContext } from "../lib/context";
import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../lib/config";

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
              onPress={() => {
                try {
                  navigator.clipboard.writeText(result);
                  toast.success("Copied schema to clipboard");
                } catch {
                  toast.error("Failed to copy to clipboard");
                }
              }}
            >
              Copy to clipboard
            </Button>
          </div>
          <pre className="bg-gray-200 overflow-auto p-4 rounded-md">
            {result}
          </pre>
          <Button onPress={onCancel} variant="secondary">
            Cancel
          </Button>
        </div>
      ) : (
        loading && (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        )
      )}
    </div>
  );
};

export default Schema;
