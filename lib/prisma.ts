import { FieldType, PrismaDatabase } from "./types";

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
  { label: "SQLServer", value: "sqlserver" }
];
