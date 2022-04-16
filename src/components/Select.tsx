import React, {
  DetailedHTMLProps,
  OptionHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import classNames from "../lib/classNames";

export interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label?: string;
}

export function getSelectStyles() {
  const selectStyles = {
    base: "w-full shadow-sm block text-sm border-gray-300 rounded-md focus:ring-0 focus:border-gray-400",
  };

  return selectStyles.base;
}

function Select({ className, label, children, ...rest }: SelectProps) {
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

      <select {...rest} className={classNames(getSelectStyles(), className)}>
        {children}
      </select>
    </div>
  );
}

interface OptionProps
  extends DetailedHTMLProps<
    OptionHTMLAttributes<HTMLOptionElement>,
    HTMLOptionElement
  > {}

function Option({ children }: OptionProps) {
  return <option>{children}</option>;
}

Select.Option = Option;

export default Select;
