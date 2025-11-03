'use client';
import { useState } from 'react';
import type { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

type ProfileFormProps = {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
};

export default function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [rollNo, setRollNo] = useState(profile.rollNo);
  const [university, setUniversity] = useState(profile.university);
  const [course, setCourse] = useState(profile.course);
  const [semester, setSemester] = useState(profile.semester);
  const [department, setDepartment] = useState(profile.department);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(profile.profilePhotoUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      fullName,
      email,
      rollNo,
      university,
      course,
      semester,
      department,
      profilePhotoUrl,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="h-[60vh] pr-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="col-span-2 flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32 border-4 border-primary/50">
                  <AvatarImage src={profilePhotoUrl} />
                  <AvatarFallback className="text-4xl">{getInitials(fullName)}</AvatarFallback>
              </Avatar>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">Profile Photo</Label>
                  <Input id="picture" type="file" onChange={handlePhotoChange} accept="image/*" />
              </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email ID</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rollNo">Roll No</Label>
            <Input id="rollNo" value={rollNo} onChange={e => setRollNo(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input id="university" value={university} onChange={e => setUniversity(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Input id="course" value={course} onChange={e => setCourse(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Input id="semester" value={semester} onChange={e => setSemester(e.target.value)} required />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={department} onChange={e => setDepartment(e.target.value)} required />
          </div>
        </div>
      </ScrollArea>
      <DialogFooter className="mt-6">
        <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit">Save Changes</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
