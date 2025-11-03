'use client';
import AppLayout from '@/components/app-layout';
import { useState } from 'react';
import Image from 'next/image';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Mail, User, GraduationCap, Building, Book, Award, Briefcase } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import type { UserProfile } from '@/lib/types';
import ProfileForm from '@/components/profile/profile-form';

const ProfileDetail = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div className="flex items-start gap-4">
    <Icon className="w-5 h-5 text-muted-foreground mt-1" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  </div>
);

function ProfileContent() {
  const { profile, updateProfile } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    updateProfile(updatedProfile);
    setIsFormOpen(false);
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <PageHeader title="My Profile" description="View and manage your personal information." />

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
            {profile.rollNo && <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>{profile.rollNo}</span>
            </div>}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
          <ProfileDetail icon={Building} label="University" value={profile.university} />
          <ProfileDetail icon={Book} label="Course" value={profile.course} />
          <ProfileDetail icon={Award} label="Semester" value={profile.semester} />
          <ProfileDetail icon={Briefcase} label="Department" value={profile.department} />
        </CardContent>
        <CardFooter>
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
