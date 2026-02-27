
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { Loader2 } from 'lucide-react';

/**
 * @fileOverview Dashboard page specifically for Job Seekers.
 */
export default function JobSeekerDashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

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
