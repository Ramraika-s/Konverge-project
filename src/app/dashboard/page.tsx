
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

/**
 * @fileOverview Backward compatibility redirect.
 * Since /dashboard is removed, any legacy entries are pushed to the job-seeker hub
 * which now handles initial role selection if no profile exists.
 */
export default function DashboardRedirect() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const jobSeekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: jobSeekerProfile, isLoading: isJobSeekerLoading } = useDoc(jobSeekerRef);

  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);

  const isDataLoading = isUserLoading || isJobSeekerLoading || isEmployerLoading;

  useEffect(() => {
    if (isDataLoading) return;

    if (!user) {
      router.replace('/auth');
      return;
    }

    if (employerProfile) {
      router.replace('/dashboard/employer');
    } else {
      router.replace('/dashboard/job-seeker');
    }
  }, [user, isDataLoading, jobSeekerProfile, employerProfile, router]);

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Redirecting to your Hub...</p>
    </div>
  );
}
