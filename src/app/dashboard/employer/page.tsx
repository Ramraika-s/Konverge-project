
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

  // Fetch both to enforce role locking
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

    // Role Guard: If they are actually a job seeker, move them.
    if (jobSeekerProfile) {
      router.replace('/dashboard/job-seeker');
      return;
    }

    // Existence Guard: If they have NO profile at all, go back to the central router to pick a role.
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

  // Final rendering logic: If we have an employer profile, show dashboard or completion form.
  if (!user || !employerProfile || jobSeekerProfile) return null;

  const isProfileComplete = !!employerProfile.companyWebsite;

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
