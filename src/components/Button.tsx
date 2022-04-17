import classNames from "../lib/classNames";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "default" | "primary";
}

export default function Button({
  variant = "default",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={classNames(
        "inline-flex justify-center items-center space-x-1.5 rounded-[5.5px] text-sm py-1 px-[10px] font-medium duration-100 disabled:pointer-events-none disabled:opacity-50",
        {
          default:
            "bg-white dark:bg-stone-700 text-shadow-md shadow-sm shadow-stone-200 dark:shadow-stone-900 border border-stone-200 dark:border-stone-600 active:bg-stone-100 dark:active:bg-stone-600 transition",
          primary:
            "bg-emerald-500 dark:bg-emerald-600 shadow-sm shadow-emerald-300 dark:shadow-emerald-500 text-white active:bg-emerald-600",
        }[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
