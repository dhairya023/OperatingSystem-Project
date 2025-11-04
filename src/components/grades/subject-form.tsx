
'use client';
import { useState } from 'react';
import type { GradeSubject } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

type SubjectFormProps = {
  semesterNumber: number;
  subject?: GradeSubject;
  onSave: (subject: GradeSubject) => void;
};

const SubjectForm = ({ semesterNumber, subject, onSave }: SubjectFormProps) => {
  const [subjectName, setSubjectName] = useState(subject?.subjectName || '');
  const [credits, setCredits] = useState(subject?.credits?.toString() || '');
  const [midSemMarks, setMidSemMarks] = useState(subject?.midSemMarks?.toString() || '');
  const [iaMarks, setIaMarks] = useState(subject?.iaMarks?.toString() || '');
  const [endSemMarks, setEndSemMarks] = useState(subject?.endSemMarks?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName || !credits) return;

    const parseOptionalNumber = (val: string) => (val === '' ? undefined : Number(val));

    onSave({
      id: subject?.id || crypto.randomUUID(),
      semester: semesterNumber,
      subjectName,
      credits: Number(credits),
      midSemMarks: parseOptionalNumber(midSemMarks),
      iaMarks: parseOptionalNumber(iaMarks),
      endSemMarks: parseOptionalNumber(endSemMarks),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="subjectName">Subject Name</Label>
          <Input id="subjectName" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credits">Credits</Label>
          <Input id="credits" type="number" value={credits} onChange={(e) => setCredits(e.target.value)} required />
        </div>
        <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="midSemMarks">Mid Sem (25)</Label>
              <Input id="midSemMarks" type="number" value={midSemMarks} onChange={(e) => setMidSemMarks(e.target.value)} max={25} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iaMarks">IA (25)</Label>
              <Input id="iaMarks" type="number" value={iaMarks} onChange={(e) => setIaMarks(e.target.value)} max={25} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endSemMarks">End Sem (100)</Label>
              <Input id="endSemMarks" type="number" value={endSemMarks} onChange={(e) => setEndSemMarks(e.target.value)} max={100} />
            </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save Subject</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
};

export default SubjectForm;
