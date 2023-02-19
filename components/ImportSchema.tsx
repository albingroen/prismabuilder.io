import Button from "./Button";
import axios from "axios";
import toast from "react-hot-toast";
import { Enum, Model } from "../lib/types";
import { apiUrl } from "../lib/config";
import { useSchemaContext } from "../lib/context";
import { useState } from "react";
import Stack from "./Stack";
import { useFormik } from "formik";

type ImportSchemaProps = {
  onClose: () => void;
};

const ImportSchema = ({ onClose }: ImportSchemaProps) => {
  const { schema, setSchema } = useSchemaContext();

  const form = useFormik({
    initialValues: {
      schema: "",
    },
    onSubmit: async (values, { resetForm }) => {
      return axios
        .post(`${apiUrl}/parse`, { schema: values.schema })
        .then((res) => {
          const importedSchema = res.data;
          if (
            schema.models.some((model: Model) =>
              importedSchema.models
                .map((m: Model) => m.name)
                .includes(model.name)
            )
          ) {
            toast.error("Some model has a colliding name");
          } else if (
            schema.enums.some((enumValue: Enum) =>
              importedSchema.enums
                .map((e: Enum) => e.name)
                .includes(enumValue.name)
            )
          ) {
            toast.error("Some enum has a colliding name");
          } else if (importedSchema.models?.length) {
            setSchema({
              ...schema,
              models: [...schema.models, ...importedSchema.models],
              enums: [...schema.enums, ...(importedSchema.enums ?? [])],
            });
            resetForm();
            onClose();
          } else {
            toast.error("Make sure to import a full schema");
          }
        })
        .catch(() => {
          toast.error("Failed to import schema");
        });
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <Stack direction="vertical" spacing="huge">
        <p className="text-sm text-gray-700">
          Be wary that importing a schema will omit any default values on
          fields.
        </p>

        <textarea
          autoFocus
          rows={15}
          name="schema"
          value={form.values.schema}
          onChange={form.handleChange}
          className="rounded-lg focus:outline-none focus:ring-0 focus:border-indigo-500"
        />

        <Button type="submit" isLoading={form.isSubmitting}>
          Import schema
        </Button>
      </Stack>
    </form>
  );
};

export default ImportSchema;
