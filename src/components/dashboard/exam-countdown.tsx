"use client";

import { useEffect, useState } from "react";
import { MOCK_EXAMS } from "@/lib/placeholder-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock } from "lucide-react";

const calculateTimeLeft = (targetDate: Date) => {
  const difference = +targetDate - +new Date();
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
  const upcomingExams = MOCK_EXAMS.filter(exam => exam.date > new Date()).sort((a, b) => a.date.getTime() - b.date.getTime());
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
      <Card className="flex h-full flex-col justify-center bg-secondary">
        <CardHeader>
          <CardTitle>Exam Countdown</CardTitle>
          <CardDescription>No upcoming exams scheduled.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center text-muted-foreground">
            <Clock className="w-12 h-12" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <Card className="relative overflow-hidden flex flex-col h-full bg-gradient-to-br from-secondary to-background">
      <CardHeader>
        <CardTitle>Next Exam: {nextExam.subject}</CardTitle>
        <CardDescription>
          {nextExam.date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center w-full">
          {timeUnits.map((unit) => (
            <div key={unit.label} className="p-4 rounded-lg bg-background/50">
              <div className="text-4xl md:text-5xl font-bold font-headline tabular-nums text-primary neon-icon">
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground">{unit.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
