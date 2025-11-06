
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const { registerUser, loginUser, sendPasswordReset } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const getRedirectPath = () => {
    const importCode = searchParams.get('importCode');
    if (importCode) {
      return `/timetable?importCode=${importCode}`;
    }
    return '/';
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await loginUser(email, password);
        router.push(getRedirectPath());
    } catch (error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await registerUser(registerEmail, registerPassword);
        toast({ title: 'Registration successful!', description: 'Please complete your profile.' });
        router.push(`/profile-setup?importCode=${searchParams.get('importCode') || ''}`);
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
        toast({ variant: 'destructive', title: 'Email required', description: 'Please enter your email address.' });
        return;
    }
    setIsResetting(true);
    try {
      await sendPasswordReset(resetEmail);
      toast({ title: 'Password reset email sent!', description: 'Check your inbox to reset your password.' });
      setTimeout(() => {
        setIsForgotPasswordOpen(false);
      }, 2000);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Reset Failed',
        description: error.message || 'Could not send reset email.',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md z-10">
         <div className="flex items-center justify-center gap-2 p-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-headline">Grad</h1>
        </div>
        <Tabs defaultValue="login" className="w-full">
            <div className="relative rounded-2xl p-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 animate-gradient-border animate-hue-glow">
                <Card className="rounded-xl overflow-hidden border-none">
                    <CardHeader>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Sign In</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>
                    </CardHeader>
                    <CardContent className="bg-background">
                         <TabsContent value="login">
                             <CardDescription className="text-center mb-4">
                                Enter your credentials to access your dashboard.
                            </CardDescription>
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="p-0 h-auto text-sm text-primary/80 hover:text-primary"
                                        onClick={() => setIsForgotPasswordOpen(true)}
                                    >
                                        Forgot Password?
                                    </Button>
                                </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                    </>
                                ) : 'Sign In'}
                                </Button>
                            </form>
                         </TabsContent>
                         <TabsContent value="register">
                            <CardDescription className="text-center mb-4">
                                Create a new account to get started.
                            </CardDescription>
                             <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div className="space-y-2">
                                <Label htmlFor="register-email">Email</Label>
                                <Input
                                    id="register-email"
                                    type="email"
                                    required
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="register-password">Password</Label>
                                <Input
                                    id="register-password"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                    </>
                                ) : 'Register'}
                                </Button>
                            </form>
                         </TabsContent>
                    </CardContent>
                </Card>
            </div>
        </Tabs>
      </div>

       <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogDescription>
                        Enter your registered email address and we'll send you a link to reset your password.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePasswordReset}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email Address</Label>
                            <Input
                                id="reset-email"
                                type="email"
                                required
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                disabled={isResetting}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isResetting}>
                            {isResetting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Sending...
                                </>
                             ) : "Send Reset Link"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
  );
}
