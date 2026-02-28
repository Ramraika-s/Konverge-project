
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

/**
 * @fileOverview Dashboard page specifically for Job Seekers.
 * Includes strict role-based access control and completeness checks.
 */
export default function JobSeekerDashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // Guard: Check for employer profile (to prevent cross-role access)
  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);

  // Guard: Check for job seeker profile
  const jobSeekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: jobSeekerProfile, isLoading: isJobSeekerLoading } = useDoc(jobSeekerRef);

  useEffect(() => {
    // Wait for all checks to finish
    if (isUserLoading || isEmployerLoading || isJobSeekerLoading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    // Role Guard: If user is actually an employer, move them to their correct hub
    if (employerProfile && employerProfile.companyWebsite) {
      router.replace('/dashboard/employer');
      return;
    }

    // Completion Guard: If no seeker profile exists OR it's incomplete, go to the router
    if (!jobSeekerProfile || !jobSeekerProfile.educationSummary) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, employerProfile, isEmployerLoading, jobSeekerProfile, isJobSeekerLoading, router]);

  if (isUserLoading || isEmployerLoading || isJobSeekerLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Final render check
  if (!user || !jobSeekerProfile || !jobSeekerProfile.educationSummary) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-in fade-in slide-in-from-left duration-500 mb-10">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Job Seeker <span className="text-primary gold-glow">Dashboard</span></h1>
        <p className="text-muted-foreground font-medium">Manage your applications and professional growth.</p>
      </div>
      <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
        <StudentDashboard />
      </div>
    </div>
  );
}
