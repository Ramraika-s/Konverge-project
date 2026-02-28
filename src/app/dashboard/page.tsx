'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2, User, Building2, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * @fileOverview Central Dashboard Gatekeeper.
 * 1. Automatically pushes existing users to their respective hubs.
 * 2. Provides new users (Google sign-ins) a PERMANENT choice between roles.
 */
export default function DashboardPage() {
  const { user, isUserLoading, role } = useUser();
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<'job-seeker' | 'employer' | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    // If auth state is resolved but no user, go home
    if (!isUserLoading && !user) {
      router.push('/auth');
      return;
    }

    // Auto-redirect if role is already established
    if (role === 'job-seeker') {
      router.push('/dashboard/job-seeker');
    } else if (role === 'employer') {
      router.push('/dashboard/employer');
    }
  }, [user, isUserLoading, role, router]);

  const handleFinalizeRole = async () => {
    if (!user || !db || !selectedRole) return;

    setIsFinalizing(true);
    try {
      const targetCollection = selectedRole === 'employer' ? 'employerProfiles' : 'jobseekerProfile';
      const profileRef = doc(db, targetCollection, user.uid);
      
      const skeletonData = selectedRole === 'employer' ? {
        id: user.uid,
        companyName: `${user.displayName || 'My Company'}`,
        contactPersonName: user.displayName || 'Employer',
        contactEmail: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } : {
        id: user.uid,
        firstName: user.displayName?.split(' ')[0] || 'User',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(profileRef, skeletonData, { merge: true });

      toast({
        title: "Role Confirmed",
        description: `Your identity as a ${selectedRole === 'employer' ? 'Employer' : 'Job Seeker'} has been locked.`,
      });

      // Push to the respective hub
      router.push(selectedRole === 'employer' ? '/dashboard/employer' : '/dashboard/job-seeker');
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Finalization Failed",
        description: err.message,
      });
      setIsFinalizing(false);
    }
  };

  if (isUserLoading || (user && role)) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">
          Routing to Workspace...
        </p>
      </div>
    );
  }

  // Role Selection UI for Google/New users
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-5xl font-black tracking-tight text-white">
          Define Your <span className="text-primary gold-glow">Path</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto font-medium">
          Select how you will participate in the Konnex network.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card 
          className={`glass-card hover:border-primary/50 transition-all cursor-pointer group p-6 border-2 relative overflow-hidden ${
            selectedRole === 'job-seeker' ? 'border-primary bg-primary/5' : 'border-white/5'
          }`}
          onClick={() => setSelectedRole('job-seeker')}
        >
          <div className="absolute top-0 right-0 p-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              selectedRole === 'job-seeker' ? 'border-primary bg-primary' : 'border-white/20'
            }`}>
              {selectedRole === 'job-seeker' && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
            </div>
          </div>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 mx-auto group-hover:scale-110 transition-all duration-300">
              <User className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">Job Seeker</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Discover opportunities and build your career profile.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className={`glass-card hover:border-primary/50 transition-all cursor-pointer group p-6 border-2 relative overflow-hidden ${
            selectedRole === 'employer' ? 'border-primary bg-primary/5' : 'border-white/5'
          }`}
          onClick={() => setSelectedRole('employer')}
        >
          <div className="absolute top-0 right-0 p-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              selectedRole === 'employer' ? 'border-primary bg-primary' : 'border-white/20'
            }`}>
              {selectedRole === 'employer' && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
            </div>
          </div>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-all duration-300">
              <Building2 className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">Employer</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Post vacancies and evaluate top-tier professional talent.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {selectedRole && (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 rounded-2xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-black uppercase tracking-widest text-[10px]">Critical Warning</AlertTitle>
            <AlertDescription className="text-sm font-medium">
              This choice is <span className="font-black underline">permanent</span>. Once confirmed, you cannot switch roles without creating a new account.
            </AlertDescription>
          </Alert>

          <Button 
            className="w-full h-16 text-lg font-black gold-border-glow rounded-2xl gap-3"
            onClick={handleFinalizeRole}
            disabled={isFinalizing}
          >
            {isFinalizing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Confirm & Proceed <ArrowRight className="w-5 h-5" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
