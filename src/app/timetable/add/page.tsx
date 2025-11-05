
'use client';
import AppLayout from '@/components/app-layout';
import ClassSessionForm from '@/components/timetable/class-session-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppContext } from '@/context/app-context';
import type { ClassSession } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddClassPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const { setHeaderState } = useAppContext();

  useEffect(() => {
    setHeaderState({
      title: 'Add Class',
      description: 'Schedule a new class session.',
    });
  }, [setHeaderState]);

  const handleSave = () => {
    router.push('/timetable');
  };

  const handleCancel = () => {
    router.back();
  };

  const defaultDate = dateParam ? new Date(dateParam) : new Date();
  
  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-bold">Add New Class</h1>
        </div>
        <ClassSessionForm onSave={handleSave} defaultDate={defaultDate} />
      </div>
    </AppLayout>
  );
}
