
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { EmployerDashboard } from '@/components/dashboard/EmployerDashboard';
import { ProfileCompletionForm } from '@/components/auth/ProfileCompletionForm';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

/**
 * @fileOverview Employer Dashboard.
 * Shows the completion form if profile is incomplete, or the hub if complete.
 * Strictly guards against job seeker access.
 */
export default function EmployerDashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // Guard: Check for job seeker profile (to prevent cross-role access)
  const jobSeekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: jobSeekerProfile, isLoading: isJobSeekerLoading } = useDoc(jobSeekerRef);

  // Guard: Check for employer profile
  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);

  const isDataLoading = isUserLoading || isJobSeekerLoading || isEmployerLoading;

  useEffect(() => {
    if (isDataLoading) return;

    if (!user) {
      router.replace('/auth');
      return;
    }

    // STRICT ROLE GUARD: If user is a job seeker, they are forbidden from the employer hub.
    if (jobSeekerProfile) {
      router.replace('/dashboard/job-seeker');
      return;
    }

    // If no employer profile exists at all (and no seeker profile), go back to central router to pick a role
    if (!employerProfile && !jobSeekerProfile) {
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

  // Final validation before rendering
  if (!user || jobSeekerProfile) return null;

  // Check if employer profile is professionally complete (has companyWebsite)
  const isProfileComplete = employerProfile && !!employerProfile.companyWebsite;

  return (
    <div className="container mx-auto px-4 py-12">
      {isProfileComplete ? (
        <>
          <div className="animate-in fade-in slide-in-from-left duration-500 mb-10">
            <h1 className="text-4xl font-black mb-2 tracking-tight">Employer <span className="text-primary gold-glow">Hub</span></h1>
            <p className="text-muted-foreground font-medium">Manage your job listings and evaluate talent.</p>
          </div>
          <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
            <EmployerDashboard />
          </div>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProfileCompletionForm />
        </div>
      )}
    </div>
  );
}
