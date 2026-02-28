
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { ProfileCompletionForm } from '@/components/auth/ProfileCompletionForm';

/**
 * @fileOverview Central Dashboard Gatekeeper.
 * Handles role selection for new users (especially Google sign-ins)
 * and redirects existing users to their respective professional hubs.
 */
export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const seekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: seekerProfile, isLoading: isSeekerLoading } = useDoc(seekerRef);

  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);

  const isDataLoading = isUserLoading || isSeekerLoading || isEmployerLoading;

  useEffect(() => {
    if (isDataLoading) return;

    if (!user) {
      router.replace('/auth');
      return;
    }

    // Redirect if a profile type is already established
    if (seekerProfile) {
      router.replace('/dashboard/job-seeker');
    } else if (employerProfile) {
      router.replace('/dashboard/employer');
    }
  }, [user, isDataLoading, seekerProfile, employerProfile, router]);

  if (isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Syncing your workspace...</p>
      </div>
    );
  }

  // If we've reached here, it means the user is logged in but has NO profile document.
  // This is typical for new Google Auth users. We show them the choice form.
  if (!seekerProfile && !employerProfile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProfileCompletionForm />
        </div>
      </div>
    );
  }

  return null;
}
