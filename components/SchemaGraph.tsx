import ReactFlow, { Background } from "react-flow-renderer";
import { useSchemaContext } from "../lib/context";
import { Field, Model } from "../lib/types";

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
              ...schema.models.map((model: Model, i: number) => ({
                id: model.name,
                data: {
                  label: <>{model.name}</>,
                },
                position: { x: i * 200, y: 0 },
              })),
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

                      return isRelationField
                        ? isRelationField && typeMatchesSomeModel
                        : typeMatchesSomeModel;
                    });

                    return [
                      ...fields.map((field, i) => ({
                        id: `${field.model}-${field.name}`,
                        data: {
                          label: <>{field.name}</>,
                        },
                        className: "!p-1",
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
                .reduce((a: Field[], b: Field) => a.concat(b)),
            ]
          : []
      }
      onLoad={onLoad}
    >
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default SchemaGraph;
