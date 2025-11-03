
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap } from 'lucide-react';
import { DatePicker } from '@/components/profile/date-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function ProfileSetupPage() {
  const { profile, updateProfile, completeProfileSetup } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    course: '',
    branch: '',
    semester: '',
    collegeName: '',
    rollNumber: '',
    phoneNumber: '',
    dateOfBirth: undefined,
    profilePhotoUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData as UserProfile);
      await completeProfileSetup();
      toast({ title: 'Profile setup complete!', description: 'Welcome to ScholarSphere.' });
      router.push('/');
    } catch (error: any) {
      console.error('Profile setup failed:', error);
      toast({
        variant: 'destructive',
        title: 'Setup Failed',
        description: error.message || 'Could not save profile.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 p-2 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold font-headline">ScholarSphere</h1>
          </div>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Just a few more details to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <ScrollArea className="h-[50vh] pr-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="col-span-2 flex flex-col items-center gap-4">
                        <Avatar className="w-32 h-32 border-4 border-primary/50">
                            <AvatarImage src={formData.profilePhotoUrl} />
                            <AvatarFallback className="text-4xl">{getInitials(formData.fullName)}</AvatarFallback>
                        </Avatar>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="picture">Profile Photo (Optional)</Label>
                            <Input id="picture" type="file" onChange={handlePhotoChange} accept="image/*" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
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
                        <DatePicker value={formData.dateOfBirth} onChange={handleDateChange} />
                    </div>
                </div>
            </ScrollArea>
             <div className="flex justify-end mt-6">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save and Continue'}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
