import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
}

function Page({ children }: PageProps) {
  return (
    <div className="h-screen flex dark:text-white antialiased border-t dark:border-t-stone-800">
      {children}
    </div>
  );
}

interface PageContentProps {
  children: ReactNode;
}

function PageContent({ children }: PageContentProps) {
  return (
    <div className="bg-stone-100 dark:bg-stone-800 flex-1 overflow-y-auto">
      <div className="h-full mx-auto p-6">{children}</div>
    </div>
  );
}

Page.Content = PageContent;

export default Page;
