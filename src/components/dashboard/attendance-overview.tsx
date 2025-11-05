
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { useState } from "react"
import SubjectAttendanceCalendar from "../attendance/subject-attendance-calendar"

export default function AttendanceOverview() {
  const { classes } = useAppContext();
  const [date, setDate] = useState(new Date());
  return (
    <Card className="flex flex-col hover:border-primary/50 transition-colors">
      <CardHeader className="p-4">
        <CardTitle>Attendance</CardTitle>
        <CardDescription>A quick monthly look.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center pb-0 p-4 pt-0">
        <SubjectAttendanceCalendar classes={classes} isMini={true} viewingDate={date} setViewingDate={setDate} />
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-4 px-4 pb-4 mt-auto">
        <Button variant="outline" className="w-full h-9" asChild>
            <Link href="/attendance">
                Details <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
