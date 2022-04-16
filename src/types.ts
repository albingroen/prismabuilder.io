export type FieldType =
  | "DateTime"
  | "String"
  | "Boolean"
  | "Int"
  | "BigInt"
  | "Float"
  | "Decimal"
  | "Json"
  | "Bytes";

export type Field = {
  relationField: boolean;
  documentation: string;
  required: boolean;
  unique: boolean;
  default: string;
  list: boolean;
  isId: boolean;
  kind: string;
  name: string;
  type: FieldType;
  id: string;
};

export type Model = {
  fields: Field[];
  name: string;
  id: string;
};

export type Schema = {
  database: PrismaDatabase;
  models: Model[];
  enums: Enum[];
  name: string;
  id: string;
};

export type Enum = {
  fields: string[];
  name: string;
  id: string;
};

export type PrismaDatabase = "postgresql" | "sqlite" | "mysql";
