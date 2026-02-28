
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { EmployerDashboard } from '@/components/dashboard/EmployerDashboard';
import { ProfileCompletionForm } from '@/components/auth/ProfileCompletionForm';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

export default function EmployerDashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);

  const jobSeekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: jobSeekerProfile, isLoading: isJobSeekerLoading } = useDoc(jobSeekerRef);

  const isDataLoading = isUserLoading || isJobSeekerLoading || isEmployerLoading;

  useEffect(() => {
    if (isDataLoading) return;

    if (!user) {
      router.replace('/auth');
      return;
    }

    // Role Enforcement: If they are a seeker, send them to the seeker hub
    if (jobSeekerProfile) {
      router.replace('/dashboard/job-seeker');
      return;
    }

    // If no profile at all exists, send to central router for choice
    if (!employerProfile) {
      router.replace('/dashboard');
    }
  }, [user, isDataLoading, jobSeekerProfile, employerProfile, router]);

  if (isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Syncing Employer Hub...</p>
      </div>
    );
  }

  if (!user || jobSeekerProfile || !employerProfile) return null;

  // Check for professional marker (e.g., companyWebsite)
  const isProfileComplete = !!employerProfile?.companyWebsite;

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {!isProfileComplete ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProfileCompletionForm />
        </div>
      ) : (
        <>
          <div className="animate-in fade-in slide-in-from-left duration-500">
            <h1 className="text-4xl font-black mb-2 tracking-tight">Employer <span className="text-primary gold-glow">Hub</span></h1>
            <p className="text-muted-foreground font-medium">Manage your job listings and evaluate talent.</p>
          </div>

          <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
            <EmployerDashboard />
          </div>
        </>
      )}
    </div>
  );
}
