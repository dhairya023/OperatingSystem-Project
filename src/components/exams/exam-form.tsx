'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import type { Exam } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TimePicker } from '@/components/ui/time-picker';

type ExamFormProps = {
  exam?: Exam;
  onSave: (exam: Exam) => void;
};

export default function ExamForm({ exam, onSave }: ExamFormProps) {
  const { subjects } = useAppContext();
  const [subject, setSubject] = useState(exam?.subject || '');
  const [type, setType] = useState<Exam['type']>(exam?.type || 'Mid-term');
  const [date, setDate] = useState<Date | undefined>(exam ? new Date(exam.date) : new Date());
  const [time, setTime] = useState(exam ? format(new Date(exam.date), 'HH:mm') : '10:00');
  const [venue, setVenue] = useState(exam?.venue || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !date || !time || !venue || !type) return;

    const [hours, minutes] = time.split(':');
    const combinedDate = new Date(date);
    combinedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const newExam: Exam = {
      id: exam?.id || crypto.randomUUID(),
      subject,
      date: combinedDate,
      venue,
      type,
    };
    
    onSave(newExam);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
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
          <Label htmlFor="type" className="text-right">Type</Label>
          <Select onValueChange={(v) => setType(v as Exam['type'])} defaultValue={type}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mid-term">Mid-term</SelectItem>
              <SelectItem value="Final">Final</SelectItem>
              <SelectItem value="Quiz">Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus/>
                </PopoverContent>
            </Popover>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="time" className="text-right">Time</Label>
          <div className="col-span-3">
             <TimePicker value={time} onChange={setTime} />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="venue" className="text-right">Venue</Label>          <Input id="venue" value={venue} onChange={e => setVenue(e.target.value)} className="col-span-3" required />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save Exam</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
