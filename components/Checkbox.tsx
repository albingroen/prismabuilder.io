import Stack from "./Stack";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, Ref } from "react";

interface CheckboxProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
}

const Checkbox = (
  { label, ...rest }: CheckboxProps,
  ref: Ref<HTMLInputElement>,
) => {
  return (
    <Stack direction="vertical" align="start" spacing="none">
      <label className="label" htmlFor={rest.id}>
        {label}
      </label>

      <input
        {...rest}
        ref={ref}
        type="checkbox"
        className="bg-transparent rounded h-5 w-5 border-gray-300 dark:border-neutral-600 hover:border-gray-400 text-black dark:text-neutral-600 focus:outline-none focus:ring-0 focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white"
      />
    </Stack>
  );
};

export default forwardRef(Checkbox);
