import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, Ref } from "react";
import { classNames } from "react-cmdk";

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
}

const Input = (
  { label, children, className, ...rest }: InputProps,
  ref: Ref<HTMLInputElement>
) => {
  return (
    <div className={classNames("w-full", className)}>
      {label && (
        <label htmlFor={rest.id} className="label">
          {label}
        </label>
      )}

      <input
        {...rest}
        type={rest.type || "text"}
        className="w-full input"
        ref={ref}
      />
    </div>
  );
};

export default forwardRef(Input);
