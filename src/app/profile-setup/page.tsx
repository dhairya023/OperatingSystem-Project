
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Loader2, ArrowLeft } from 'lucide-react';
import { DatePicker } from '@/components/profile/date-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function ProfileSetupPage() {
  const { profile, updateProfile, completeProfileSetup, logoutUser } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
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
    profilePhotoUrl: profile?.profilePhotoUrl || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.fullName || '',
        email: profile.email || '',
        profilePhotoUrl: profile.profilePhotoUrl || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(profile.email || 'user')}`,
      }));
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, dateOfBirth: date });
  }

  const validateStep1 = () => {
    if (!formData.fullName) {
        toast({
            variant: 'destructive',
            title: 'Missing Field',
            description: 'Please fill out your name.',
        });
        return false;
    }
    return true;
  }

  const handleNext = () => {
    if (validateStep1()) {
        setStep(2);
    }
  }

  const handleSetupLater = async () => {
    if (!validateStep1()) return;
    setIsLoading(true);
    try {
      await updateProfile({ fullName: formData.fullName });
      await completeProfileSetup();
      toast({ title: 'Welcome to Grad!', description: 'You can complete your profile later.' });
      router.push('/');
    } catch (error: any) {
       console.error('Profile setup failed:', error);
       toast({ variant: 'destructive', title: 'Setup Failed', description: error.message || 'Could not save profile.' });
    } finally {
        setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData as UserProfile);
      await completeProfileSetup();
      toast({ title: 'Profile setup complete!', description: 'Welcome to Grad.' });
      router.push('/');
    } catch (error: any) => {
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
  
  const avatarUrl = formData.fullName
    ? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(formData.fullName)}`
    : formData.profilePhotoUrl;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
           {step > 1 && (
             <Button variant="ghost" size="icon" className="absolute top-4 left-4" onClick={() => setStep(1)}>
               <ArrowLeft />
             </Button>
           )}
          <div className="flex items-center justify-center gap-2 p-2 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold font-headline">Grad</h1>
          </div>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            {step === 1 ? 'Let\'s start with your name.' : 'Now for your academic details.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <ScrollArea className="h-[50vh] pr-6">
              {step === 1 && (
                <div className="grid grid-cols-1 gap-6 py-4">
                    <div className="col-span-1 flex flex-col items-center gap-4">
                        <Avatar className="w-32 h-32 border-4 border-primary/50">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="text-4xl">{getInitials(formData.fullName)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground text-center">Your avatar is auto-generated from your name. Change your name to get a new one!</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>
                </div>
              )}
               {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="course">Course</Label>
                        <Input name="course" value={formData.course} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input name="branch" value={formData.branch} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="semester">Semester</Label>
                        <Input name="semester" value={formData.semester} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="collegeName">College Name</Label>
                        <Input name="collegeName" value={formData.collegeName} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rollNumber">Roll Number</Label>
                        <Input name="rollNumber" value={formData.rollNumber} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <DatePicker value={formData.dateOfBirth} onChange={handleDateChange} />
                    </div>
                </div>
               )}
            </ScrollArea>
             <div className="flex justify-end items-center gap-4 mt-6">
                <Button type="button" variant="ghost" onClick={logoutUser}>
                    Logout
                </Button>

                {step === 1 && (
                  <>
                    <Button type="button" variant="secondary" onClick={handleSetupLater} disabled={isLoading}>
                      Setup Later
                    </Button>
                    <Button type="button" onClick={handleNext} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Next'}
                    </Button>
                  </>
                )}
                
                {step === 2 && (
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                        ) : 'Save and Continue'}
                    </Button>
                )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
