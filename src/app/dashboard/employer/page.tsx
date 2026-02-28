
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { EmployerDashboard } from '@/components/dashboard/EmployerDashboard';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

/**
 * @fileOverview Dashboard page specifically for Employers.
 * Includes strict role-based access control and completeness checks.
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
    // Wait for all checks to finish
    if (isUserLoading || isJobSeekerLoading || isEmployerLoading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    // Role Guard: If user is actually a job seeker, move them to their correct hub
    if (jobSeekerProfile && jobSeekerProfile.educationSummary) {
      router.replace('/dashboard/job-seeker');
      return;
    }

    // Completion Guard: If no employer profile exists OR it's incomplete, go to the router
    if (!employerProfile || !employerProfile.companyWebsite) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, jobSeekerProfile, isJobSeekerLoading, employerProfile, isEmployerLoading, router]);

  if (isUserLoading || isJobSeekerLoading || isEmployerLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Final render check
  if (!user || !employerProfile || !employerProfile.companyWebsite) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-in fade-in slide-in-from-left duration-500 mb-10">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Employer <span className="text-primary gold-glow">Hub</span></h1>
        <p className="text-muted-foreground font-medium">Manage your job listings and evaluate talent.</p>
      </div>
      <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
        <EmployerDashboard />
      </div>
    </div>
  );
}
