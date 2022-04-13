import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
}

function Page({ children }: PageProps) {
  return (
    <div className="h-screen flex dark:text-white antialiased border-t">
      {children}
    </div>
  );
}

interface PageContentProps {
  children: ReactNode;
}

function PageContent({ children }: PageContentProps) {
  return <div className="bg-white dark:bg-stone-800 flex-1">{children}</div>;
}

Page.Content = PageContent;

export default Page;
