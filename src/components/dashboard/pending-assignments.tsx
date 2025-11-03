'use client';
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function PendingAssignments() {
  const { assignments } = useAppContext();
  const pendingAssignments = assignments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <Link href="/assignments" className="block h-full">
      <Card className="h-full hover:border-primary/50 transition-colors">
        <CardHeader>
          <CardTitle>Pending Assignments</CardTitle>
          <CardDescription>You have {pendingAssignments.length} assignments due.</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingAssignments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {pendingAssignments.slice(0,3).map((assignment, index) => (
                <div key={assignment.id}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                    </div>
                    <div className="text-right text-xs text-primary">
                      <p className="font-semibold">Due in {formatDistanceToNow(new Date(assignment.dueDate))}</p>
                      <p className="text-muted-foreground">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {index < pendingAssignments.slice(0,3).length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/50 rounded-lg">
              <BookCheck className="w-8 h-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">All caught up! No pending assignments.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
