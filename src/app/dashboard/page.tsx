
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { ProfileCompletionForm } from '@/components/auth/ProfileCompletionForm';

/**
 * @fileOverview Central dashboard router.
 * Its ONLY purpose is to forward users to /dashboard/job-seeker or /dashboard/employer.
 * If no profile exists (e.g. fresh Google user), it shows the initial Role Choice.
 */
export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // 1. Check for any existing profile skeleton
  const jobSeekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: jobSeekerProfile, isLoading: isJobSeekerLoading } = useDoc(jobSeekerRef);

  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);

  useEffect(() => {
    if (isUserLoading || isJobSeekerLoading || isEmployerLoading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    // Direct routing: If ANY profile exists (skeleton or complete), push to the hub.
    if (jobSeekerProfile) {
      router.replace('/dashboard/job-seeker');
    } else if (employerProfile) {
      router.replace('/dashboard/employer');
    }
  }, [user, isUserLoading, isJobSeekerLoading, isEmployerLoading, jobSeekerProfile, employerProfile, router]);

  const isDataLoading = isUserLoading || isJobSeekerLoading || isEmployerLoading;

  if (isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If a profile already exists, we are redirecting, so show nothing to avoid flash
  if (jobSeekerProfile || employerProfile) return null;

  // If we have a user but NO profile document exists at all (Google users), 
  // show the choice step here. Once they choose, a skeleton is created and the 
  // useEffect above will trigger a redirect to the correct hub.
  return (
    <div className="container mx-auto px-4 py-24">
      <ProfileCompletionForm />
    </div>
  );
}
