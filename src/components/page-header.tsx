
type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  const childrenArray = React.Children.toArray(children);
  const primaryActions = childrenArray.slice(0, -1);
  const secondaryActions = childrenArray.slice(-1);

  return (
    <div className="flex flex-col w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight font-headline md:text-4xl text-white">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
                 <div className="hidden sm:flex items-center gap-2">{primaryActions}</div>
            </div>
             <div className="flex items-center gap-2 self-end sm:self-auto">{secondaryActions}</div>
             <div className="flex sm:hidden items-center gap-2 self-end sm:self-auto">{primaryActions}</div>
        </div>
    </div>
  );
}
