
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { ProfileCompletionForm } from '@/components/auth/ProfileCompletionForm';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

/**
 * @fileOverview Job Seeker Dashboard.
 * Shows the completion form if profile is incomplete, or the dashboard if complete.
 * Strictly guards against employer access.
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

  const isDataLoading = isUserLoading || isEmployerLoading || isJobSeekerLoading;

  useEffect(() => {
    if (isDataLoading) return;

    if (!user) {
      router.replace('/auth');
      return;
    }

    // STRICT ROLE GUARD: If user is an employer, they are forbidden from the seeker hub.
    if (employerProfile) {
      router.replace('/dashboard/employer');
      return;
    }
    
    // If no seeker profile exists at all (and no employer profile), go back to central router to pick a role
    if (!jobSeekerProfile && !employerProfile) {
      router.replace('/dashboard');
    }
  }, [user, isDataLoading, employerProfile, jobSeekerProfile, router]);

  if (isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Syncing Seeker Dashboard...</p>
      </div>
    );
  }

  // Final validation before rendering
  if (!user || employerProfile) return null;

  // Check if seeker profile is professionally complete (has educationSummary)
  const isProfileComplete = jobSeekerProfile && !!jobSeekerProfile.educationSummary;

  return (
    <div className="container mx-auto px-4 py-12">
      {isProfileComplete ? (
        <>
          <div className="animate-in fade-in slide-in-from-left duration-500 mb-10">
            <h1 className="text-4xl font-black mb-2 tracking-tight">Job Seeker <span className="text-primary gold-glow">Dashboard</span></h1>
            <p className="text-muted-foreground font-medium">Manage your applications and professional growth.</p>
          </div>
          <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
            <StudentDashboard />
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
