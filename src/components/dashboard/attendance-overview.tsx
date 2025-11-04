
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
import SubjectAttendanceCalendar from "../attendance/subject-attendance-calendar"
import { useAppContext } from "@/context/app-context"

export default function AttendanceOverview() {
  const { classes } = useAppContext();
  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
      <CardHeader className="p-4">
        <CardTitle>Attendance</CardTitle>
        <CardDescription>A quick monthly look.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0 p-4 pt-0">
        <SubjectAttendanceCalendar classes={classes} isMini={true} />
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-4 px-4 pb-4">
        <Button variant="outline" className="w-full h-9" asChild>
            <Link href="/attendance">
                Details <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
