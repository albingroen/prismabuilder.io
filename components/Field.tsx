import Button from "./Button";
import Checkbox from "./Checkbox";
import Input from "./Input";
import Modal from "./Modal";
import Select from "./Select";
import Stack from "./Stack";
import { Field, FieldType, Model } from "../lib/types";
import { PRISMA_DEFAULT_VALUES } from "../lib/prisma";
import { TYPES } from "../lib/fields";
import { useFormik } from "formik";
import { useSchemaContext } from "../lib/context";
import { useState } from "react";

type FieldProps = {
  onSubmit: (value: Field) => void;
  defaultType?: FieldType;
  defaultValues?: Field;
  onClose: () => void;
  model: Model;
};

type FormValues = Omit<Field, "kind" | "relationField" | "documentation">;

const Field = ({
  defaultValues = {} as Field,
  defaultType,
  onSubmit,
  onClose,
  model,
}: FieldProps) => {
  const { schema } = useSchemaContext();

  const hasDefaultValues = Object.keys(defaultValues).length;

  const form = useFormik<FormValues>({
    initialValues: hasDefaultValues
      ? defaultValues
      : {
          type: defaultType || "",
          isUpdatedAt: false,
          default: "",
          required: false,
          unique: false,
          isId: false,
          list: false,
          name: "",
        },
    enableReinitialize: true,
    onSubmit: () => {
      onSubmit({
        ...defaultValues,
        ...form.values,
        relationField: schema.models.some(
          (model: Model) => model.name === form.values.type,
        ),
      });

      form.resetForm();
      onClose();
    },
  });

  const enumType = schema.enums.find(
    (e) => e.name === form.values.type && e.fields.length,
  );

  const defaultDefaultValues =
    enumType?.fields?.map((field) => ({
      description: "",
      value: field,
      label: field,
    })) || PRISMA_DEFAULT_VALUES(form.values.type);

  return (
    <Modal
      onClose={() => {
        form.resetForm();
        onClose();
      }}
      heading={hasDefaultValues ? "Update field" : "Add field"}
    >
      {({ close }) => (
        <form onSubmit={form.handleSubmit} className="flex flex-col space-y-4">
          <Input
            placeholder="published"
            onChange={form.handleChange}
            value={form.values.name}
            label="Name"
            name="name"
            id="name"
            autoFocus
            required
          />

          <Select
            value={form.values.type}
            onChange={(e) => {
              form.setValues({
                ...form.values,
                type: e.currentTarget.value,
                default: "",
              });
            }}
            label="Type"
          >
            {[
              ...TYPES(schema.database),
              ...schema.models.map((m) => ({ ...m, description: "Model" })),
              ...schema.enums.map((m) => ({ ...m, description: "Enum" })),
            ].map((type) => (
              <option key={type.name} value={type.name}>
                {type.name}
              </option>
            ))}
          </Select>

          <Select
            value={form.values.defaultValue}
            onChange={(e) => {
              form.setFieldValue("defaultValue", e.currentTarget.value);
            }}
            label="Default value"
          >
            <option value="">No default value</option>
            {defaultDefaultValues.map((defaultValue) => (
              <option key={defaultValue.value} value={defaultValue.value}>
                {defaultValue.label}
              </option>
            ))}
          </Select>

          <div className="flex space-x-8 items-start py-2">
            <Checkbox
              id="required"
              name="required"
              label="Required"
              onChange={form.handleChange}
              checked={form.values.required}
            />

            <Checkbox
              id="unique"
              name="unique"
              label="Unique"
              onChange={form.handleChange}
              checked={form.values.unique}
            />

            {form.values.type === "DateTime" && (
              <Checkbox
                id="isUpdatedAt"
                name="isUpdatedAt"
                label="Updated At"
                onChange={form.handleChange}
                checked={form.values.isUpdatedAt}
              />
            )}

            <Checkbox
              id="list"
              name="list"
              label="List"
              checked={form.values.list}
              onChange={form.handleChange}
            />

            {form.values.type === "String" && (
              <Checkbox
                label="Is ID"
                disabled={model.fields.some(
                  (field) => field.isId && field.name !== defaultValues.name,
                )}
                id="isId"
                name="isId"
                checked={form.values.isId}
                onChange={form.handleChange}
              />
            )}
          </div>

          <Stack direction="vertical" spacing="small">
            <Button type="submit">
              {hasDefaultValues ? "Update" : "Create"} field
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                close();
              }}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      )}
    </Modal>
  );
};

export default Field;
