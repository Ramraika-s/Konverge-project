
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Loader2, Briefcase, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { doc } from 'firebase/firestore';

/**
 * @fileOverview Central dashboard router.
 * Automatically redirects users to their specific hub if a profile exists.
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

    // Role-based automatic routing if profiles are loaded
    if (jobSeekerProfile) {
      router.replace('/dashboard/job-seeker');
    } else if (employerProfile) {
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

  // If no profile exists yet (e.g. fresh Google Auth), show the selection hub
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight">Welcome to <span className="text-primary gold-glow">Konnex</span></h1>
          <p className="text-xl text-muted-foreground">Select your destination to manage your professional activities.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className="glass-card hover:border-primary/50 transition-all cursor-pointer group p-4 border-2"
            onClick={() => router.push('/dashboard/job-seeker')}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 mx-auto group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Briefcase className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Job Seeker Hub</CardTitle>
              <CardDescription className="text-base">Track your applications, saved jobs, and career progress.</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="glass-card hover:border-primary/50 transition-all cursor-pointer group p-4 border-2"
            onClick={() => router.push('/dashboard/employer')}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                <Building2 className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Employer Hub</CardTitle>
              <CardDescription className="text-base">Post new listings, manage applicants, and hire talent.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
