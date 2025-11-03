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
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription>A quick look at your attendance.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <SubjectAttendanceCalendar classes={classes.slice(0, 5)} isMini={true} />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <Button variant="outline" className="w-full" asChild>
            <Link href="/attendance">
                View Details <ArrowRight className="ml-2" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
