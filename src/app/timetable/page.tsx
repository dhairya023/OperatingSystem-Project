'use client';
import AppLayout from '@/components/app-layout';
import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MapPin, PlusCircle, Edit, Trash2, MoreVertical, Copy, Trash, History } from 'lucide-react';
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
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import ClassSessionForm from '@/components/timetable/class-session-form';
import { SidebarTrigger } from '@/components/ui/sidebar';

const TimetableCard = ({ session }: { session: ClassSession }) => {
  const { subjects, updateClass, deleteClass } = useAppContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editScope, setEditScope] = useState<'single' | 'future' | 'all'>('single');
  const [deleteScope, setDeleteScope] = useState<'single' | 'future' | 'all'>('single');

  const subject = subjects.find(s => s.name === session.subject);
  const color = subject?.color || '#A1A1AA'; // A default gray color

  const handleUpdate = (updatedSession: ClassSession) => {
    updateClass(updatedSession, editScope);
    setIsEditDialogOpen(false);
  }
  
  const handleDelete = () => {
    deleteClass(session, deleteScope);
    setIsDeleteDialogOpen(false);
  }

  return (
    <Card
      className="p-3 md:p-4 flex flex-col gap-2 rounded-xl"
      style={{ backgroundColor: `${color}40`, borderColor: `${color}80` }}
    >
        <div className="flex justify-between items-start">
            <div>
                 <h3 className="font-bold text-base md:text-lg">{session.subject}</h3>
                 <p className="text-xs md:text-sm text-foreground/80">{session.startTime} - {session.endTime}</p>
                 {session.room && (
                    <div className="flex items-center gap-2 text-xs md:text-sm text-foreground/80 mt-1">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{session.room}</span>
                    </div>
                )}
            </div>
             <div className="flex gap-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         <DropdownMenuItem onSelect={() => { setEditScope('single'); setIsEditDialogOpen(true); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                         <DropdownMenuItem onSelect={() => { setDeleteScope('single'); setIsDeleteDialogOpen(true); }} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                        {session.rrule && (
                          <>
                            <DropdownMenuSeparator />
                             <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <History className="mr-2 h-4 w-4" />
                                <span>Edit Recurring</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onSelect={() => { setEditScope('future'); setIsEditDialogOpen(true); }}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  <span>This and future</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => { setEditScope('all'); setIsEditDialogOpen(true); }}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  <span>All classes</span>
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete Recurring</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onSelect={() => { setDeleteScope('future'); setIsDeleteDialogOpen(true); }} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>This and future</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => { setDeleteScope('all'); setIsDeleteDialogOpen(true); }} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>All classes</span>
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Edit Class</DialogTitle></DialogHeader>
                        <ClassSessionForm 
                          session={editScope === 'single' ? {...session, rrule: undefined, repeatUntil: undefined} : session} 
                          onSave={() => setIsEditDialogOpen(false)} 
                        />
                    </DialogContent>
                </Dialog>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Delete Class</DialogTitle></DialogHeader>
                        <p>Are you sure you want to delete {deleteScope === 'single' ? 'this class' : (deleteScope === 'future' ? 'this and all future classes' : 'all classes in this series')}?</p>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    </Card>
  );
};

function TimetableContent() {
  const { subjects, classes } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
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
    <div className="flex flex-col flex-1 p-4 md:p-6 lg:p-8">
      <PageHeader title="Timetable" description="Your weekly class schedule.">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2" /> Add Class</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Add New Class</DialogTitle></DialogHeader>
                <ClassSessionForm onSave={() => setIsAddDialogOpen(false)} defaultDate={currentDate} />
            </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="flex flex-col items-center w-full mt-8">
        <div className="w-full max-w-2xl">
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

          <div className="mt-6">
            {dailyClasses.length > 0 ? (
              <div className="flex flex-col gap-4">
                {dailyClasses.map(session => (
                  <TimetableCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <div className="flex h-[50vh] flex-col items-center justify-center text-center bg-card/50 rounded-lg">
                <p className="text-muted-foreground">No classes scheduled for this day.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function TimetablePage() {
    return (
        <AppLayout>
            <TimetableContent />
        </AppLayout>
    )
}
