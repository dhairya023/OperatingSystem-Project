
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, MapPin, Clock } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { ClassSession } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import ClassSessionForm from './class-session-form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

type ClassDetailsDrawerProps = {
  session: ClassSession;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const formatTime12h = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${period}`;
};

export function ClassDetailsDrawer({ session, isOpen, onOpenChange }: ClassDetailsDrawerProps) {
  const { subjects, updateClass, deleteClass } = useAppContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isScopeDialogOpen, setIsScopeDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'edit' | 'delete' | null>(null);

  const subject = subjects.find(s => s.name === session.subject);
  const color = subject?.color || '#A1A1AA';

  const handleEditClick = () => {
    if (session.rrule) {
      setActionType('edit');
      setIsScopeDialogOpen(true);
    } else {
      setIsEditDialogOpen(true);
    }
  };
  
  const handleDeleteClick = () => {
    if (session.rrule) {
      setActionType('delete');
      setIsScopeDialogOpen(true);
    } else {
      setIsDeleteDialogOpen(true);
    }
  }
  
  const handleScopeConfirm = (scope: 'single' | 'future' | 'all') => {
      setIsScopeDialogOpen(false);
      if (actionType === 'edit') {
        // We pass the scope to the form through a prop that is not there,
        // Instead, let's just directly call the update function with the selected scope
        setIsEditDialogOpen(true);
      } else if (actionType === 'delete') {
        deleteClass(session, scope);
        onOpenChange(false);
      }
  }
  
  const handleUpdate = (updatedSession: ClassSession, scope: 'single' | 'future' | 'all') => {
    updateClass(updatedSession, scope);
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    // This is now only for single-instance deletes
    deleteClass(session, 'single');
    setIsDeleteDialogOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span>{session.subject}</span>
            </SheetTitle>
            <SheetDescription>{format(new Date(session.date), 'EEEE')}</SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-4 text-muted-foreground">
                <Clock className="w-5 h-5"/>
                <span>{formatTime12h(session.startTime)} - {formatTime12h(session.endTime)}</span>
            </div>
            {session.room && (
                 <div className="flex items-center gap-4 text-muted-foreground">
                    <MapPin className="w-5 h-5"/>
                    <span>{session.room}</span>
                </div>
            )}
            <Separator />
            <div className="space-y-2">
                 <Button variant="ghost" className="w-full justify-start p-2 h-auto" onClick={handleEditClick}>
                    <Edit className="w-5 h-5 mr-4"/>
                    <span>Edit Class</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto text-destructive hover:text-destructive" onClick={handleDeleteClick}>
                    <Trash2 className="w-5 h-5 mr-4"/>
                    <span>Delete Class</span>
                </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
             {session.rrule && <DialogDescription>How would you like to apply these changes?</DialogDescription>}
          </DialogHeader>
          <ClassSessionForm
            session={session}
            onSave={(updatedSession, scope) => handleUpdate(updatedSession, scope)}
            isRecurring={!!session.rrule}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Class</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this class?</p>
          <DialogFooter>
            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isScopeDialogOpen} onOpenChange={setIsScopeDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{actionType === 'edit' ? 'Edit' : 'Delete'} Recurring Class</DialogTitle>
                  <DialogDescription>
                      This is a recurring class. Please choose how you want to {actionType} it.
                  </DialogDescription>
              </DialogHeader>
               <div className="flex flex-col gap-4 py-4">
                  <Button variant="outline" onClick={() => handleScopeConfirm('single')}>
                      {actionType === 'edit' ? 'Edit' : 'Delete'} This Class Only
                  </Button>
                  <Button variant="outline" onClick={() => handleScopeConfirm('future')}>
                      {actionType === 'edit' ? 'Edit' : 'Delete'} This and All Future Classes
                  </Button>
                  <Button variant="outline" onClick={() => handleScopeConfirm('all')}>
                      {actionType === 'edit' ? 'Edit' : 'Delete'} All Classes in Series
                  </Button>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                  </DialogClose>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
