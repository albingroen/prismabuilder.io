import React, {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  Ref,
} from "react";
import classNames from "../lib/classNames";

export interface CustomInputProps {
  description?: string;
  block?: boolean;
  error?: string;
  label?: string;
}

export interface InputProps
  extends DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    CustomInputProps {}

export function getInputStyles({ block }: CustomInputProps) {
  const inputStyles = {
    base: "shadow-sm placeholder-gray-400 block text-sm border-gray-300 rounded-md focus:ring-0 focus:border-gray-400",
    block: "w-full",
  };

  return classNames(inputStyles.base, block && inputStyles.block);
}

function Input(
  { description, className, error, block, label, ...rest }: InputProps,
  ref: Ref<HTMLInputElement>
) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={rest.id}
          className="inline-block mb-1 text-sm text-stone-500"
        >
          {label}
          {rest.required ? "*" : ""}
        </label>
      )}

      <input
        {...rest}
        ref={ref}
        type={rest.type ?? "text"}
        className={classNames(getInputStyles({ label, block }), className)}
      />

      {error && <p className="!text-sm mt-2 block text-red-500">{error}</p>}

      {description && (
        <p className="!text-sm text-stone-500 mt-2 block">{description}</p>
      )}
    </div>
  );
}

export default forwardRef(Input);
