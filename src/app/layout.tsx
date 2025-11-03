import type { Metadata } from 'next';
import './globals.css';
import { Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import { GraduationCap } from 'lucide-react';
import { AppProvider } from '@/context/app-context';

export const metadata: Metadata = {
  title: 'ScholarSphere',
  description: 'Your academic life, organized.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProvider>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar className="border-r border-border/20">
                <SidebarHeader>
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <GraduationCap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-bold font-headline">ScholarSphere</h1>
                  </div>
                </SidebarHeader>
                <SidebarContent className="p-0">
                  <SidebarNav />
                </SidebarContent>
              </Sidebar>
              <SidebarInset>
                <main className="p-4 md:p-6 lg:p-8">
                  {children}
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
