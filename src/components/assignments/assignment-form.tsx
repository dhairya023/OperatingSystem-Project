
'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import type { Assignment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type AssignmentFormProps = {
  assignment?: Assignment;
  onSave: (assignment: Assignment) => void;
};

export default function AssignmentForm({ assignment, onSave }: AssignmentFormProps) {
  const { subjects } = useAppContext();
  const [title, setTitle] = useState(assignment?.title || '');
  const [subject, setSubject] = useState(assignment?.subject || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(assignment ? new Date(assignment.dueDate) : new Date());
  const [description, setDescription] = useState(assignment?.description || '');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !dueDate) return;

    const newAssignment: Assignment = {
      id: assignment?.id || crypto.randomUUID(),
      title,
      subject,
      dueDate,
      description,
      completed: assignment?.completed || false,
    };
    
    onSave(newAssignment);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">Title</Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subject" className="text-right">Subject</Label>
          <Select onValueChange={setSubject} defaultValue={subject}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Due Date</Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date);
                      setIsDatePickerOpen(false);
                    }}
                    initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right pt-2">Description</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            className="col-span-3" 
            placeholder="Add any extra details..."
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save Assignment</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
