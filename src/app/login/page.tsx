'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser, loginUser } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        await registerUser(email, password, username);
        toast({ title: "Registration successful!", description: "Please complete your profile." });
      } else {
        await loginUser(email, password);
        toast({ title: "Login successful!", description: "Welcome back." });
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
         <div className="flex items-center justify-center gap-2 p-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-headline">ScholarSphere</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{isRegisterMode ? 'Create an Account' : 'Sign In'}</CardTitle>
            <CardDescription>
              {isRegisterMode ? 'Enter your details to get started.' : 'Enter your credentials to access your dashboard.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : isRegisterMode ? 'Register' : 'Sign In'}
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
  );
}
