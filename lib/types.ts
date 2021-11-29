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
  name: string;
  models: Model[];
};
