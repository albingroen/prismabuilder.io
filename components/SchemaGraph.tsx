import ReactFlow from "react-flow-renderer";
import { Enum, Field, Model } from "../lib/types";
import { TYPES } from "../lib/fields";
import { useSchemaContext } from "../lib/context";

const onLoad = (reactFlowInstance: any) => {
  reactFlowInstance.fitView();
};

const SchemaGraph = () => {
  const { schema } = useSchemaContext();

  return (
    <ReactFlow
      nodesConnectable={false}
      nodesDraggable={false}
      elements={
        schema.models?.length
          ? [
              ...[...schema.models, ...schema.enums].map(
                (model: Model | Enum, i: number) => ({
                  id: model.name,
                  data: {
                    label: <>{model.name}</>,
                  },
                  className:
                    "dark:!bg-neutral-800 dark:!text-white dark:!border-white",
                  position: { x: i * 200, y: 0 },
                })
              ),
              ...schema.models
                .map((model: Model) =>
                  model.fields.map((field) => ({ ...field, model: model.name }))
                )
                .map(
                  (fields: (Field & { model: string; relation?: any })[]) => {
                    const relationFields = fields.filter((field) => {
                      const typeMatchesSomeModel = schema.models.some(
                        (model: Model) => model.name === field.type
                      );

                      const isRelationField =
                        field.relationField || field.relation;

                      const isEnumField =
                        !isRelationField &&
                        !TYPES(schema.database).some(
                          (t) => t.name === field.type
                        );

                      return (
                        isEnumField ||
                        (isRelationField
                          ? isRelationField && typeMatchesSomeModel
                          : typeMatchesSomeModel)
                      );
                    });

                    return [
                      ...fields.map((field, i) => ({
                        id: `${field.model}-${field.name}`,
                        data: {
                          label: <>{field.name}</>,
                        },
                        className: "!p-1 dark:!bg-neutral-800 dark:!text-white",
                        type: "output",
                        position: {
                          x:
                            schema.models.findIndex(
                              (m: Model) => m.name === field.model
                            ) *
                              200 +
                            100,
                          y: (i + 1) * 70,
                        },
                      })),
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
                  }
                )
                .reduce((a, b) => a.concat(b)),
            ]
          : []
      }
      onLoad={onLoad}
    />
  );
};

export default SchemaGraph;
