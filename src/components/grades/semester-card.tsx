
'use client';
import { useState } from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Semester, GradeSubject } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import SubjectForm from './subject-form';
import SubjectListItem from './subject-list-item';
import { Badge } from '../ui/badge';

type SemesterCardProps = {
  semester: Semester;
};

const SemesterCard = ({ semester }: SemesterCardProps) => {
  const { addGradeSubject, updateGradeSubject, deleteGradeSubject } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<GradeSubject | undefined>(undefined);

  const handleSave = (subject: GradeSubject) => {
    if (selectedSubject) {
      updateGradeSubject(subject);
    } else {
      addGradeSubject(subject);
    }
    setIsFormOpen(false);
    setSelectedSubject(undefined);
  };

  const handleEdit = (subject: GradeSubject) => {
    setSelectedSubject(subject);
    setIsFormOpen(true);
  };

  const openNewDialog = () => {
    setSelectedSubject(undefined);
    setIsFormOpen(true);
  }

  return (
    <Card>
      <AccordionItem value={`semester-${semester.semester}`} className="border-b-0">
        <AccordionTrigger className="p-6 hover:no-underline">
          <div className="flex justify-between items-center w-full">
            <div className="text-left">
              <CardTitle>Semester {semester.semester}</CardTitle>
              <CardDescription>
                {semester.subjects.length} subject{semester.subjects.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            {semester.sgpa !== undefined && (
                 <div className="flex flex-col items-end">
                    <p className="text-xs text-muted-foreground">SGPA</p>
                    <p className="text-xl font-bold">{semester.sgpa.toFixed(2)}</p>
                </div>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-6 pt-0">
          <div className="space-y-4">
            {semester.subjects.map((subject) => (
              <SubjectListItem
                key={subject.id}
                subject={subject}
                onEdit={() => handleEdit(subject)}
                onDelete={() => deleteGradeSubject(subject.id)}
              />
            ))}

            {semester.subjects.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p>No subjects added for this semester yet.</p>
              </div>
            )}

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4" onClick={openNewDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {selectedSubject ? 'Edit Subject' : 'Add Subject'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedSubject ? 'Edit' : 'Add'} Subject</DialogTitle>
                </DialogHeader>
                <SubjectForm
                  semesterNumber={semester.semester}
                  subject={selectedSubject}
                  onSave={handleSave}
                />
              </DialogContent>
            </Dialog>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
};

export default SemesterCard;
