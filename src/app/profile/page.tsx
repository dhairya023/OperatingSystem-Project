
'use client';
import AppLayout from '@/components/app-layout';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Mail, GraduationCap, Building, Book, Award, Briefcase, Phone, Cake, User } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import type { UserProfile } from '@/lib/types';
import ProfileForm from '@/components/profile/profile-form';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const ProfileDetail = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
  <div className="flex items-start gap-4">
    <Icon className="w-5 h-5 text-muted-foreground mt-1" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  </div>
);

function ProfileContent() {
  const { profile, updateProfile, deleteAccount, setHeaderState } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    updateProfile(updatedProfile);
    setIsFormOpen(false);
  };

  const getInitials = (name?: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  }

  useEffect(() => {
    const pageActions = (
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
              <Button>
              <Edit className="mr-2" /> Edit Profile
              </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
              <DialogHeader>
              <DialogTitle>Edit Your Profile</DialogTitle>
              </DialogHeader>
              <ProfileForm onSave={handleSaveProfile} profile={profile} />
          </DialogContent>
      </Dialog>
    );

    setHeaderState({
      title: 'My Profile',
      description: 'View and manage your personal information.',
      children: pageActions
    });
  }, [isFormOpen, profile, setHeaderState]);


  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="w-24 h-24 border-2 border-primary">
            <AvatarImage src={profile.profilePhotoUrl} alt={profile.fullName} />
            <AvatarFallback className="text-3xl">{getInitials(profile.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl">{profile.fullName}</CardTitle>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
            </div>
            {profile.rollNumber && <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>{profile.rollNumber}</span>
            </div>}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-6">
          <ProfileDetail icon={Building} label="College" value={profile.collegeName} />
          <ProfileDetail icon={Book} label="Course" value={profile.course} />
          <ProfileDetail icon={Briefcase} label="Branch" value={profile.branch} />
          <ProfileDetail icon={Award} label="Semester" value={profile.semester} />
          <ProfileDetail icon={Phone} label="Phone Number" value={profile.phoneNumber} />
          <ProfileDetail icon={Cake} label="Date of Birth" value={profile.dateOfBirth ? format(new Date(profile.dateOfBirth), 'PPP') : '-'} />
        </CardContent>
      </Card>
      
      <Card className="border-destructive">
          <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>Permanently delete your account and all associated data.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground">
                This action is irreversible. All your subjects, timetable, attendance records, assignments, and exams will be permanently deleted.
              </p>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete My Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteAccount} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
      </Card>
    </div>
  );
}


export default function ProfilePage() {
    return (
        <AppLayout>
            <ProfileContent />
        </AppLayout>
    )
}
