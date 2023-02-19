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
  ref: Ref<HTMLInputElement>
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
        className="rounded h-5 w-5 border-gray-300 hover:border-gray-400 text-black focus:outline-none focus:ring-0 focus-visible:ring-1 focus-visible:ring-black"
      />
    </Stack>
  );
};

export default forwardRef(Checkbox);
