import { DetailedHTMLProps, SelectHTMLAttributes } from "react";
import { classNames } from "react-cmdk";

interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label: string;
}

export default function Select({
  label,
  children,
  className,
  ...rest
}: SelectProps) {
  return (
    <div className={classNames("w-full", className)}>
      <label htmlFor={rest.id} className="label">
        {label}
      </label>

      <select className="w-full input" {...rest}>
        {children}
      </select>
    </div>
  );
}
