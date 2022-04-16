import { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
}

export default function Label({ children }: LabelProps) {
  return (
    <label className="text-stone-500 dark:text-stone-400 text-xs tracking-wider font-medium uppercase">
      {children}
    </label>
  );
}
