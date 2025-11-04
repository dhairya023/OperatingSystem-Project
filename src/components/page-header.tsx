import { SidebarTrigger } from "@/components/ui/sidebar";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                 <div className="md:hidden">
                    <SidebarTrigger className="h-10 w-10" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight font-headline md:text-3xl lg:text-4xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-muted-foreground text-sm md:text-base">{description}</p>
                    )}
                </div>
            </div>
             <div className="flex items-center gap-2 self-end sm:self-auto">{children}</div>
        </div>
    </div>
  );
}
