
'use client';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import type { ClassSession } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TimePicker } from '@/components/ui/time-picker';
import { Separator } from '../ui/separator';
import Link from 'next/link';

type ClassSessionFormProps = {
  session?: ClassSession;
  onSave: (session: ClassSession, scope?: 'single' | 'future' | 'all') => void;
  defaultDate?: Date;
  isRecurring?: boolean;
  className?: string;
};

export default function ClassSessionForm({ session, onSave, defaultDate, isRecurring = false, className }: ClassSessionFormProps) {
  const { subjects, addClass } = useAppContext();
  const [subject, setSubject] = useState(session?.subject || '');
  const [date, setDate] = useState<Date | undefined>(session ? new Date(session.date) : (defaultDate || new Date()));
  const [startTime, setStartTime] = useState(session?.startTime || '');
  const [endTime, setEndTime] = useState(session?.endTime || '');
  const [room, setRoom] = useState(session?.room || '');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const [repeat, setRepeat] = useState<'once' | 'weekly'>(session?.rrule ? 'weekly' : 'weekly');
  
  useEffect(() => {
    if (startTime && !session) { // only on creation and when startTime is set
        const [hour, minute] = startTime.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hour, minute);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // add 1 hour
        setEndTime(`${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`);
    }
  }, [startTime, session]);


  const handleSubmit = (scope: 'single' | 'future' | 'all' = 'single') => {
    if (!subject || !date || !startTime || !endTime) return;
    
    const selectedSubject = subjects.find(s => s.name === subject);
    if (!selectedSubject) return;

    const newSession: ClassSession = {
      id: session?.id || crypto.randomUUID(),
      subject,
      teacher: selectedSubject.teacher || '',
      startTime,
      endTime,
      room,
      status: session?.status, // Keep existing status
      date,
      ...(repeat === 'weekly' && !session && { rrule: crypto.randomUUID(), repeatUntil: addMonths(new Date(date), 3) }),
      ...(session?.rrule && { rrule: session.rrule, repeatUntil: session.repeatUntil })
    };
    
    if (session) {
      onSave(newSession, scope);
    } else {
      addClass(newSession); // addClass handles recurrence itself
      onSave(newSession); // To close the dialog/page
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
        <div className="space-y-4">
            <div className="space-y-2">
            <Label>Subject</Label>
            <Select onValueChange={setSubject} defaultValue={subject}>
                <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                <Separator className="my-2" />
                 <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/subjects">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
                    </Link>
                  </Button>
                </SelectContent>
            </Select>
            </div>

            {!session && ( // Only show repeat options when creating a new class
            <>
                <div className="space-y-2">
                <Label>Repeat</Label>
                <RadioGroup defaultValue={repeat} onValueChange={(value: 'once' | 'weekly') => setRepeat(value)} className="flex">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="r-weekly" />
                        <Label htmlFor="r-weekly">Weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="once" id="r-once" />
                        <Label htmlFor="r-once">Once</Label>
                    </div>
                </RadioGroup>
                </div>
            </>
            )}

            <div className="space-y-2">
                <Label>
                {repeat === 'weekly' && !session ? 'Start Date' : 'Date'}
                </Label>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal",!date && "text-muted-foreground")}
                        disabled={isRecurring}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={(d) => {setDate(d); setIsDatePickerOpen(false);}} initialFocus/></PopoverContent>
                </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Start Time</Label>
                    <TimePicker value={startTime} onChange={setStartTime} />
                </div>
                <div className="space-y-2">
                    <Label>End Time</Label>
                    <TimePicker value={endTime} onChange={setEndTime} />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Room/Venue</Label>
                <Input value={room} onChange={(e) => setRoom(e.target.value)} />
            </div>
      </div>
      
      <div>
        {isRecurring ? (
            <div className="flex flex-col gap-2 w-full">
                <Separator className="my-4" />
                <Button type="button" onClick={() => handleSubmit('single')}>Save For This Class Only</Button>
                <Button type="button" onClick={() => handleSubmit('future')}>Save For This & Future Classes</Button>
                <Button type="button" onClick={() => handleSubmit('all')}>Save For All Classes</Button>
            </div>
        ) : (
            <Button type="button" className="w-full" onClick={() => handleSubmit('single')}>Save Class</Button>
        )}
      </div>
    </div>
  );
}
