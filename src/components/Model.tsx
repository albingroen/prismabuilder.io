import Button from "./Button";
import FieldComponent from "./Field";
import FieldForm from "./FieldForm";
import Modal from "./Modal";
import Stack from "./Stack";
import Types from "./Types";
import classNames from "../lib/classNames";
import { CubeIcon } from "@heroicons/react/solid";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { Schema, Field, Model, FieldType } from "../types";
import { arrayMove } from "../lib/utils";
import { ask } from "@tauri-apps/api/dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CheckIcon, PencilIcon } from "@heroicons/react/outline";
import Input from "./Input";

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

  const [editingName, setEditingName] = useState<boolean>(false);
  const [addingField, setAddingField] = useState<FieldType>();
  const [editingField, setEditingField] = useState<string>();

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

  async function handleDeleteModel() {
    if (
      await ask("Are you sure you want to delete this model?", "Delete model")
    ) {
      onChangeSchema(schema.id, {
        models: schema.models.filter((m) => m.id !== model.id),
      });

      navigate(`/schemas/${schema.id}`);
    }
  }

  async function handleDeleteField(id: string) {
    if (
      await ask("Are you sure you want to delete this field?", "Delete field")
    ) {
      updateModel({
        fields: model.fields.filter((f: Field) => f.id !== id),
      });
    }
  }

  function updateField(id: string, values: Field) {
    updateModel({
      fields: model.fields.map((f) =>
        f.id === editingField ? { ...f, ...values } : f
      ),
    });
  }

  function createField(values: Field) {
    updateModel({
      fields: [...model.fields, values],
    });
  }

  return (
    <Stack className="h-full !gap-6">
      <Stack className="flex-1" direction="vertical" spacing="huge">
        <Stack align="end" justify="between">
          <Stack align="center" spacing="small">
            <CubeIcon className="w-6 text-stone-500" />

            {editingName ? (
              <Input
                autoFocus
                defaultValue={model.name}
                placeholder={model.name}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateModel({
                      name: e.currentTarget.value,
                    });
                    setEditingName(false);
                  }
                }}
                onBlur={(e) => {
                  updateModel({
                    name: e.currentTarget.value,
                  });
                  setEditingName(false);
                }}
              />
            ) : (
              <h1 className="text-2xl leading-none">{model.name}</h1>
            )}

            <button
              onClick={() => {
                setEditingName(!editingName);
              }}
              className="p-0.5 group"
            >
              {editingName ? (
                <CheckIcon className="w-4 text-stone-500 dark:text-stone-500 group-hover:text-inherit transition duration-100" />
              ) : (
                <PencilIcon className="w-4 text-stone-500 dark:text-stone-500 group-hover:text-inherit transition duration-100" />
              )}
            </button>
          </Stack>

          <Button onClick={handleDeleteModel}>Delete model</Button>
        </Stack>

        <DragDropContext onDragEnd={handleMoveField}>
          <Droppable droppableId="fields" direction="vertical">
            {({ droppableProps, innerRef, placeholder }, droppableSnapshot) => (
              <div
                className={classNames(
                  "p-2 pb-0 -m-2 rounded transition",
                  droppableSnapshot.isDraggingOver &&
                    "bg-stone-200 dark:bg-stone-900/50"
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
                      <div
                        className="mb-2.5"
                        ref={innerRef}
                        {...draggableProps}
                      >
                        <div
                          className={classNames(
                            snapshot.isDragging && "transform rotate-2"
                          )}
                        >
                          <FieldComponent
                            dragHandleProps={dragHandleProps}
                            onDelete={handleDeleteField}
                            onClick={() => {
                              setEditingField(field.id);
                            }}
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

      {editingField && (
        <Modal
          description="Update the field by filling out the form below"
          heading="Update field"
          onClose={() => {
            setEditingField(undefined);
          }}
        >
          {({ onClose }) => (
            <FieldForm
              cta="Update field"
              schema={schema}
              onCancel={() => {
                if (onClose) {
                  onClose();
                }
              }}
              onSubmit={(values) => {
                updateField(editingField, values);

                if (onClose) {
                  onClose();
                }
              }}
              defaultValues={model.fields.find((f) => f.id === editingField)}
            />
          )}
        </Modal>
      )}

      {addingField && (
        <Modal
          description="Add a new field by filling out the form below"
          heading="Add field"
          onClose={() => {
            setAddingField(undefined);
          }}
        >
          {({ onClose }) => (
            <FieldForm
              cta="Add field"
              schema={schema}
              onCancel={() => {
                if (onClose) {
                  onClose();
                }
              }}
              onSubmit={(values) => {
                createField(values);

                if (onClose) {
                  onClose();
                }
              }}
              defaultValues={
                {
                  type: addingField,
                } as Field
              }
            />
          )}
        </Modal>
      )}
    </Stack>
  );
}
