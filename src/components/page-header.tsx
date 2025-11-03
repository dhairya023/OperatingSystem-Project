import { SidebarTrigger } from "@/components/ui/sidebar";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight font-headline md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </div>
       <div className="md:hidden">
        <SidebarTrigger />
      </div>
    </div>
  );
}
