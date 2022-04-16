import classNames from "../lib/classNames";

interface CheckboxProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export default function Checkbox({ className, ...rest }: CheckboxProps) {
  return (
    <input
      {...rest}
      className={classNames(
        "rounded border-stone-400 dark:border-stone-700 bg-transparent",
        className
      )}
      type="checkbox"
    />
  );
}
