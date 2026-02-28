'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { ProfileCompletionForm } from '@/components/auth/ProfileCompletionForm';

/**
 * @fileOverview Central Dashboard Gatekeeper.
 * Uses cached role information from the FirebaseProvider to perform
 * zero-latency redirects for returning users.
 */
export default function DashboardPage() {
  const { user, isUserLoading, role } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If auth state is resolved but no user, go home
    if (!isUserLoading && !user) {
      router.replace('/auth');
      return;
    }

    // Use the role resolved (and possibly cached) by the provider
    if (role === 'job-seeker') {
      router.replace('/dashboard/job-seeker');
    } else if (role === 'employer') {
      router.replace('/dashboard/employer');
    }
  }, [user, isUserLoading, role, router]);

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Syncing Workspace...</p>
      </div>
    );
  }

  // If loading is done, no user is found, but auth is okay: Choice required (Google sign-ins)
  if (user && !role) {
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
