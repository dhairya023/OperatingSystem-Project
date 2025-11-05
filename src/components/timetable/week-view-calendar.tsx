
'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { eachDayOfInterval, startOfWeek, endOfWeek, addWeeks, subWeeks, format, isSameDay, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';

interface WeekViewCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WeekViewCalendar: React.FC<WeekViewCalendarProps> = ({ selectedDate, onDateChange }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 }));
  
  const weeks = useMemo(() => {
    const middleIndex = 50;
    return Array.from({ length: 101 }, (_, i) => {
      const weekDiff = i - middleIndex;
      return startOfWeek(addWeeks(new Date(), weekDiff), { weekStartsOn: 1 });
    });
  }, []);

  const initialSlide = useMemo(() => weeks.findIndex(week => isSameDay(week, startOfWeek(selectedDate, { weekStartsOn: 1 }))), [weeks, selectedDate]);
  
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrentWeek(weeks[selectedIndex]);
    };
    
    api.on('select', handleSelect);

    return () => {
      api.off('select', handleSelect);
    };

  }, [api, weeks]);

  useEffect(() => {
    if (api && initialSlide !== -1) {
        api.scrollTo(initialSlide, true);
    }
  }, [api, initialSlide]);

  return (
    <div className="w-full">
      <Carousel 
        opts={{
            align: 'start',
            loop: false,
            startIndex: initialSlide,
        }}
        setApi={setApi}
      >
        <CarouselContent>
            {weeks.map((week, weekIndex) => {
                const days = eachDayOfInterval({ start: week, end: endOfWeek(week, { weekStartsOn: 1 }) });
                return (
                    <CarouselItem key={weekIndex} className="basis-auto">
                        <div className="flex gap-1 justify-center">
                            {days.map((day) => (
                                <button
                                key={day.toString()}
                                onClick={() => onDateChange(day)}
                                className={cn(
                                    'flex flex-col items-center justify-center p-2 rounded-lg gap-2 w-14 transition-colors',
                                    isSameDay(day, selectedDate)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                                )}
                                >
                                <span className="text-xs uppercase font-medium">{format(day, 'E')}</span>
                                <span className="text-lg font-bold">{format(day, 'd')}</span>
                                </button>
                            ))}
                        </div>
                    </CarouselItem>
                )
            })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default WeekViewCalendar;