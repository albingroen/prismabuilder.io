import classNames from "../lib/classNames";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={classNames(
        "cursor-default bg-white dark:bg-stone-700 text-shadow-md rounded-[5.5px] text-sm py-1 px-[10px] font-medium shadow-sm shadow-stone-200 dark:shadow-stone-900 border border-stone-200 dark:border-stone-600 active:bg-stone-100 dark:active:bg-stone-600 transition duration-100",
        className
      )}
    >
      {children}
    </button>
  );
}
