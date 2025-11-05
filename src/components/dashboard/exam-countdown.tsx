
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

  const [timeLeft, setTimeLeft] = useState(nextExam ? calculateTimeLeft(new Date(nextExam.date)) : null);

  useEffect(() => {
    if (!nextExam) return;

    // Update once every hour is sufficient if we only show days
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(new Date(nextExam.date)));
    }, 1000 * 60 * 60);

    return () => clearInterval(timer);
  }, [nextExam]);

  if (!nextExam || !timeLeft) {
    return (
      <Card className="flex h-full flex-col justify-center hover:border-primary/50 transition-colors">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base">Exam Countdown</CardTitle>
          <CardDescription className="text-xs">Your next major assessment.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center text-center gap-2 p-4 pt-0 md:p-6 md:pt-0">
            <Clock className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No upcoming exams scheduled.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
      <CardHeader className="text-center p-4 md:p-6">
        <CardTitle className="text-base font-bold">Next Exam: {nextExam.subject}</CardTitle>
        <CardDescription className="text-xs">
          {format(new Date(nextExam.date), "EEE, LLL d, h:mm a")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-4 pt-0 md:p-6 md:pt-0">
        <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold font-headline tabular-nums text-primary neon-icon">
                {timeLeft.days}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
                {timeLeft.days === 1 ? 'Day Left' : 'Days Left'}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
