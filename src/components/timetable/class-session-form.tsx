
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
import { format, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TimePicker } from '@/components/ui/time-picker';
import { Separator } from '../ui/separator';

type ClassSessionFormProps = {
  session?: ClassSession;
  onSave: (session: ClassSession, scope: 'single' | 'future' | 'all') => void;
  defaultDate?: Date;
  isRecurring?: boolean;
};

export default function ClassSessionForm({ session, onSave, defaultDate, isRecurring = false }: ClassSessionFormProps) {
  const { subjects, addClass } = useAppContext();
  const [subject, setSubject] = useState(session?.subject || '');
  const [date, setDate] = useState<Date | undefined>(session ? new Date(session.date) : (defaultDate || new Date()));
  const [startTime, setStartTime] = useState(session?.startTime || '');
  const [endTime, setEndTime] = useState(session?.endTime || '');
  const [room, setRoom] = useState(session?.room || '');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const [repeat, setRepeat] = useState<'once' | 'weekly'>(session?.rrule ? 'weekly' : 'once');
  const [editScope, setEditScope] = useState<'single' | 'future' | 'all'>('single');
  
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
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
      status: session?.status, // Keep existing status
      date,
      ...(repeat === 'weekly' && !session && { rrule: crypto.randomUUID(), repeatUntil: addMonths(new Date(date), 3) }),
      ...(session?.rrule && { rrule: session.rrule, repeatUntil: session.repeatUntil })
    };
    
    if (session) {
      const scope = (e.currentTarget.dataset.scope as 'single' | 'future' | 'all') || 'single';
      onSave(newSession, scope);
    } else {
      addClass(newSession); // addClass handles recurrence itself
    }
  };

  return (
    <form>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <Label htmlFor="subject" className="text-left md:text-right">Subject</Label>
          <Select onValueChange={setSubject} defaultValue={subject}>
            <SelectTrigger className="md:col-span-3">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {!session && ( // Only show repeat options when creating a new class
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="text-left md:text-right">Repeat</Label>
              <RadioGroup defaultValue={repeat} onValueChange={(value: 'once' | 'weekly') => setRepeat(value)} className="flex md:col-span-3">
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="once" id="r-once" />
                    <Label htmlFor="r-once">Once</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="r-weekly" />
                    <Label htmlFor="r-weekly">Weekly</Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-left md:text-right">
              {repeat === 'weekly' && !session ? 'Start Date' : 'Date'}
            </Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn("md:col-span-3 justify-start text-left font-normal",!date && "text-muted-foreground")}
                    disabled={isRecurring && editScope !== 'single'}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={(d) => {setDate(d); setIsDatePickerOpen(false);}} initialFocus/></PopoverContent>
            </Popover>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <Label className="text-left md:text-right">Start Time</Label>
          <div className="md:col-span-3">
            <TimePicker value={startTime} onChange={setStartTime} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <Label className="text-left md:text-right">End Time</Label>
          <div className="md:col-span-3">
            <TimePicker value={endTime} onChange={setEndTime} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <Label htmlFor="room" className="text-left md:text-right">Room/Venue</Label>
          <Input id="room" value={room} onChange={(e) => setRoom(e.target.value)} className="md:col-span-3" />
        </div>
      </div>
      <DialogFooter>
        {isRecurring ? (
            <div className="flex flex-col gap-2 w-full">
                <Separator />
                <DialogClose asChild>
                    <Button type="button" data-scope="single" onClick={handleSubmit}>Save For This Class Only</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" data-scope="future" onClick={handleSubmit}>Save For This & Future Classes</Button>
                </DialogClose>
                 <DialogClose asChild>
                    <Button type="button" data-scope="all" onClick={handleSubmit}>Save For All Classes</Button>
                </DialogClose>
            </div>
        ) : (
            <DialogClose asChild>
              <Button type="button" data-scope="single" onClick={handleSubmit}>Save Class</Button>
            </DialogClose>
        )}
      </DialogFooter>
    </form>
  );
}
