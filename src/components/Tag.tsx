import { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
}

export default function Tag({ children }: TagProps) {
  return (
    <span className="py-0.5 px-1 font-medium rounded text-xs transition duration-100 text-stone-700 border bg-stone-100 shadow-sm border-stone-300">
      {children}
    </span>
  );
}
