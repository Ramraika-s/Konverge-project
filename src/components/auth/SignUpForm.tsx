
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Loader2, 
  AlertCircle, 
  User, 
  Building2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview Simplified Sign-Up Form.
 * Collects only basic info to minimize friction, 
 * creating a skeleton profile for the dashboard to finish.
 */
export function SignUpForm() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEmployer, setIsEmployer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    
    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all required fields.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // 1. Create the Auth User
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Create a "Skeleton" Profile Document
      // This allows the Dashboard to identify their role immediately
      const profileRef = doc(db, isEmployer ? 'employerProfiles' : 'jobseekerProfile', result.user.uid);
      
      const skeletonData = isEmployer ? {
        id: result.user.uid,
        companyName: `${firstName} ${lastName}'s Company`, // Placeholder
        contactPersonName: `${firstName} ${lastName}`,
        contactEmail: result.user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } : {
        id: result.user.uid,
        firstName,
        lastName,
        email: result.user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(profileRef, skeletonData, { merge: true });

      toast({
        title: "Account created!",
        description: "Welcome to Konnex. Let's finish setting up your profile.",
      });

      // 3. Redirect to the central dashboard router
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="w-full">
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-bold">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 pb-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-primary/20 shadow-sm transition-all">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold flex items-center gap-2">
              {isEmployer ? <Building2 className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-primary" />}
              Register as {isEmployer ? 'Employer' : 'Job-Seeker'}
            </Label>
            <p className="text-[10px] text-muted-foreground">{isEmployer ? 'Hire top talent' : 'Find your next career move'}</p>
          </div>
          <Switch 
            checked={isEmployer} 
            onCheckedChange={setIsEmployer}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input 
              placeholder="John" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input 
              placeholder="Doe" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input 
            id="signup-email" 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Password <span className="text-destructive">*</span>
          </Label>
          <Input 
            id="signup-password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50" 
          />
        </div>
      </div>

      <div className="pt-2">
        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full h-14 font-black text-lg gold-border-glow rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            `Join as ${isEmployer ? 'Employer' : 'Seeker'}`
          )}
        </Button>
      </div>
    </form>
  );
}
