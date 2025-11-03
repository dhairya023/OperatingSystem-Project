'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import type { ClassSession } from '@/lib/types';
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

type ClassSessionFormProps = {
  session?: ClassSession;
  onSave: () => void;
  defaultDate?: Date;
};

export default function ClassSessionForm({ session, onSave, defaultDate }: ClassSessionFormProps) {
  const { subjects, addClass, updateClass } = useAppContext();
  const [subject, setSubject] = useState(session?.subject || '');
  const [date, setDate] = useState<Date | undefined>(session ? new Date(session.date) : (defaultDate || new Date()));
  const [startTime, setStartTime] = useState(session?.startTime || '');
  const [endTime, setEndTime] = useState(session?.endTime || '');
  const [room, setRoom] = useState(session?.room || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !date || !startTime || !endTime) return;
    
    const selectedSubject = subjects.find(s => s.name === subject);
    if (!selectedSubject) return;

    const newSession: ClassSession = {
      id: session?.id || crypto.randomUUID(),
      subject,
      teacher: selectedSubject.teacher,
      startTime,
      endTime,
      room,
      status: session?.status || 'attended', // Default status
      date,
    };
    
    if (session) {
      updateClass(newSession);
    } else {
      addClass(newSession);
    }
    onSave();
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
            <Label htmlFor="date" className="text-right">Date</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="start-time" className="text-right">Start Time</Label>
          <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="end-time" className="text-right">End Time</Label>
          <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="room" className="text-right">Room</Label>
          <Input id="room" value={room} onChange={(e) => setRoom(e.target.value)} className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save Class</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
