
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import { deleteDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Loader2, 
  User, 
  Building2, 
  Phone, 
  Globe, 
  FileText, 
  Shield, 
  LogOut, 
  Trash2, 
  ArrowLeft,
  Save,
  Mail
} from 'lucide-react';
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

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const seekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: seekerProfile, isLoading: isSeekerLoading } = useDoc(seekerRef);
  
  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form States - Initialized with null-safe access patterns
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    contactNumber: '',
    educationSummary: '',
    skills: '',
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    contactPersonName: '',
    companyLocation: '',
  });

  useEffect(() => {
    if (seekerProfile) {
      setFormData({
        firstName: seekerProfile.firstName || '',
        lastName: seekerProfile.lastName || '',
        contactNumber: seekerProfile.contactNumber || '',
        educationSummary: seekerProfile.educationSummary || '',
        skills: seekerProfile.skills?.join(', ') || '',
      });
    } else if (employerProfile) {
      setFormData({
        companyName: employerProfile.companyName || '',
        companyWebsite: employerProfile.companyWebsite || '',
        companyDescription: employerProfile.companyDescription || '',
        contactPersonName: employerProfile.contactPersonName || '',
        companyLocation: employerProfile.companyLocation || '',
        contactNumber: employerProfile.contactNumber || '',
      });
    }
  }, [seekerProfile, employerProfile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    setIsLoading(true);

    try {
      const isEmployer = !!employerProfile;
      const targetCollection = isEmployer ? 'employerProfiles' : 'jobseekerProfile';
      const profileRef = doc(db, targetCollection, user.uid);
      
      const updateData = isEmployer ? {
        ...formData,
        updatedAt: new Date().toISOString(),
      } : {
        ...formData,
        skills: formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s !== ''),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(profileRef, updateData, { merge: true });
      toast({ title: "Profile Updated", description: "Changes saved successfully." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update Failed", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (!user || !db) return;
    setIsDeleting(true);
    try {
      const collectionName = employerProfile ? 'employerProfiles' : 'jobseekerProfile';
      await deleteDoc(doc(db, collectionName, user.uid));
      await deleteUser(user);
      toast({ title: "Account Deleted", description: "All data has been permanently removed." });
      router.push('/');
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Security Check", 
        description: "Please log out and log back in to verify your identity before deleting." 
      });
      setIsDeleting(false);
    }
  };

  if (isUserLoading || isSeekerLoading || isEmployerLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Loading Profile...</p>
      </div>
    );
  }

  if (!user || (!seekerProfile && !employerProfile)) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-black mb-4">No Profile Found</h1>
        <Button onClick={() => router.push('/dashboard')}>Setup Profile</Button>
      </div>
    );
  }

  const isEmployer = !!employerProfile;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 font-bold group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </Button>
        <div className="text-right">
          <h1 className="text-3xl font-black tracking-tight">Professional <span className="text-primary gold-glow">Identity</span></h1>
          <p className="text-muted-foreground text-sm font-medium">Manage how you appear to others on Konnex.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-8">
          <Card className="glass-card border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="bg-primary/5 border-b border-white/5">
              <CardTitle className="text-xl flex items-center gap-2">
                {isEmployer ? <Building2 className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-primary" />}
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleUpdate} className="space-y-6">
                {!isEmployer ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                      <Input 
                        value={formData.firstName || ''} 
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                      <Input 
                        value={formData.lastName || ''} 
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Education Summary</Label>
                      <Textarea 
                        value={formData.educationSummary || ''} 
                        onChange={(e) => setFormData({...formData, educationSummary: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skills (Comma Separated)</Label>
                      <Input 
                        value={formData.skills || ''} 
                        onChange={(e) => setFormData({...formData, skills: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Name</Label>
                      <Input 
                        value={formData.companyName || ''} 
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Website</Label>
                      <Input 
                        value={formData.companyWebsite || ''} 
                        onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About the Company</Label>
                      <Textarea 
                        value={formData.companyDescription || ''} 
                        onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl min-h-[120px]"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Phone className="w-3 h-3" /> Contact Number</Label>
                  <Input 
                    value={formData.contactNumber || ''} 
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-xl"
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-12 font-black gold-border-glow rounded-xl">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="glass-card border-white/5 rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/2 border-b border-white/5">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Account
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1 mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Logged in as</p>
                <p className="text-sm font-bold flex items-center gap-2 truncate"><Mail className="w-3 h-3" /> {user.email}</p>
              </div>
              <Button variant="outline" className="w-full h-11 font-bold border-white/10 rounded-xl" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Log Out
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full h-11 font-black rounded-xl">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card border-white/10 rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black">Permanent Deletion</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This action is irreversible. All your professional data, history, and access will be wiped from Konnex.
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

          <Card className="glass-card border-white/5 rounded-3xl p-6 bg-primary/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Pro Tip</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Complete your profile to increase your visibility to {isEmployer ? 'top talent' : 'premium employers'} by up to 40%.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
