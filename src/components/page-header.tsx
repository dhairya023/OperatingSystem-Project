import { SidebarTrigger } from "@/components/ui/sidebar";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 w-full">
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight font-headline md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">{children}</div>
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
      </div>
      <div className="md:hidden w-full flex-shrink-0 basis-full order-last">
        {children}
      </div>
    </div>
  );
}
