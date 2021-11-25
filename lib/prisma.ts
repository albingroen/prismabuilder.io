const parseRelationship = (relation: any) => {
  if (!relation) {
    return "";
  }

  const parseRelationshipArg = (fields: any[]) => {
    return "[" + fields.join(",") + "]";
  };

  const relationName = relation.name ? `"${relation.name}"` : "";
  const prependRelationFields = relation.name ? ", " : "";
  const relationFields = relation.fields
    ? `${prependRelationFields}fields: ${parseRelationshipArg(
        relation.fields
      )}, `
    : "";
  const relationReferences = relation.references
    ? `references: ${parseRelationshipArg(relation.references)}`
    : "";

  return ` @relation(${relationName}${relationFields}${relationReferences})`;
};

const parseModelFields = (fields: any[]) => {
  return fields.map(
    ({
      name,
      type,
      list,
      required,
      isId,
      relation,
      default: defaultValue,
      unique: isUnique,
    }) => {
      const array = list ? "[]" : "";
      const optional = list ? "" : required ? "" : "?";
      const id = isId ? " @id" : "";
      const unique = isUnique ? " @unique" : "";
      const default_value = defaultValue ? ` @default(${defaultValue})` : "";
      const relationship = parseRelationship(relation);

      return `    ${name} ${type}${array}${optional}${id}${unique}${relationship}${default_value}`;
    }
  );
};

const parseModels = (models: any[]) => {
  return models.reduce((a, { name, fields }) => {
    return [...a, `model ${name} {`, ...parseModelFields(fields), "}", "", ""];
  }, []);
};

const parseEnumFields = (fields: any[]) => {
  return fields.map((field) => `  ${field}`);
};

const parseEnums = (enums: any[]) => {
  return enums.reduce((a, { name, fields }) => {
    return [...a, `enum ${name} {`, ...parseEnumFields(fields), "}"];
  }, []);
};

export const jsonToPrismaSchema = (jsonSchema: any) => {
  const prismaSchema = Object.entries(jsonSchema).reduce(
    (a: any, [type, values]: [any, any]) => {
      if (type === "models") {
        return [...a, ...parseModels(values)];
      }

      if (type === "enums") {
        return [...a, ...parseEnums(values)];
      }

      return a;
    },
    []
  );

  return prismaSchema.join("\n");
};

export const PRISMA_DEFAULT_VALUE_FNS = [
  {
    value: "autoincrement()",
    label: "Automatic incremenetation",
    description: "Automatically increment each row from 0",
  },
  {
    value: "uuid()",
    label: "A random UUID",
    description: "Automatically generate a random UUID",
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
