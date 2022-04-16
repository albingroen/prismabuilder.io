import Button from "./Button";
import CreateField from "./CreateField";
import FieldComponent from "./Field";
import Modal from "./Modal";
import Stack from "./Stack";
import Types from "./Types";
import { CubeIcon } from "@heroicons/react/solid";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { Schema, Field, Model, FieldType } from "../types";
import { arrayMove } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import classNames from "../lib/classNames";

interface ModelProps {
  onChangeSchema: (id: string, values: any) => void;
  schema: Schema;
  model: Model;
}

export default function ModelView({
  onChangeSchema,
  schema,
  model,
}: ModelProps) {
  const navigate = useNavigate();

  const [addingField, setAddingField] = useState<FieldType>();

  function updateModel(values: any) {
    if (!schema || !model) return;

    onChangeSchema(schema.id, {
      models: schema.models.map((m: Model) =>
        m.name === model.name
          ? {
              ...model,
              ...values,
            }
          : m
      ),
    });
  }

  function handleMoveField(result: DropResult) {
    if (!result.destination) return;

    const newFields = [...model.fields];

    arrayMove(newFields, result.source.index, result.destination.index);

    updateModel({
      fields: newFields,
    });
  }

  function handleDeleteModel() {
    onChangeSchema(schema.id, {
      models: schema.models.filter((m) => m.id !== model.id),
    });

    navigate(`/schemas/${schema.id}`);
  }

  function handleDeleteField(id: string) {
    updateModel({
      fields: model.fields.filter((f: Field) => f.id !== id),
    });
  }

  return (
    <Stack className="h-full !gap-6">
      <Stack className="flex-1" direction="vertical" spacing="huge">
        <Stack align="end" justify="between">
          <Stack align="center" spacing="small">
            <CubeIcon className="w-6 text-stone-500" />
            <h1 className="text-2xl leading-none">{model.name}</h1>
          </Stack>

          <Button onClick={handleDeleteModel}>Delete model</Button>
        </Stack>

        <DragDropContext onDragEnd={handleMoveField}>
          <Droppable droppableId="fields" direction="vertical">
            {({ droppableProps, innerRef, placeholder }, droppableSnapshot) => (
              <div
                className={classNames(
                  "p-2 pb-0 -m-2 rounded transition",
                  droppableSnapshot.isDraggingOver && "bg-stone-200"
                )}
                {...droppableProps}
                ref={innerRef}
              >
                {model.fields.map((field, i) => (
                  <Draggable index={i} draggableId={field.id} key={field.id}>
                    {(
                      { innerRef, draggableProps, dragHandleProps },
                      snapshot
                    ) => (
                      <div className="mb-2" ref={innerRef} {...draggableProps}>
                        <div
                          className={classNames(
                            snapshot.isDragging && "transform rotate-2"
                          )}
                        >
                          <FieldComponent
                            dragHandleProps={dragHandleProps}
                            onDelete={handleDeleteField}
                            field={field}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Stack>

      <Types schema={schema} onClickType={setAddingField} />

      {addingField && (
        <Modal
          description="Add a new field by filling out the form below"
          heading="Add field"
          onClose={() => {
            setAddingField(undefined);
          }}
        >
          {({ onClose }) => (
            <CreateField
              schema={schema}
              onCancel={() => {
                if (onClose) {
                  onClose();
                }
              }}
              onSubmit={(field) => {
                updateModel({
                  fields: [...model.fields, field],
                });

                if (onClose) {
                  onClose();
                }
              }}
              defaultType={addingField}
            />
          )}
        </Modal>
      )}
    </Stack>
  );
}
