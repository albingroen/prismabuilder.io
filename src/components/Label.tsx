import { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  formLabel?: boolean;
}

export default function Label({ children, formLabel }: LabelProps) {
  return (
    <label
      className={
        formLabel
          ? "inline-block text-sm text-stone-500"
          : "text-stone-500 dark:text-stone-400 text-xs tracking-wider font-medium uppercase"
      }
    >
      {children}
    </label>
  );
}
