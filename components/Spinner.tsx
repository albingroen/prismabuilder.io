import classNames from "../lib/classNames";
import { HTMLAttributes } from "react";

type SpinnerSize = "small" | "default" | "large";

type SpinnerProps = {
  size?: SpinnerSize;
} & HTMLAttributes<HTMLElement>;

const spinnerSizeToDimensions: Record<SpinnerSize, string> = {
  small: "w-4 h-4",
  default: "w-6 h-6",
  large: "w-8 h-8",
};

const Spinner = ({ size = "default", ...rest }: SpinnerProps) => {
  return (
    <i {...rest}>
      <svg
        className={classNames("animate-spin", spinnerSizeToDimensions[size])}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          stroke="currentColor"
          strokeWidth={4}
          cx={12}
          cy={12}
          r={10}
        />
        <path
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          className="opacity-75"
          fill="currentColor"
        />
      </svg>
    </i>
  );
};

export default Spinner;
