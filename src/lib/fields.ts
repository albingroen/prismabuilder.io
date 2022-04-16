import { Field } from "../types";

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
