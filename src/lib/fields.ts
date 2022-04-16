import { Field, FieldType, PrismaDatabase } from "../types";

export const TYPES = (
  database: PrismaDatabase
): Array<{ name: FieldType; description: string }> => {
  const ALL_TYPES: Array<{ name: FieldType; description: string }> = [
    { name: "DateTime", description: "A calendar date" },
    { name: "String", description: "Any text" },
    { name: "Boolean", description: "True or False" },
    { name: "Int", description: "A fixed number" },
    { name: "BigInt", description: "A very big number" },
    { name: "Float", description: "Float number" },
    { name: "Decimal", description: "Decimal number" },
    { name: "Json", description: "Any JSON data" },
    { name: "Bytes", description: "Abstract bytes data" },
  ];

  switch (database) {
    case "sqlite":
      return ALL_TYPES.filter(
        (type) => type.name !== "Json" && type.name !== "Bytes"
      );
    default:
      return ALL_TYPES;
  }
};

export const ID_FIELD: Field = {
  id: Math.random().toString(),
  relationField: false,
  documentation: "",
  default: "cuid()",
  required: true,
  type: "String",
  unique: true,
  list: false,
  isId: true,
  name: "id",
  kind: "",
};
