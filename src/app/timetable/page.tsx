
'use client';
import AppLayout from '@/components/app-layout';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MapPin, PlusCircle, Share2, Copy, Trash, History } from 'lucide-react';
import { addDays, subDays, format, isToday, isTomorrow, isYesterday, startOfDay } from 'date-fns';
import { Card } from '@/components/ui/card';
import type { ClassSession } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import ClassSessionForm from '@/components/timetable/class-session-form';
import { ClassDetailsDrawer } from '@/components/timetable/ClassDetailsDrawer';
import { useToast } from '@/hooks/use-toast';
import { ShareDialog } from '@/components/share-dialog';

const formatTime12h = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${period}`;
};

const TimetableCard = ({ session }: { session: ClassSession }) => {
  const { subjects } = useAppContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const subject = subjects.find(s => s.name === session.subject);
  const color = subject?.color || '#A1A1AA'; // A default gray color

  return (
    <>
      <Card
        className="p-6 flex flex-col gap-2 rounded-xl cursor-pointer"
        style={{ backgroundColor: `${color}40`, borderColor: `${color}80` }}
        onClick={() => setIsDrawerOpen(true)}
      >
          <div className="flex justify-between items-start">
              <div>
                   <h3 className="font-bold text-base md:text-lg">{session.subject}</h3>
                   <p className="text-xs md:text-sm text-foreground/80">{formatTime12h(session.startTime)} - {formatTime12h(session.endTime)}</p>
                   {session.room && (
                      <div className="flex items-center gap-2 text-xs md:text-sm text-foreground/80 mt-1">
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
  const { subjects, classes, shareTimetable, getSharedTimetable, importTimetable } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
        // Remove query param from URL without reloading
        window.history.replaceState({}, '', '/timetable');
      }
    }
  };

  const handleCancelImport = () => {
    setIsImporting(false);
    setSharedData(null);
    window.history.replaceState({}, '', '/timetable');
  };

  const handlePrevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  
  const getRelativeDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE');
  }

  const dailyClasses = classes
    .filter((c) => format(new Date(c.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd'))
    .sort((a, b) => {
        const timeA = a.startTime.split(':');
        const timeB = b.startTime.split(':');
        return new Date(0,0,0, parseInt(timeA[0]), parseInt(timeA[1])).getTime() - new Date(0,0,0, parseInt(timeB[0]), parseInt(timeB[1])).getTime()
    });

  if (subjects.length === 0 && !importCode) {
    return (
      <div className="flex flex-col flex-1">
        <PageHeader title="Timetable" description="Manage your class schedule." />
        <div className="flex h-[60vh] items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">No subjects found.</p>
            <p className="text-sm text-muted-foreground/80">Add subjects in the 'Subjects' page to build your timetable.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="w-full">
        <div>
            <PageHeader title="Timetable" description="Your weekly class schedule.">
                <div className="flex items-center gap-2">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><PlusCircle className="mr-2" /> Add Class</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Add New Class</DialogTitle></DialogHeader>
                            <ClassSessionForm onSave={() => setIsAddDialogOpen(false)} defaultDate={currentDate} />
                        </DialogContent>
                    </Dialog>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleShare}><Share2/></Button>
                 </div>
            </PageHeader>
        </div>


        <div className="w-full flex-1 flex flex-col mt-8">
            <div className="w-full flex-1 flex flex-col">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <Button variant="ghost" size="icon" onClick={handlePrevDay}>
                <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="text-center">
                <p className="font-bold text-base md:text-lg">{getRelativeDate(currentDate)}</p>
                <p className="text-muted-foreground text-xs">{format(currentDate, 'do MMMM yyyy')}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleNextDay}>
                <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            <div className="mt-6 flex-1 pb-8 min-h-[50vh]">
                {dailyClasses.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {dailyClasses.map(session => (
                    <TimetableCard key={session.id} session={session} />
                    ))}
                </div>
                ) : (
                <div className="flex h-full min-h-[50vh] flex-col items-center justify-center text-center bg-card/50 rounded-lg">
                    <p className="text-muted-foreground">No classes scheduled for this day.</p>
                </div>
                )}
            </div>
            </div>
        </div>

        <Dialog open={isImporting} onOpenChange={setIsImporting}>
          <DialogContent>
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
            <DialogFooter>
              <Button variant="ghost" onClick={handleCancelImport}>Cancel</Button>
              <Button onClick={handleConfirmImport}>Yes, Import</Button>
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
    </div>
  );
}


export default function TimetablePage() {
    return (
        <AppLayout>
            <div className="w-full p-4 md:p-6 lg:p-8">
                <TimetableContent />
            </div>
        </AppLayout>
    )
}
