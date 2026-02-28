
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
  const jobSeekerRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'jobseekerProfile', user.uid);
  }, [db, user]);
  const { data: jobSeekerProfile, isLoading: isJobSeekerLoading } = useDoc(jobSeekerRef);

  // Check for Employer Profile
  const employerRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'employerProfiles', user.uid);
  }, [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
      return;
    }

    // SUCCESS: Profile exists AND is fully populated with professional data
    if (jobSeekerProfile && jobSeekerProfile.educationSummary) {
      router.replace('/dashboard/job-seeker');
    } else if (employerProfile && employerProfile.companyWebsite) {
      router.replace('/dashboard/employer');
    }
  }, [user, isUserLoading, jobSeekerProfile, employerProfile, router]);

  const isGlobalLoading = isUserLoading || isJobSeekerLoading || isEmployerLoading;

  if (isGlobalLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // If profile is missing OR incomplete, show the progressive completion form
  return (
    <div className="container mx-auto px-4 py-24">
      <ProfileCompletionForm />
    </div>
  );
}
