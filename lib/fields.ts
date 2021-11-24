import { Field } from "./types";

export const FIELDS = [
  { name: "Int", description: "A fixed number" },
  { name: "DateTime", description: "A calendar date" },
  { name: "String", description: "Any text" },
  { name: "Boolean", description: "True or False" },
  { name: "BigInt", description: "A very big number" },
  { name: "Float", description: "Float number" },
  { name: "Decimal", description: "Decimal number" },
  { name: "Json", description: "Any JSON data" },
  { name: "Bytes", description: "Abstract bytes data" },
];

export const ID_FIELD: Field = {
  relationField: false,
  documentation: "",
  default: "uuid()",
  required: true,
  type: "String",
  unique: true,
  list: false,
  isId: true,
  name: "id",
  kind: "",
};
