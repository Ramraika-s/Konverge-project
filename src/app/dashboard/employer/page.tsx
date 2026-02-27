
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { EmployerDashboard } from '@/components/dashboard/EmployerDashboard';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

/**
 * @fileOverview Dashboard page specifically for Employers.
 * Includes role-based access control.
 */
export default function EmployerDashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // Guard: Check if user has a job seeker profile
  const jobSeekerRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'jobseekerProfile', user.uid);
  }, [db, user]);
  const { data: jobSeekerProfile, isLoading: isJobSeekerLoading } = useDoc(jobSeekerRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
      return;
    }

    // Role Guard: If user is actually a job seeker, redirect them
    if (!isJobSeekerLoading && jobSeekerProfile) {
      router.replace('/dashboard/job-seeker');
    }
  }, [user, isUserLoading, jobSeekerProfile, isJobSeekerLoading, router]);

  if (isUserLoading || isJobSeekerLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || jobSeekerProfile) return null;

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
