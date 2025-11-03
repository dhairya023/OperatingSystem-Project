'use client';
import AppLayout from '@/components/app-layout';
import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, MoreVertical, Calendar, MapPin, Tag } from 'lucide-react';
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
} from '@/components/ui/dropdown-menu';
import { useAppContext } from '@/context/app-context';
import type { Exam } from '@/lib/types';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import ExamForm from '@/components/exams/exam-form';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const ExamItem = ({ exam, onEdit, onDelete }: { exam: Exam, onEdit: () => void, onDelete: () => void }) => {
  const { subjects } = useAppContext();
  const subject = subjects.find(s => s.name === exam.subject);
  const isOver = isPast(new Date(exam.date));

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex justify-between items-start">
             <div>
                <p className={cn("font-semibold", isOver && "line-through text-muted-foreground")}>
                    {exam.subject}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    {subject && <div className="w-2 h-2 rounded-full" style={{backgroundColor: subject.color}}></div>}
                    <p className="text-sm text-muted-foreground">{exam.type}</p>
                </div>
             </div>
             <Badge variant={isOver ? 'outline' : 'secondary'}>{isOver ? 'Completed' : 'Upcoming'}</Badge>
        </div>
       
        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4"/>
                <span>{format(new Date(exam.date), 'PPP, p')}</span>
            </div>
             <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4"/>
                <span>{exam.venue}</span>
            </div>
        </div>
         <p className={cn("text-xs mt-3", isOver ? 'text-muted-foreground' : 'text-primary font-medium')}>
            {isOver ? `Completed ${formatDistanceToNow(new Date(exam.date), { addSuffix: true })}` : `In ${formatDistanceToNow(new Date(exam.date), { addSuffix: false })}`}
        </p>
      </div>
      {!isOver && (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};


function ExamsContent() {
  const { exams, addExam, updateExam, deleteExam } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | undefined>(undefined);

  const upcomingExams = exams.filter(e => !isPast(new Date(e.date))).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastExams = exams.filter(e => isPast(new Date(e.date))).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSaveExam = (exam: Exam) => {
    if (selectedExam) {
      updateExam(exam);
    } else {
      addExam(exam);
    }
    setIsFormOpen(false);
    setSelectedExam(undefined);
  };
  
  const handleDeleteExam = () => {
    if(selectedExam) {
        deleteExam(selectedExam.id);
        setIsDeleteDialogOpen(false);
        setSelectedExam(undefined);
    }
  }

  const openEditDialog = (exam: Exam) => {
    setSelectedExam(exam);
    setIsFormOpen(true);
  }

  const openDeleteDialog = (exam: Exam) => {
    setSelectedExam(exam);
    setIsDeleteDialogOpen(true);
  }
  
  const openNewDialog = () => {
    setSelectedExam(undefined);
    setIsFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <PageHeader title="Exams" description="Schedule and prepare for your upcoming exams.">
         <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={openNewDialog}>
                    <PlusCircle className="mr-2" /> Add Exam
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedExam ? 'Edit' : 'Add'} Exam</DialogTitle>
                </DialogHeader>
                <ExamForm onSave={handleSaveExam} exam={selectedExam} />
            </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-1">
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
                <CardDescription>You have {upcomingExams.length} upcoming exams.</CardDescription>
            </CardHeader>
            <CardContent>
                {upcomingExams.length > 0 ? (
                <div className="space-y-4">
                    {upcomingExams.map((exam) => (
                        <ExamItem 
                            key={exam.id}
                            exam={exam}
                            onEdit={() => openEditDialog(exam)}
                            onDelete={() => openDeleteDialog(exam)}
                        />
                    ))}
                </div>
                 ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">No upcoming exams. Time to schedule!</p>
                </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Past Exams</CardTitle>
                <CardDescription>{pastExams.length} exams completed.</CardDescription>
            </CardHeader>
            <CardContent>
               {pastExams.length > 0 ? (
                <div className="space-y-4">
                     {pastExams.map((exam) => (
                         <ExamItem 
                            key={exam.id}
                            exam={exam}
                            onEdit={() => openEditDialog(exam)}
                            onDelete={() => openDeleteDialog(exam)}
                        />
                     ))}
                </div>
                 ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">No exams have been completed yet.</p>
                </div>
                )}
            </CardContent>
        </Card>
      </div>

       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Delete Exam</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete the exam for "{selectedExam?.subject}"? This action cannot be undone.</p>
                    <DialogFooter>
                    <DialogClose asChild><Button variant="ghost" onClick={() => setSelectedExam(undefined)}>Cancel</Button></DialogClose>
                    <Button variant="destructive" onClick={handleDeleteExam}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}


export default function ExamsPage() {
    return (
        <AppLayout>
            <ExamsContent />
        </AppLayout>
    )
}
