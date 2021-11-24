import Link from "next/link";
import Modal from "./Modal";
import Schema from "./Schema";
import { Button, Separator, Card } from "@prisma/lens";
import { ID_FIELD } from "../lib/fields";
import { Layers } from "react-feather";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../lib/context";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Models() {
  const { schema, setSchema } = useSchemaContext();
  const router = useRouter();

  const [showingSchema, setShowingSchema] = useState<boolean>(false);

  return (
    <div className="flex flex-col border flex-1 max-w-sm h-screen overflow-y-auto p-4 space-y-3 bg-gray-100">
      {schema.models.map((model, i) => (
        <Link href={`/models/${i}`} key={model.name}>
          <a>
            <Card className="border border-transparent hover:border-blue-500 cursor-pointer transition flex items-center space-x-3">
              <Layers size={20} className="text-gray-500" />
              <h3>{model.name}</h3>
            </Card>
          </a>
        </Link>
      ))}

      {schema.models.length ? <Separator /> : null}

      <Button
        onClick={() => {
          if (schema.models.some((model) => model.name === "New")) {
            toast.error("A model called New already exists");
          } else {
            const newSchema = {
              ...schema,
              models: [
                ...schema.models,
                {
                  name: "New",
                  fields: [ID_FIELD],
                  enums: [],
                },
              ],
            };
            setSchema(newSchema);
            router.push(`/models/${newSchema.models.length - 1}`);
          }
        }}
        variant="secondary"
      >
        New model
      </Button>

      {schema.models.length ? (
        <Button
          onClick={() => {
            setShowingSchema(true);
          }}
        >
          Generate schema
        </Button>
      ) : null}

      {showingSchema && (
        <Modal
          onClose={() => setShowingSchema(false)}
          open={showingSchema}
          heading="Schema"
        >
          <Schema />
        </Modal>
      )}
    </div>
  );
}
