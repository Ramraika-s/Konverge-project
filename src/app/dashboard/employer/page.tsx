
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { EmployerDashboard } from '@/components/dashboard/EmployerDashboard';
import { ProfileCompletionForm } from '@/components/auth/ProfileCompletionForm';
import { Loader2, LogOut, Trash2, Shield, Building2, Mail, Settings, Globe } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EmployerDashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);

  const jobSeekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: jobSeekerProfile, isLoading: isJobSeekerLoading } = useDoc(jobSeekerRef);

  const isDataLoading = isUserLoading || isJobSeekerLoading || isEmployerLoading;

  useEffect(() => {
    if (isDataLoading) return;
    if (!user) {
      router.replace('/auth');
      return;
    }
    // Strict Role Lock: Seekers cannot access employer hub
    if (jobSeekerProfile) {
      router.replace('/dashboard/job-seeker');
      return;
    }
    // If no profile at all, send to job-seeker hub to pick a role
    if (!employerProfile && !jobSeekerProfile) {
      router.replace('/dashboard/job-seeker');
    }
  }, [user, isDataLoading, jobSeekerProfile, employerProfile, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (!user || !db) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'employerProfiles', user.uid));
      await deleteUser(user);
      toast({ title: "Account Deleted", description: "Company data and account removed." });
      router.push('/');
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Delete Failed", 
        description: "For security, please re-authenticate before deleting your account." 
      });
      setIsDeleting(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Syncing Employer Hub...</p>
      </div>
    );
  }

  if (!user || !employerProfile || jobSeekerProfile) return null;

  const isProfileComplete = !!employerProfile.companyWebsite;

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {!isProfileComplete ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProfileCompletionForm />
        </div>
      ) : (
        <>
          <div className="animate-in fade-in slide-in-from-left duration-500">
            <h1 className="text-4xl font-black mb-2 tracking-tight">Employer <span className="text-primary gold-glow">Hub</span></h1>
            <p className="text-muted-foreground font-medium">Manage your job listings and evaluate talent.</p>
          </div>

          <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
            <EmployerDashboard />
          </div>

          {/* Company & Profile Settings Section */}
          <div className="pt-12 border-t border-white/5 space-y-8 animate-in fade-in duration-1000">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-widest">Organization Controls</h2>
            </div>
            
            <div className="grid md:grid-cols-[1fr_350px] gap-8">
              <Card className="glass-card border-white/5 rounded-3xl overflow-hidden">
                <CardHeader className="bg-white/2 border-b border-white/5">
                  <CardTitle className="text-lg flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Company Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-8 grid sm:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Company Name</p>
                    <p className="font-bold">{employerProfile?.companyName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Website</p>
                    <p className="font-bold flex items-center gap-2 text-sm text-primary hover:underline">
                      <Globe className="w-3 h-3" /> {employerProfile?.companyWebsite}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Person</p>
                    <p className="font-bold">{employerProfile?.contactPersonName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Email</p>
                    <p className="font-bold flex items-center gap-2 text-sm"><Mail className="w-3 h-3" /> {employerProfile?.contactEmail}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/5 rounded-3xl overflow-hidden flex flex-col justify-between">
                <CardHeader className="bg-destructive/5 border-b border-white/5">
                  <CardTitle className="text-lg flex items-center gap-2"><Shield className="w-4 h-4 text-destructive" /> Security</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4 flex-1 flex flex-col justify-center">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-white/10" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Log Out
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full h-12 rounded-xl font-black">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-card border-white/10 rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black">Terminate Partnership?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          This action is irreversible. All company data, job listings, and applicant records will be permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl font-bold border-white/10">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="rounded-xl font-black bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={handleDeleteAccount}
                        >
                          {isDeleting ? "Processing..." : "Delete Permanently"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
