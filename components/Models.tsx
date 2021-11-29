import ImportSchema from "./ImportSchema";
import Link from "next/link";
import Modal from "./Modal";
import Schema from "./Schema";
import toast from "react-hot-toast";
import { Button, Separator, Card, Title, TextField } from "@prisma/lens";
import { ID_FIELD } from "../lib/fields";
import { Globe, Box, X, Edit, CheckSquare } from "react-feather";
import { Model } from "../lib/types";
import { useRouter } from "next/dist/client/router";
import { useSchemaContext } from "../lib/context";
import { useEffect, useState } from "react";

export default function Models() {
  const { schema, schemas, setSchema } = useSchemaContext();
  const { push, pathname, asPath } = useRouter();

  const [showingImportSchema, setShowingImportSchema] =
    useState<boolean>(false);
  const [showingSchema, setShowingSchema] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const isGraphView = pathname.endsWith("/graph");

  useEffect(() => {
    if (schema?.name) {
      setName(schema.name);
    }
  }, [schema]);

  useEffect(() => {
    setEditingName(false);
  }, [asPath]);

  const updateSchema = (values: any) => {
    setSchema({
      ...schema,
      ...values,
    });
  };

  return (
    <>
      <div className="flex flex-col border flex-1 max-w-sm h-screen overflow-y-auto p-4 space-y-3 bg-gray-100">
        <div className="flex flex-col space-y-3 flex-1">
          <div>
            <Link href="/">
              <a className="text-sm text-blue-500 hover:text-blue-700 transition">
                &larr; Change schema
              </a>
            </Link>
          </div>

          <Separator />

          <div
            className={`flex justify-between ${
              editingName ? "items-end" : "items-center"
            }`}
          >
            {editingName ? (
              <div>
                <TextField
                  onChange={setName}
                  placeholder="Blog"
                  inputMode="text"
                  label="Name"
                  value={name}
                  autoFocus
                />
              </div>
            ) : (
              <Title>{name}</Title>
            )}

            <button
              onClick={() => {
                if (editingName && name !== schema.name) {
                  if (schemas.some((m: Model) => m.name === name)) {
                    toast.error(`A schema called ${name} exists`);
                    setName(schema.name);
                  } else {
                    updateSchema({ name });
                    push(`/schemas/${name}`);
                  }
                }
                setEditingName(!editingName);
              }}
            >
              {editingName ? (
                <CheckSquare
                  className="text-gray-700 hover:text-gray-900 transition"
                  size={20}
                />
              ) : (
                <Edit
                  className="text-gray-700 hover:text-gray-900 transition"
                  size={20}
                />
              )}
            </button>
          </div>

          {schema.models.map((model: Model, i: number) => {
            return (
              <Link
                href={`/schemas/${schema.name}/models/${i}`}
                key={model.name}
              >
                <a>
                  <Card className="border border-transparent hover:border-blue-500 cursor-pointer transition flex items-center space-x-3">
                    <Box size={20} className="text-gray-500" />
                    <h3>{model.name}</h3>
                  </Card>
                </a>
              </Link>
            );
          })}

          {schema.models.length ? <Separator /> : null}

          <Button
            onClick={() => {
              if (schema.models.some((model: Model) => model.name === "New")) {
                toast.error("A model called New exists");
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
                push(
                  `/schemas/${schema.name}/models/${
                    newSchema.models.length - 1
                  }`
                );
              }
            }}
            variant="secondary"
          >
            New model
          </Button>

          <Button
            onClick={() => {
              setShowingImportSchema(true);
            }}
            variant="secondary"
          >
            Import schema
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
        </div>

        <div className="flex flex-col space-y-4 items-start">
          <Link
            passHref
            href={
              isGraphView
                ? `/schemas/${schema.name}`
                : `/schemas/${schema.name}/graph`
            }
          >
            <a
              className="text-gray-500 hover:text-gray-700 transition"
              title={isGraphView ? "Exit Graph view" : "Graph view"}
            >
              {isGraphView ? <X /> : <Globe />}
            </a>
          </Link>
          <div className="divide-x text-sm text-gray-600 justify-self-end">
            <a
              className="hover:underline hover:text-gray-700 pr-3"
              href="https://albingroen.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Creator
            </a>

            <a
              href="https://github.com/albingroen/prismabuilder.io"
              className="hover:underline hover:text-gray-700 pl-3"
              rel="noopener noreferrer"
              target="_blank"
            >
              Source code
            </a>
          </div>
        </div>
      </div>

      <Modal
        onClose={() => {
          setShowingSchema(false);
        }}
        open={showingSchema}
        heading="Schema"
      >
        <Schema />
      </Modal>

      <Modal
        onClose={() => {
          setShowingImportSchema(false);
        }}
        open={showingImportSchema}
        heading="Import schema"
      >
        <ImportSchema
          onClose={() => {
            setShowingImportSchema(false);
          }}
        />
      </Modal>
    </>
  );
}
