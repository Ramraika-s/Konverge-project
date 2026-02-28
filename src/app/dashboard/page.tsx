
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { ProfileCompletionForm } from '@/components/auth/ProfileCompletionForm';

/**
 * @fileOverview Central dashboard router with Progressive Profiling.
 * This is the ONLY page that shows the ProfileCompletionForm.
 * It detects profile completeness and pushes the user to the correct sub-route.
 */
export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // 1. Check for Job Seeker Profile
  const jobSeekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: jobSeekerProfile, isLoading: isJobSeekerLoading } = useDoc(jobSeekerRef);

  // 2. Check for Employer Profile
  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);

  useEffect(() => {
    // Wait for all auth and profile data to load definitively
    if (isUserLoading || isJobSeekerLoading || isEmployerLoading) return;

    // Auth Guard: Not logged in? Go to auth.
    if (!user) {
      router.push('/auth');
      return;
    }

    // Routing Logic: If a profile is COMPLETE, push them to their hub.
    // Completeness is defined by having the professional identifying field.
    if (jobSeekerProfile && jobSeekerProfile.educationSummary) {
      router.replace('/dashboard/job-seeker');
    } else if (employerProfile && employerProfile.companyWebsite) {
      router.replace('/dashboard/employer');
    }
  }, [user, isUserLoading, isJobSeekerLoading, isEmployerLoading, jobSeekerProfile, employerProfile, router]);

  const isDataLoading = isUserLoading || isJobSeekerLoading || isEmployerLoading;

  if (isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Prevent flash of form before redirect if data is actually complete
  const isProfileComplete = (jobSeekerProfile && jobSeekerProfile.educationSummary) || 
                            (employerProfile && employerProfile.companyWebsite);

  if (!user || isProfileComplete) return null;

  // If we reach here, it means we have a user but their profile is incomplete.
  return (
    <div className="container mx-auto px-4 py-24">
      <ProfileCompletionForm />
    </div>
  );
}
