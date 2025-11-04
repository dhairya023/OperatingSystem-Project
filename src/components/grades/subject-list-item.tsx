
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import type { GradeSubject } from '@/lib/types';
import { getGradeDetails } from '@/lib/grade-calculator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';

type SubjectListItemProps = {
  subject: GradeSubject;
  onEdit: () => void;
  onDelete: () => void;
};

const StatDisplay = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-base font-semibold">{value ?? '-'}</p>
    </div>
);


const SubjectListItem = ({ subject, onEdit, onDelete }: SubjectListItemProps) => {
  const gradeDetails = getGradeDetails(subject);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-bold">{subject.subjectName}</p>
          <p className="text-sm text-muted-foreground">{subject.credits} Credits</p>
        </div>
        <div className="flex items-center gap-2">
            {gradeDetails.status === 'Completed' ? (
                 <Badge variant="secondary">{gradeDetails.grade}</Badge>
            ) : (
                <Badge variant="outline">{gradeDetails.status}</Badge>
            )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={onEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-0 pt-4">
        <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-muted/50">
            <StatDisplay label="Mid Sem" value={subject.midSemMarks} />
            <StatDisplay label="IA" value={subject.iaMarks} />
            <StatDisplay label="End Sem" value={subject.endSemMarks} />
        </div>
         {gradeDetails.status === 'Completed' && (
            <div className="grid grid-cols-3 gap-2 p-3 mt-2 rounded-lg border">
                <StatDisplay label="Total" value={`${gradeDetails.total?.toFixed(2)}/100`} />
                <StatDisplay label="Grade" value={gradeDetails.grade} />
                <StatDisplay label="Point" value={gradeDetails.gradePoint} />
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubjectListItem;
