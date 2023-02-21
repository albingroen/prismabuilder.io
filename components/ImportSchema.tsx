import Button from "./Button";
import Stack from "./Stack";
import axios from "axios";
import toast from "react-hot-toast";
import { Enum, Model } from "../lib/types";
import { apiUrl } from "../lib/config";
import { useFormik } from "formik";
import { useSchemaContext } from "../lib/context";
import { classNames } from "react-cmdk";

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
        <p className="text-sm text-gray-700 dark:text-neutral-500">
          Be wary that importing a schema will omit any default values on
          fields.
        </p>

        <textarea
          autoFocus
          rows={15}
          name="schema"
          value={form.values.schema}
          onChange={form.handleChange}
          className={classNames(
            "bg-transparent rounded-lg p-4 placeholder-gray-300 focus:outline-none border-gray-300 focus:ring-0 focus:border-indigo-500 w-full resize-none pb-20 font-mono whitespace-pre-wrap overflow-auto",
            "dark:border-neutral-700 dark:focus:border-blue-600 dark:placeholder-neutral-700"
          )}
          placeholder={`model User {
  id  String  @id @unique @default(cuid())
}

...`}
        />

        <input
          type="file"
          multiple={false}
          accept=".prisma"
          key={form.values.schema}
          onChange={async (e) => {
            const file = e.currentTarget.files?.[0];

            if (file) {
              form.setFieldValue("schema", await file.text());
            }
          }}
        />

        <Stack direction="vertical" spacing="small">
          <Button type="submit" isLoading={form.isSubmitting}>
            Import schema
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.resetForm();
              onClose();
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default ImportSchema;
