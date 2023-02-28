import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  Ref,
  forwardRef,
} from "react";
import { HeroIcon } from "../lib/types";
import { classNames } from "react-cmdk";
import Spinner from "./Spinner";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  className?: string;
  icon?: HeroIcon;
  block?: boolean;
}

const Button = (
  {
    variant = "primary",
    block = true,
    isLoading,
    icon: Icon,
    className,
    children,
    ...rest
  }: ButtonProps,
  ref: Ref<HTMLButtonElement>
) => {
  const disabled = rest.disabled || isLoading;

  return (
    <button
      {...rest}
      disabled={disabled}
      className={classNames(
        "select-none font-medium rounded-md py-2 px-4 text-sm relative disabled:opacity-50",
        "focus:outline-none focus-visible:ring-1",
        {
          primary: classNames(
            "bg-gray-900 enabled:hover:bg-gray-700 text-white enabled:focus-visible:ring-white enabled:focus-visible:bg-gray-700",
            "dark:bg-white dark:enabled:hover:bg-neutral-200 dark:text-black dark:enabled:focus-visible:ring-white dark:enabled:focus-visible:bg-neutral-200"
          ),
          secondary: classNames(
            "bg-gray-100 enabled:hover:bg-gray-200 enabled:focus-visible:ring-black enabled:focus-visible:bg-gray-200",
            "dark:bg-neutral-800 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:ring-white dark:enabled:focus-visible:bg-neutral-700"
          ),
        }[variant],
        block && "w-full",
        className
      )}
      ref={ref}
    >
      <span>{children}</span>

      {isLoading ? (
        <Spinner
          size="small"
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        />
      ) : (
        Icon && (
          <Icon className="w-3.5 absolute right-3 top-1/2 transform -translate-y-1/2" />
        )
      )}
    </button>
  );
};

export default forwardRef(Button);
