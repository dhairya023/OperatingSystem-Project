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
  
  const [repeat, setRepeat] = useState<'once' | 'weekly'>(session?.rrule ? 'weekly' : 'once');
  const [repeatUntil, setRepeatUntil] = useState<Date | undefined>(session?.repeatUntil ? new Date(session.repeatUntil) : addMonths(new Date(), 3));

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
      ...(repeat === 'weekly' && { rrule: session?.rrule || crypto.randomUUID(), repeatUntil: repeatUntil }),
    };
    
    if (session) {
      // The update logic is handled via a dialog in the timetable page now.
      // This form is now primarily for single instance edits.
      updateClass(newSession, 'single');
    } else {
      addClass(newSession);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
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

        {!session && ( // Don't show repeat options when editing a single instance
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
            
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-left md:text-right">
                  {repeat === 'weekly' ? 'Start Date' : 'Date'}
                </Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn("md:col-span-3 justify-start text-left font-normal",!date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus/></PopoverContent>
                </Popover>
            </div>

            {repeat === 'weekly' && (
               <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="repeat-until-date" className="text-left md:text-right">Repeat Until</Label>
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button
                          variant={"outline"}
                          className={cn("md:col-span-3 justify-start text-left font-normal",!repeatUntil && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {repeatUntil ? format(repeatUntil, "PPP") : <span>Pick an end date</span>}
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={repeatUntil} onSelect={setRepeatUntil} initialFocus/></PopoverContent>
                  </Popover>
              </div>
            )}
          </>
        )}

        {session && ( // Only show date for single edits
           <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-left md:text-right">Date</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("md:col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
            </Popover>
           </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <Label htmlFor="start-time" className="text-left md:text-right">Start Time</Label>
          <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="md:col-span-3" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <Label htmlFor="end-time" className="text-left md:text-right">End Time</Label>
          <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="md:col-span-3" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <Label htmlFor="room" className="text-left md:text-right">Room/Venue</Label>
          <Input id="room" value={room} onChange={(e) => setRoom(e.target.value)} className="md:col-span-3" />
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
