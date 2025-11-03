import { MOCK_ASSIGNMENTS } from "@/lib/placeholder-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookCheck, CalendarIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PendingAssignments() {
  const pendingAssignments = MOCK_ASSIGNMENTS
    .filter(a => !a.completed)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Pending Assignments</CardTitle>
        <CardDescription>You have {pendingAssignments.length} assignments due.</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingAssignments.length > 0 ? (
          <div className="flex flex-col gap-4">
            {pendingAssignments.map((assignment, index) => (
              <div key={assignment.id}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="font-semibold">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                  </div>
                  <div className="text-right text-xs text-primary">
                    <p className="font-semibold">Due in {formatDistanceToNow(assignment.dueDate)}</p>
                    <p className="text-muted-foreground">{assignment.dueDate.toLocaleDateString()}</p>
                  </div>
                </div>
                {index < pendingAssignments.length - 1 && <Separator className="mt-4" />}
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
  );
}
