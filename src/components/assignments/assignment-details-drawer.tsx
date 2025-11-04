
'use client';

import { format } from 'date-fns';
import { Edit, Trash2, Calendar, FileText } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Assignment } from '@/lib/types';
import { useAppContext } from '@/context/app-context';

type AssignmentDetailsDrawerProps = {
  assignment: Assignment;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function AssignmentDetailsDrawer({
  assignment,
  isOpen,
  onOpenChange,
  onEdit,
  onDelete,
}: AssignmentDetailsDrawerProps) {
  const { subjects } = useAppContext();
  const subject = subjects.find((s) => s.name === assignment.subject);
  const color = subject?.color || '#A1A1AA';

  const handleEditClick = () => {
    onOpenChange(false); // Close drawer
    onEdit();
  };
  
  const handleDeleteClick = () => {
    onOpenChange(false); // Close drawer
    onDelete();
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
            <span>{assignment.title}</span>
          </SheetTitle>
          <SheetDescription>{assignment.subject}</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center gap-4 text-muted-foreground">
              <Calendar className="w-5 h-5"/>
              <span>Due on {format(new Date(assignment.dueDate), 'PPP')}</span>
          </div>
          {assignment.description && (
               <div className="flex items-start gap-4 text-muted-foreground">
                  <FileText className="w-5 h-5 mt-1"/>
                  <p className="flex-1 whitespace-pre-wrap">{assignment.description}</p>
              </div>
          )}
          <Separator />
          <div className="space-y-2">
               <Button variant="ghost" className="w-full justify-start p-2 h-auto" onClick={handleEditClick}>
                  <Edit className="w-5 h-5 mr-4"/>
                  <span>Edit Assignment</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto text-destructive hover:text-destructive" onClick={handleDeleteClick}>
                  <Trash2 className="w-5 h-5 mr-4"/>
                  <span>Delete Assignment</span>
              </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
