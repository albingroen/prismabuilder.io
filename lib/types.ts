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
  type: string;
};

export type Model = {
  fields: Field[];
  name: string;
};

export type Schema = {
  database: PrismaDatabase;
  models: Model[];
  enums: any[];
  name: string;
};

export type PrismaDatabase = "postgresql" | "sqlite" | "mysql";
