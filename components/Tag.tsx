import { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
};

const Tag = ({ children }: TagProps) => (
  <div className="bg-gray-200 rounded py-0.5 text-gray-700 px-1 text-sm">
    {children}
  </div>
);

export default Tag;
