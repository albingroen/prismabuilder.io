import axios from "axios";
import { API_URL } from "./config";
import { Enum, FieldType, Model, PrismaDatabase, Schema } from "../types";
import { message } from "@tauri-apps/api/dialog";
import { readTextFile } from "@tauri-apps/api/fs";
import { v4 as uuid } from "uuid";

export const PRISMA_DEFAULT_VALUES = (type: FieldType) => {
  const ALL_DEFAULT_VALUES = [
    {
      value: "autoincrement()",
      label: "Automatic incrementation",
      description: "Automatically increment each row from 0",
    },
    {
      value: "uuid()",
      label: "A random UUID",
      description: "Automatically generate a random UUID",
    },
    {
      value: "cuid()",
      label: "A random CUID",
      description: "Automatically generate a random CUID",
    },
    {
      value: "now()",
      label: "Current date",
      description: "The current date once the row is inserted",
    },
    {
      value: "true",
      label: "True",
      description: "",
    },
    {
      value: "false",
      label: "False",
      description: "",
    },
  ];

  switch (type) {
    case "Int":
      return ALL_DEFAULT_VALUES.filter(
        ({ value }) => value === "autoincrement()"
      );
    case "String":
      return ALL_DEFAULT_VALUES.filter(({ value }) =>
        ["uuid()", "cuid()"].includes(value)
      );
    case "Boolean":
      return ALL_DEFAULT_VALUES.filter(({ value }) =>
        ["true", "false"].includes(value)
      );
    case "DateTime":
      return ALL_DEFAULT_VALUES.filter(({ value }) => value === "now()");
    default:
      return [];
  }
};

export const PRISMA_DATABASES: { label: string; value: PrismaDatabase }[] = [
  { label: "PostgreSQL", value: "postgresql" },
  { label: "SQLite", value: "sqlite" },
  { label: "MySQL", value: "mysql" },
];

export async function getSchemaString(schema: Schema) {
  return axios.post(`${API_URL}/generate`, { schema }).then((res) => res.data);
}

export async function getSchemaObject(schemaString: string) {
  return await axios
    .post(`${API_URL}/parse`, {
      schema: schemaString,
    })
    .then((res) => res.data);
}

export async function importSchema(schemaPath: string) {
  const schemaString = await readTextFile(schemaPath);

  try {
    const schema = await getSchemaObject(schemaString);

    if (schema) {
      return {
        name: "Imported schema",
        path: schemaPath,
        id: uuid(),
        ...schema,
        models: schema.models.map((m: Model) => ({
          ...m,
          fields: m.fields.map((f) => ({ ...f, id: uuid() })),
          id: uuid(),
        })),
        enums: schema.enums.map((e: Enum) => ({ ...e, id: uuid() })),
      };
    }
  } catch {
    message("Failed to import schema");
  }
}
