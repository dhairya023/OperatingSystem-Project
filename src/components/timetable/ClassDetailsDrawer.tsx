
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, MapPin, Clock, History, Copy, Trash } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
  } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { ClassSession } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import ClassSessionForm from './class-session-form';

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
  const [editScope, setEditScope] = useState<'single' | 'future' | 'all'>('single');
  const [deleteScope, setDeleteScope] = useState<'single' | 'future' | 'all'>('single');

  const subject = subjects.find(s => s.name === session.subject);
  const color = subject?.color || '#A1A1AA';

  const handleUpdate = (updatedSession: ClassSession) => {
    updateClass(updatedSession, editScope);
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    deleteClass(session, deleteScope);
    setIsDeleteDialogOpen(false);
    onOpenChange(false);
  };
  
  const openEditDialog = (scope: 'single' | 'future' | 'all') => {
      setEditScope(scope);
      setIsEditDialogOpen(true);
  }
  
  const openDeleteDialog = (scope: 'single' | 'future' | 'all') => {
      setDeleteScope(scope);
      setIsDeleteDialogOpen(true);
  }

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
                 <Button variant="ghost" className="w-full justify-start p-2 h-auto" onClick={() => openEditDialog('single')}>
                    <Edit className="w-5 h-5 mr-4"/>
                    <span>Edit</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto text-destructive hover:text-destructive" onClick={() => openDeleteDialog('single')}>
                    <Trash2 className="w-5 h-5 mr-4"/>
                    <span>Delete</span>
                </Button>
            </div>

            {session.rrule && (
                <>
                    <Separator />
                    <p className="text-xs text-muted-foreground px-2">This is a recurring class.</p>
                     <div className="space-y-2">
                         <Button variant="ghost" className="w-full justify-start p-2 h-auto" onClick={() => openEditDialog('future')}>
                            <Copy className="w-5 h-5 mr-4"/>
                            <span>Edit this and future classes</span>
                        </Button>
                          <Button variant="ghost" className="w-full justify-start p-2 h-auto" onClick={() => openEditDialog('all')}>
                            <History className="w-5 h-5 mr-4"/>
                            <span>Edit all classes</span>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start p-2 h-auto text-destructive hover:text-destructive" onClick={() => openDeleteDialog('future')}>
                            <Trash className="w-5 h-5 mr-4"/>
                            <span>Delete this and future classes</span>
                        </Button>
                         <Button variant="ghost" className="w-full justify-start p-2 h-auto text-destructive hover:text-destructive" onClick={() => openDeleteDialog('all')}>
                            <Trash2 className="w-5 h-5 mr-4"/>
                            <span>Delete all classes</span>
                        </Button>
                    </div>
                </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          <ClassSessionForm
            session={editScope === 'single' ? { ...session, rrule: undefined } : session}
            onSave={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Class</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{' '}
            {deleteScope === 'single'
              ? 'this class'
              : deleteScope === 'future'
              ? 'this and all future classes'
              : 'all classes in this series'}
            ?
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
