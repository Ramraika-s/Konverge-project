
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

  useEffect(() => {
    if (isUserLoading || isJobSeekerLoading || isEmployerLoading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    // Role Guard: If user is actually a job seeker, move them to the correct hub.
    if (jobSeekerProfile) {
      router.replace('/dashboard/job-seeker');
    }

    // If no employer profile exists at all, go back to central router to pick a role
    if (!employerProfile) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, jobSeekerProfile, isJobSeekerLoading, employerProfile, isEmployerLoading, router]);

  if (isUserLoading || isJobSeekerLoading || isEmployerLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !employerProfile) return null;

  // Check if profile is professionally complete (has companyWebsite)
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
