"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    if (!email || !password) {
      setError('Please fill in your credentials.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      router.push('/dashboard');
    } catch (err: any) {
      let message = err.message || 'An error occurred during authentication.';
      if (err.code === 'auth/user-not-found') message = 'No account found with this email.';
      if (err.code === 'auth/wrong-password') message = 'Incorrect password.';
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-bold">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
        <Label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
          <Input 
            id="login-email" 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-white/5 border-white/10 rounded-xl" 
          />
        </div>
        <div className="space-y-2">
        <Label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
          <Input 
            id="login-password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 bg-white/5 border-white/10 rounded-xl" 
          />
        </div>
      </div>

      <Button 
        type="submit"
        disabled={isLoading}
        className="w-full h-12 font-bold gold-border-glow rounded-xl bg-primary text-primary-foreground"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
      </Button>
    </form>
  );
}
