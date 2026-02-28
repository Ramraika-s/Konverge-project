'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { EmployerDashboard } from '@/components/dashboard/EmployerDashboard';
import { Loader2, Sparkles, ArrowRight, Building2 } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function EmployerDashboardPage() {
  const { user, isUserLoading, role, profile } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const isDataLoading = isUserLoading;

  useEffect(() => {
    if (isDataLoading) return;

    if (!user) {
      router.replace('/auth');
      return;
    }

    // Role Enforcement: If they aren't an employer, kick them back to central router
    if (role !== 'employer') {
      router.replace('/dashboard');
    }
  }, [user, isDataLoading, role, router]);

  if (isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Syncing Employer Hub...</p>
      </div>
    );
  }

  if (!user || role !== 'employer') return null;

  // Check for professional marker (e.g., companyWebsite)
  const isProfileComplete = !!profile?.companyWebsite;

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="animate-in fade-in slide-in-from-left duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Employer <span className="text-primary gold-glow">Hub</span></h1>
            <p className="text-muted-foreground font-medium">Manage your job listings and evaluate talent.</p>
          </div>
          
          {!isProfileComplete && (
            <Alert className="max-w-md bg-primary/5 border-primary/20 rounded-2xl animate-pulse">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertTitle className="text-xs font-black uppercase tracking-widest">Boost Your Reach</AlertTitle>
              <AlertDescription className="text-xs flex flex-col gap-2">
                <span>Your company profile is incomplete. Complete it to unlock advanced recruitment features.</span>
                <Link href="/profile">
                  <Button variant="link" className="p-0 h-auto text-primary font-black uppercase text-[10px] tracking-widest">
                    Complete Profile <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
        <EmployerDashboard />
      </div>
    </div>
  );
}
