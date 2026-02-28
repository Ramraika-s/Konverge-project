
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { ProfileCompletionForm } from '@/components/auth/ProfileCompletionForm';

/**
 * @fileOverview Central dashboard router with Progressive Profiling.
 * Checks if a profile exists AND if it's "Complete" (has professional details).
 */
export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // Check for Job Seeker Profile
  const jobSeekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: jobSeekerProfile, isLoading: isJobSeekerLoading } = useDoc(jobSeekerRef);

  // Check for Employer Profile
  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);

  useEffect(() => {
    // 1. Wait for everything to load
    if (isUserLoading || isJobSeekerLoading || isEmployerLoading) return;

    // 2. Auth Guard
    if (!user) {
      router.push('/auth');
      return;
    }

    // 3. Routing Logic: Redirect if a valid, COMPLETE profile exists
    // A profile is complete if it has its specific identifying field (educationSummary or companyWebsite)
    if (jobSeekerProfile && jobSeekerProfile.educationSummary) {
      router.replace('/dashboard/job-seeker');
    } else if (employerProfile && employerProfile.companyWebsite) {
      router.replace('/dashboard/employer');
    }
    // Otherwise, we stay on this page to show the ProfileCompletionForm
  }, [user, isUserLoading, isJobSeekerLoading, isEmployerLoading, jobSeekerProfile, employerProfile, router]);

  const isGlobalLoading = isUserLoading || isJobSeekerLoading || isEmployerLoading;

  if (isGlobalLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // If we reach here, it means the user is logged in but profile is either missing or incomplete
  return (
    <div className="container mx-auto px-4 py-24">
      <ProfileCompletionForm />
    </div>
  );
}
