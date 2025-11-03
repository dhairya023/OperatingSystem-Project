
'use client';
import { useState } from 'react';
import type { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatePicker } from './date-picker';

type ProfileFormProps = {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
};

export default function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, dateOfBirth: date });
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhotoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  }

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="h-[60vh] pr-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="col-span-2 flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32 border-4 border-primary/50">
                  <AvatarImage src={formData.profilePhotoUrl} />
                  <AvatarFallback className="text-4xl">{getInitials(formData.fullName)}</AvatarFallback>
              </Avatar>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">Profile Photo</Label>
                  <Input id="picture" type="file" onChange={handlePhotoChange} accept="image/*" />
              </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email ID</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
           <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input name="course" value={formData.course} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input name="branch" value={formData.branch} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input name="semester" value={formData.semester} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="collegeName">College Name</Label>
                <Input name="collegeName" value={formData.collegeName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <div className="space-y-2 col-span-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <DatePicker value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined} onChange={handleDateChange} />
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
