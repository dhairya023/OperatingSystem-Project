import { SidebarTrigger } from "@/components/ui/sidebar";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                 <div className="md:hidden">
                    <SidebarTrigger className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight font-headline md:text-3xl lg:text-4xl">
                {title}
                </h1>
            </div>
             <div className="flex items-center gap-2">{children}</div>
        </div>
        
        {description && (
          <p className="text-muted-foreground -mt-2 ml-11 md:ml-0 text-sm md:text-base">{description}</p>
        )}
    </div>
  );
}
