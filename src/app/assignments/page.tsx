
'use client';
import AppLayout from '@/components/app-layout';
import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppContext } from '@/context/app-context';
import type { Assignment } from '@/lib/types';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import AssignmentForm from '@/components/assignments/assignment-form';
import { cn } from '@/lib/utils';
import { AssignmentDetailsDrawer } from '@/components/assignments/assignment-details-drawer';

const AssignmentItem = ({ assignment, onEdit, onDelete, onToggle }: { assignment: Assignment, onEdit: () => void, onDelete: () => void, onToggle: (id: string) => void }) => {
  const { subjects } = useAppContext();
  const subject = subjects.find(s => s.name === assignment.subject);
  const isOverdue = !assignment.completed && isPast(new Date(assignment.dueDate));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <div 
        className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer"
        onClick={() => setIsDrawerOpen(true)}
      >
        <div className="mt-1" onClick={(e) => e.stopPropagation()}>
            <Checkbox
                id={`ass-${assignment.id}`}
                checked={assignment.completed}
                onCheckedChange={() => onToggle(assignment.id)}
            />
        </div>
        <div className="flex-1">
          <label htmlFor={`ass-${assignment.id}`} className={cn("font-semibold text-base", assignment.completed && "line-through text-muted-foreground")}>
              {assignment.title}
          </label>
          <div className="flex items-center gap-2 mt-1">
              {subject && <div className="w-2 h-2 rounded-full" style={{backgroundColor: subject.color}}></div>}
              <p className="text-sm text-muted-foreground">{assignment.subject}</p>
          </div>
          <p className={cn("text-sm mt-2", isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground')}>
              Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
          </p>
        </div>
      </div>
      <AssignmentDetailsDrawer
        assignment={assignment}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
};


function AssignmentsContent() {
  const { assignments, addAssignment, updateAssignment, deleteAssignment, toggleAssignmentCompletion } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | undefined>(undefined);

  const pendingAssignments = assignments.filter(a => !a.completed).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completedAssignments = assignments.filter(a => a.completed).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const handleSaveAssignment = (assignment: Assignment) => {
    if (selectedAssignment) {
      updateAssignment(assignment);
    } else {
      addAssignment(assignment);
    }
    setIsFormOpen(false);
    setSelectedAssignment(undefined);
  };
  
  const handleDeleteAssignment = () => {
    if(selectedAssignment) {
        deleteAssignment(selectedAssignment.id);
        setIsDeleteDialogOpen(false);
        setSelectedAssignment(undefined);
    }
  }

  const openEditDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsFormOpen(true);
  }

  const openDeleteDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsDeleteDialogOpen(true);
  }
  
  const openNewDialog = () => {
    setSelectedAssignment(undefined);
    setIsFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <PageHeader title="Assignments" description="Keep track of all your assignments.">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={openNewDialog}>
                    <PlusCircle className="mr-2" /> Add Assignment
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedAssignment ? 'Edit' : 'Add'} Assignment</DialogTitle>
                </DialogHeader>
                <AssignmentForm onSave={handleSaveAssignment} assignment={selectedAssignment} />
            </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Pending</CardTitle>
                <CardDescription>You have {pendingAssignments.length} assignments due.</CardDescription>
            </CardHeader>
            <CardContent>
                {pendingAssignments.length > 0 ? (
                <div className="space-y-4">
                    {pendingAssignments.map((assignment) => (
                        <AssignmentItem 
                            key={assignment.id}
                            assignment={assignment}
                            onEdit={() => openEditDialog(assignment)}
                            onDelete={() => openDeleteDialog(assignment)}
                            onToggle={toggleAssignmentCompletion}
                        />
                    ))}
                </div>
                ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">No pending assignments. Great job!</p>
                </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Completed</CardTitle>
                <CardDescription>You have completed {completedAssignments.length} assignments.</CardDescription>
            </CardHeader>
            <CardContent>
              {completedAssignments.length > 0 ? (
                <div className="space-y-4">
                    {completedAssignments.map((assignment) => (
                        <AssignmentItem 
                            key={assignment.id}
                            assignment={assignment}
                            onEdit={() => openEditDialog(assignment)}
                            onDelete={() => openDeleteDialog(assignment)}
                            onToggle={toggleAssignmentCompletion}
                        />
                    ))}
                </div>
                ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">No assignments completed yet.</p>
                </div>
                )}
            </CardContent>
        </Card>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Delete Assignment</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete the assignment "{selectedAssignment?.title}"? This action cannot be undone.</p>
                    <DialogFooter>
                    <DialogClose asChild><Button variant="ghost" onClick={() => setSelectedAssignment(undefined)}>Cancel</Button></DialogClose>
                    <Button variant="destructive" onClick={handleDeleteAssignment}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}

export default function AssignmentsPage() {
    return (
        <AppLayout>
            <AssignmentsContent />
        </AppLayout>
    )
}
