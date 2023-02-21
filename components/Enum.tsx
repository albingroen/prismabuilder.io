import Button from "./Button";
import Input from "./Input";
import Stack from "./Stack";
import { Enum as EnumType } from "../lib/types";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useSchemaContext } from "../lib/context";
import { useFormik } from "formik";

type EnumProps = {
  onCancel: () => void;
  defaultValues?: EnumType;
};

const Enum = ({ onCancel, defaultValues }: EnumProps) => {
  const { schema, setSchema } = useSchemaContext();

  const form = useFormik({
    initialValues: defaultValues || { name: "", fields: [""] },
    enableReinitialize: true,
    onSubmit: () => {
      handleSubmit();
    },
  });

  const handleSubmit = () => {
    if (defaultValues) {
      setSchema({
        ...schema,
        enums: schema.enums.map((e) =>
          e.name === defaultValues.name ? form.values : e
        ),
        models: schema.models.map((model) => ({
          ...model,
          fields: model.fields.map((field) =>
            field.type === defaultValues.name
              ? {
                  ...field,
                  type: form.values.name,
                }
              : field
          ),
        })),
      });
    } else {
      setSchema({
        ...schema,
        enums: [...schema.enums, form.values],
      });
    }

    onCancel();
  };

  const handleDelete = () => {
    setSchema({
      ...schema,
      enums: schema.enums.filter((e) => e.name !== defaultValues?.name),
      models: schema.models.map((model) => ({
        ...model,
        fields: model.fields.filter(
          (field) => field.type !== defaultValues?.name
        ),
      })),
    });

    onCancel();
  };

  return (
    <form onSubmit={form.handleSubmit}>
      <Stack direction="vertical">
        <Stack direction="vertical" spacing="huge">
          <Input
            onChange={form.handleChange}
            value={form.values.name}
            placeholder="Role"
            label="Enum name"
            name="name"
            id="name"
            autoFocus
            required
          />

          <Stack direction="vertical" spacing="none">
            <p className="label">Enum values</p>

            <Stack direction="vertical">
              {form.values.fields.map((value, i) => (
                <Stack align="center" key={i}>
                  <Input
                    required
                    value={value}
                    autoFocus={
                      i === form.values.fields.length - 1 &&
                      form.values.fields.length > 1
                    }
                    placeholder="ADMIN"
                    onChange={(e) => {
                      form.setFieldValue(
                        "fields",
                        form.values.fields.map((v, vi) =>
                          vi === i ? e.currentTarget.value : v
                        )
                      );
                    }}
                  />

                  <button
                    onClick={() => {
                      form.setFieldValue(
                        "fields",
                        form.values.fields.filter((_, vi) => vi !== i)
                      );
                    }}
                    title="Delete enum value"
                    className="icon-button"
                    type="button"
                  >
                    <TrashIcon className="icon-button-icon" />
                  </button>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>

        <Button
          onClick={() => {
            form.setFieldValue("fields", [...form.values.fields, ""]);
          }}
          variant="secondary"
          type="button"
        >
          Add value +
        </Button>

        <hr className="dark:border-neutral-800" />

        <Button type="submit">
          {defaultValues ? "Update" : "Create"} enum
        </Button>

        <Button onClick={onCancel} variant="secondary" type="button">
          Cancel
        </Button>

        {defaultValues && (
          <>
            <hr className="dark:border-neutral-800" />

            <Button onClick={handleDelete} variant="secondary" type="button">
              Delete enum
            </Button>
          </>
        )}
      </Stack>
    </form>
  );
};

export default Enum;
