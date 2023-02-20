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
  icon?: HeroIcon;
}

const Button = (
  {
    variant = "primary",
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
        "font-medium rounded-md py-2 px-4 w-full text-sm relative disabled:opacity-50",
        "focus:outline-none focus-visible:ring-1",
        {
          primary:
            "bg-gray-900 enabled:hover:bg-gray-700 text-white enabled:focus-visible:ring-white enabled:focus-visible:bg-gray-700",
          secondary:
            "bg-gray-100 enabled:hover:bg-gray-200 enabled:focus-visible:ring-black enabled:focus-visible:bg-gray-200",
        }[variant],
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
