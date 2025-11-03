'use client';
import * as React from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const initialHour24 = value ? parseInt(value.split(':')[0]) : 10;
  const initialMinute = value ? parseInt(value.split(':')[1]) : 0;
  const initialPeriod = initialHour24 >= 12 ? 'PM' : 'AM';
  const initialHour12 = initialHour24 % 12 || 12;

  const [hour, setHour] = React.useState(initialHour12);
  const [minute, setMinute] = React.useState(initialMinute);
  const [period, setPeriod] = React.useState(initialPeriod);

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

  const handleHourChange = (amount: number) => {
    setHour((prevHour) => (prevHour + amount + 11) % 12 + 1);
  };

  const handleMinuteChange = (amount: number) => {
    setMinute((prevMinute) => (prevMinute + amount + 60) % 60);
  };
  
  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    setPeriod(newPeriod);
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
      <PopoverContent className="w-auto p-0">
        <div className="p-4">
          <div className="flex items-center justify-center gap-2">
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleHourChange(1)}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-mono tabular-nums">{String(hour).padStart(2, '0')}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleHourChange(-1)}>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-2xl pb-2">:</span>
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMinuteChange(5)}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-mono tabular-nums">{String(minute).padStart(2, '0')}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMinuteChange(-5)}>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2 ml-2">
              <Button
                variant={period === 'AM' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => handlePeriodChange('AM')}
              >
                AM
              </Button>
              <Button
                variant={period === 'PM' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => handlePeriodChange('PM')}
              >
                PM
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => onChange('')}>Clear</Button>
            <Button onClick={() => setIsOpen(false)}>Done</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
