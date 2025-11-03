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
import { MOCK_CLASSES } from "@/lib/placeholder-data"

export default function AttendanceOverview() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription>A quick look at your attendance.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <SubjectAttendanceCalendar classes={MOCK_CLASSES.slice(0, 5)} isMini={true} />
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
