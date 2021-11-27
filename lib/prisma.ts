export const PRISMA_DEFAULT_VALUE_FNS = [
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
    value: "false",
    label: "False",
    description: "",
  },
  {
    value: "true",
    label: "True",
    description: "",
  },
];
