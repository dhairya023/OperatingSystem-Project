
'use client';
import * as React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from './tabs';

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [view, setView] = React.useState<'hour' | 'minute'>('hour');

  const initialHour24 = value ? parseInt(value.split(':')[0]) : 10;
  const initialMinute = value ? parseInt(value.split(':')[1]) : 0;
  const initialPeriod = initialHour24 >= 12 ? 'PM' : 'AM';
  const initialHour12 = initialHour24 % 12 || 12;
  
  const [hour, setHour] = React.useState(initialHour12);
  const [minute, setMinute] = React.useState(initialMinute);
  const [period, setPeriod] = React.useState<'AM' | 'PM'>(initialPeriod);

  const updateTime = React.useCallback((h: number, m: number, p: string) => {
    let hour24 = h;
    if (p === 'PM' && h < 12) {
      hour24 += 12;
    }
    if (p === 'AM' && h === 12) {
      hour24 = 0;
    }
    const formattedTime = `${String(hour24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    onChange(formattedTime);
  }, [onChange]);
  
  React.useEffect(() => {
    updateTime(hour, minute, period);
  }, [hour, minute, period, updateTime]);

  const handleHourClick = (h: number) => {
    setHour(h);
    setView('minute');
  };

  const handleMinuteClick = (m: number) => {
    setMinute(m);
    setIsOpen(false);
  };
  
  const handlePeriodChange = (p: 'AM' | 'PM') => {
    setPeriod(p);
  };

  const formatDisplayTime = () => {
    if (!value) return 'Select time';
    const [h, m] = value.split(':');
    const hour12 = parseInt(h) % 12 || 12;
    const currentPeriod = parseInt(h) >= 12 ? 'PM' : 'AM';
    return `${String(hour12).padStart(2, '0')}:${m} ${currentPeriod}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplayTime()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
                <Button 
                    variant={view === 'hour' ? 'default' : 'ghost'} 
                    onClick={() => setView('hour')}
                    className="text-5xl h-auto p-2 font-bold"
                >
                    {String(hour).padStart(2, '0')}
                </Button>
                <span className="text-5xl font-bold text-muted-foreground">:</span>
                <Button 
                    variant={view === 'minute' ? 'default' : 'ghost'}
                    onClick={() => setView('minute')}
                    className="text-5xl h-auto p-2 font-bold"
                >
                    {String(minute).padStart(2, '0')}
                </Button>
                <div className="flex flex-col gap-1 ml-2">
                    <Button variant={period === 'AM' ? 'secondary' : 'ghost'} size="sm" className="h-8 text-xs" onClick={() => handlePeriodChange('AM')}>AM</Button>
                    <Button variant={period === 'PM' ? 'secondary' : 'ghost'} size="sm" className="h-8 text-xs" onClick={() => handlePeriodChange('PM')}>PM</Button>
                </div>
            </div>

            <div className="relative w-64 h-64">
                <div className="absolute w-full h-full rounded-full bg-muted/40"></div>
                {view === 'hour' && hours.map((h, i) => {
                    const angle = (i - 2) * 30; // 30 degrees per hour, starting from 1 at 30deg
                    const x = 50 + 40 * Math.cos((angle * Math.PI) / 180);
                    const y = 50 + 40 * Math.sin((angle * Math.PI) / 180);
                    return (
                        <Button
                            key={h}
                            variant={hour === h ? 'default' : 'ghost'}
                            size="icon"
                            className="absolute w-10 h-10 rounded-full"
                            style={{ top: `calc(${y}% - 20px)`, left: `calc(${x}% - 20px)` }}
                            onClick={() => handleHourClick(h)}
                        >
                            {h}
                        </Button>
                    )
                })}
                {view === 'minute' && minutes.map((m, i) => {
                     const angle = (i * 5 - 15) * 6; // 6 degrees per minute, shifted
                     const x = 50 + 40 * Math.cos((angle * Math.PI) / 180);
                     const y = 50 + 40 * Math.sin((angle * Math.PI) / 180);
                    return (
                         <Button
                            key={m}
                            variant={minute === m ? 'default' : 'ghost'}
                            size="icon"
                            className="absolute w-10 h-10 rounded-full text-xs"
                            style={{ top: `calc(${y}% - 20px)`, left: `calc(${x}% - 20px)` }}
                            onClick={() => handleMinuteClick(m)}
                        >
                            {String(m).padStart(2, '0')}
                        </Button>
                    )
                })}
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
