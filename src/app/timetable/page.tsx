
'use client';
import AppLayout from '@/components/app-layout';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { PlusCircle, Share2, MapPin, ArrowRight } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { Card } from '@/components/ui/card';
import type { ClassSession } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ClassDetailsDrawer } from '@/components/timetable/ClassDetailsDrawer';
import { useToast } from '@/hooks/use-toast';
import { ShareDialog } from '@/components/share-dialog';
import Link from 'next/link';
import WeekViewCalendar from '@/components/timetable/week-view-calendar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const formatTime12h = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${period}`;
};

const TimetableCard = ({ session, isBreak = false }: { session: ClassSession, isBreak?: boolean }) => {
  const { subjects } = useAppContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const subject = subjects.find(s => s.name === session.subject);
  const color = subject?.color || '#A1A1AA';
  
  if (isBreak) {
     return (
         <Card
            className="p-4 md:p-6 flex flex-col gap-2 rounded-xl border-dashed bg-transparent shadow-none"
        >
            <div className="flex justify-between items-start">
            <div className="flex-1">
                <h3 className="font-bold text-base md:text-lg text-muted-foreground">Break</h3>
                <p className="text-xs md:text-sm text-muted-foreground/80 mt-1 flex items-center gap-2">
                {formatTime12h(session.startTime)} <ArrowRight className="w-3 h-3" /> {formatTime12h(session.endTime)}
                </p>
            </div>
            </div>
        </Card>
     )
  }

  return (
    <>
      <Card
        className="p-4 md:p-6 flex flex-col gap-2 rounded-xl cursor-pointer hover:shadow-md transition-shadow"
        style={{ backgroundColor: `${color}40`, borderColor: `${color}80` }}
        onClick={() => setIsDrawerOpen(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-bold text-base md:text-lg">{session.subject}</h3>
            <p className="text-xs md:text-sm text-foreground/80 mt-1 flex items-center gap-2">
              {formatTime12h(session.startTime)} <ArrowRight className="w-3 h-3" /> {formatTime12h(session.endTime)}
            </p>
            {session.room && (
              <div className="flex items-center gap-1.5 text-xs md:text-sm text-foreground/80 mt-2">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                <span>{session.room}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
      <ClassDetailsDrawer
        session={session}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </>
  );
};

function TimetableContent() {
  const { subjects, classes, shareTimetable, getSharedTimetable, importTimetable, setHeaderState } = useAppContext();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [isImporting, setIsImporting] = useState(false);
  const [sharedData, setSharedData] = useState<{ subjects: any[], classes: any[] } | null>(null);
  const importCode = useMemo(() => searchParams.get('importCode'), [searchParams]);

  useEffect(() => {
    if (importCode) {
      const fetchSharedData = async () => {
        try {
          const data = await getSharedTimetable(importCode);
          if (data) {
            setSharedData(data);
            setIsImporting(true);
          } else {
            toast({ variant: 'destructive', title: 'Invalid Link', description: 'The timetable link is invalid or has expired.' });
          }
        } catch (error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch shared timetable.' });
        }
      };
      fetchSharedData();
    }
  }, [importCode, getSharedTimetable, toast]);

  const handleShare = async () => {
    try {
      const code = await shareTimetable();
      const url = `${window.location.origin}/timetable?importCode=${code}`;
      setShareUrl(url);
      setIsShareDialogOpen(true);
    } catch (error) {
      console.error('Failed to share timetable:', error);
      toast({ variant: 'destructive', title: 'Sharing Failed', description: 'Could not create a shareable link.' });
    }
  };
  
  const handleConfirmImport = async () => {
    if (sharedData) {
      try {
        await importTimetable(sharedData.subjects, sharedData.classes);
        toast({ title: 'Success!', description: 'Timetable has been imported successfully.' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Import Failed', description: 'There was an error importing the timetable.' });
      } finally {
        setIsImporting(false);
        setSharedData(null);
        window.history.replaceState({}, '', '/timetable');
      }
    }
  };

  const handleCancelImport = () => {
    setIsImporting(false);
    setSharedData(null);
    window.history.replaceState({}, '', '/timetable');
  };

  const dailySchedule = useMemo(() => {
    const dailyClasses = classes
      .filter((c) => format(new Date(c.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd'))
      .sort((a, b) => {
          const timeA = a.startTime.split(':');
          const timeB = b.startTime.split(':');
          return new Date(0,0,0, parseInt(timeA[0]), parseInt(timeA[1])).getTime() - new Date(0,0,0, parseInt(timeB[0]), parseInt(timeB[1])).getTime();
      });

      const scheduleWithBreaks: (ClassSession & { isBreak?: boolean })[] = [];
      
      for(let i = 0; i < dailyClasses.length; i++) {
        scheduleWithBreaks.push(dailyClasses[i]);
        if (i < dailyClasses.length - 1) {
            const currentClassEnd = dailyClasses[i].endTime;
            const nextClassStart = dailyClasses[i+1].startTime;

            if (currentClassEnd < nextClassStart) {
                 scheduleWithBreaks.push({
                    id: `break-${i}`,
                    subject: 'Break',
                    startTime: currentClassEnd,
                    endTime: nextClassStart,
                    isBreak: true,
                    date: dailyClasses[i].date,
                    teacher: '',
                    room: '',
                 })
            }
        }
      }
      return scheduleWithBreaks;

  }, [classes, currentDate]);

  useEffect(() => {
    const pageActions = (
      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href={`/timetable/add?date=${format(currentDate, 'yyyy-MM-dd')}`}>
            <PlusCircle className="mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">Add Class</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </Button>
        <Button variant="outline" size="icon" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    );

    setHeaderState({
        title: format(currentDate, 'MMMM'),
        children: pageActions
    });
  }, [currentDate, setHeaderState]);

  if (subjects.length === 0 && !importCode) {
    return (
      <div className="flex flex-col gap-8 w-full p-4 md:p-6 lg:p-8">
        <div className="flex h-[60vh] items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50">
          <div className="text-center px-4">
            <p className="text-lg font-medium text-muted-foreground">No subjects found.</p>
            <p className="text-sm text-muted-foreground/80 mt-2">Add subjects in the 'Subjects' page to build your timetable.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 md:p-6 lg:p-8">
      <WeekViewCalendar selectedDate={currentDate} onDateChange={setCurrentDate} />

      <Separator />

      <div className="pb-6">
        {dailySchedule.length > 0 ? (
          <div className="flex flex-col gap-3 md:gap-4">
            {dailySchedule.map(session => (
              <TimetableCard key={session.id} session={session} isBreak={session.isBreak} />
            ))}
          </div>
        ) : (
          <div className="flex h-[50vh] flex-col items-center justify-center text-center bg-card/50 rounded-lg p-4">
            <p className="text-muted-foreground">No classes scheduled for this day.</p>
          </div>
        )}
      </div>

      <Dialog open={isImporting} onOpenChange={setIsImporting}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Timetable</DialogTitle>
            <DialogDescription>
              Do you want to import this timetable? This will replace your current subjects and classes.
            </DialogDescription>
          </DialogHeader>
          {sharedData && (
            <Card className="max-h-60 overflow-y-auto">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold">Subjects ({sharedData.subjects.length})</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {sharedData.subjects.map((s:any) => <li key={s.id}>{s.name}</li>)}
                </ul>
                <h4 className="font-semibold pt-2">Classes ({sharedData.classes.length})</h4>
                <p className="text-sm text-muted-foreground">This will import all recurring and single classes.</p>
              </CardContent>
            </Card>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={handleCancelImport} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleConfirmImport} className="w-full sm:w-auto">Yes, Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ShareDialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        shareUrl={shareUrl}
        title="Share Your Timetable"
        description="Anyone with this link can view and import your timetable."
      />
    </div>
  );
}

export default function TimetablePage() {
  return (
    <AppLayout>
      <TimetableContent />
    </AppLayout>
  );
}
