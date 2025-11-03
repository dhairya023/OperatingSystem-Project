"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getAttendancePercentage } from "@/lib/placeholder-data"
import { Label, Pie, PieChart, RadialBar, RadialBarChart } from "recharts"

const chartConfig = {
  attendance: {
    label: "Attendance",
    color: "hsl(var(--chart-1))",
  },
}

export default function AttendanceOverview() {
  const attendancePercentage = getAttendancePercentage();
  const chartData = [{ name: "attendance", value: attendancePercentage, fill: "var(--color-attendance)" }];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription>Your overall attendance percentage.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius="70%"
            outerRadius="100%"
            barSize={20}
          >
            <RadialBar dataKey="value" background={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} cornerRadius={10} />
             <g>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-5xl font-bold font-headline">
                {attendancePercentage}%
              </text>
            </g>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
         <div className="text-center text-muted-foreground">
          Keep it up!
        </div>
      </CardFooter>
    </Card>
  )
}
