
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const { registerUser, loginUser, sendPasswordReset } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        await registerUser(email, password, username);
        toast({ title: "Registration successful!", description: "Please complete your profile." });
      } else {
        await loginUser(email, password);
      }
      router.push('/');
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
         <div className="flex items-center justify-center gap-2 p-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-headline">Grad</h1>
        </div>
        <div className="relative rounded-lg p-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 animate-gradient-border">
          <Card className="border-none rounded-md overflow-hidden">
            <CardHeader className="bg-background">
              <CardTitle className="text-2xl">{isRegisterMode ? 'Create an Account' : 'Sign In'}</CardTitle>
              <CardDescription>
                {isRegisterMode ? 'Enter your details to get started.' : 'Enter your credentials to access your dashboard.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-background">
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isRegisterMode && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="your_username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
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
                  {!isRegisterMode && (
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
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isRegisterMode ? 'Register' : 'Sign In'}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
                <Button variant="link" onClick={() => setIsRegisterMode(!isRegisterMode)} className="px-1">
                  {isRegisterMode ? 'Sign In' : 'Register'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
                                placeholder="name@example.com"
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
