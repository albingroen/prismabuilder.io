import ReactFlow, { Background, Controls, Edge, Node } from "reactflow";
import { Enum, Field, Model } from "../lib/types";
import { TYPES } from "../lib/fields";
import { useSchemaContext } from "../lib/context";

const SchemaGraph = () => {
  const { schema } = useSchemaContext();

  const models: Node[] = [
    ...[...schema.models, ...schema.enums].map(
      (model: Model | Enum, i: number) => ({
        id: model.name,
        data: {
          label: <>{model.name}</>,
        },
        className: "dark:!bg-neutral-800 dark:!text-white dark:!border-white",
        position: { x: i * 200, y: 0 },
      }),
    ),
  ];

  const modelsFields = schema.models.map((model: Model) =>
    model.fields.map((field) => ({
      ...field,
      model: model.name,
    })),
  );

  const nodes: Node[] = schema.models?.length
    ? [
        ...models,
        ...modelsFields
          .map((fields: (Field & { model: string; relation?: any })[]) => {
            return fields.map((field, i) => ({
              id: `${field.model}-${field.name}`,
              data: {
                label: <>{field.name}</>,
              },
              className:
                "!p-1 dark:!bg-neutral-800 dark:!text-white !border-red-500",
              type: "output",
              position: {
                x:
                  schema.models.findIndex(
                    (m: Model) => m.name === field.model,
                  ) *
                    200 +
                  100,
                y: (i + 1) * 70,
              },
            }));
          })
          .reduce((a, b) => a.concat(b)),
      ]
    : [];

  const edges: Edge[] = modelsFields
    .map((fields: (Field & { model: string; relation?: any })[]) => {
      const relationFields = fields.filter((field) => {
        const typeMatchesSomeModel = schema.models.some(
          (model: Model) => model.name === field.type,
        );

        const isRelationField = field.relationField || field.relation;

        const isEnumField =
          !isRelationField &&
          !TYPES(schema.database).some((t) => t.name === field.type);

        return (
          isEnumField ||
          (isRelationField
            ? isRelationField && typeMatchesSomeModel
            : typeMatchesSomeModel)
        );
      });

      return [
        ...relationFields.map((field) => {
          const fieldId = `${field.model}-${field.name}`;

          return {
            id: `${fieldId}-to-${field.model}-relation`,
            className: "opacity-50 dark:opacity-25",
            source: field.type,
            target: fieldId,
            animated: true,
          };
        }),
        ...fields.map((field) => {
          const fieldId = `${field.model}-${field.name}`;

          return {
            id: `${fieldId}-to-${field.model}`,
            className: "opacity-50",
            source: field.model,
            target: fieldId,
            animated: false,
          };
        }),
      ];
    })
    .reduce((a, b) => a.concat(b));

  return (
    <div className="h-full">
      <ReactFlow
        nodesConnectable={false}
        nodesDraggable={false}
        nodes={nodes}
        edges={edges}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default SchemaGraph;
