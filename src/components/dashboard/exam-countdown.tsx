"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { isPast, format } from "date-fns";

const calculateTimeLeft = (targetDate: Date) => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

export default function ExamCountdown() {
  const { exams } = useAppContext();
  const upcomingExams = exams.filter(exam => !isPast(new Date(exam.date))).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextExam = upcomingExams.length > 0 ? upcomingExams[0] : null;

  const [timeLeft, setTimeLeft] = useState(nextExam ? calculateTimeLeft(nextExam.date) : null);

  useEffect(() => {
    if (!nextExam) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(nextExam.date));
    }, 1000);

    return () => clearInterval(timer);
  }, [nextExam]);

  if (!nextExam || !timeLeft) {
    return (
      <Card className="flex h-full flex-col justify-center">
        <CardHeader>
          <CardTitle>Exam Countdown</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center gap-2">
            <Clock className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground">No upcoming exams scheduled.</p>
        </CardContent>
      </Card>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-base font-bold">Next Exam: {nextExam.subject}</CardTitle>
        <CardDescription className="text-xs">
          {format(new Date(nextExam.date), "EEEE, LLLL d, h:mm a")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-4 gap-2 text-center w-full">
          {timeUnits.map((unit) => (
            <div key={unit.label} className="p-2 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold font-headline tabular-nums text-primary neon-icon">
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground">{unit.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
