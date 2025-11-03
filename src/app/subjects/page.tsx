'use client';
import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/context/app-context';
import type { Subject } from '@/lib/types';
import { HexColorPicker } from 'react-colorful';

const SubjectForm = ({ subject, onSave }: { subject?: Subject; onSave: (subject: Subject) => void }) => {
  const [name, setName] = useState(subject?.name || '');
  const [teacher, setTeacher] = useState(subject?.teacher || '');
  const [color, setColor] = useState(subject?.color || '#8B5CF6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !teacher) return;
    onSave({
      id: subject?.id || crypto.randomUUID(),
      name,
      teacher,
      color,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Subject Name
          </Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="teacher" className="text-right">
            Teacher
          </Label>
          <Input
            id="teacher"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="color" className="text-right">
            Color
          </Label>
          <div className="col-span-3 flex gap-4 items-center">
            <HexColorPicker color={color} onChange={setColor} />
            <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: color }}></div>
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

export default function SubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useAppContext();
  const [isNewSubjectDialogOpen, setIsNewSubjectDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>(undefined);

  const handleAddSubject = (subject: Subject) => {
    addSubject(subject);
    setIsNewSubjectDialogOpen(false);
  };

  const handleUpdateSubject = (subject: Subject) => {
    updateSubject(subject);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteSubject = () => {
    if(selectedSubject) {
        deleteSubject(selectedSubject.id);
        setIsDeleteDialogOpen(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Subjects" description="Manage your academic subjects." />
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Your Subjects</CardTitle>
            <CardDescription>Add, edit, or remove your subjects here.</CardDescription>
          </div>
          <Dialog open={isNewSubjectDialogOpen} onOpenChange={setIsNewSubjectDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" /> Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
              </DialogHeader>
              <SubjectForm onSave={handleAddSubject} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: subject.color }}></div>
                    <div>
                      <p className="font-semibold">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isEditDialogOpen && selectedSubject?.id === subject.id} onOpenChange={(open) => {
                        if (open) {
                            setSelectedSubject(subject);
                            setIsEditDialogOpen(true);
                        } else {
                            setIsEditDialogOpen(false);
                            setSelectedSubject(undefined);
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Edit Subject</DialogTitle>
                            </DialogHeader>
                            <SubjectForm subject={subject} onSave={handleUpdateSubject} />
                        </DialogContent>
                    </Dialog>
                     <Dialog open={isDeleteDialogOpen && selectedSubject?.id === subject.id} onOpenChange={(open) => {
                        if (open) {
                            setSelectedSubject(subject);
                            setIsDeleteDialogOpen(true);
                        } else {
                            setIsDeleteDialogOpen(false);
                            setSelectedSubject(undefined);
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Delete Subject</DialogTitle>
                            </DialogHeader>
                            <p>Are you sure you want to delete the subject "{subject.name}"? This action cannot be undone.</p>
                             <DialogFooter>
                                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                <Button variant="destructive" onClick={handleDeleteSubject}>Delete</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">No subjects added yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
