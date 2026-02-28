'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import { deleteDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { CacheService } from '@/lib/cache-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Mail,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  MapPin,
  Sparkles,
  ExternalLink
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProfilePage() {
  const { user, isUserLoading, role, profile } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form States
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    contactNumber: '',
    educationSummary: '',
    skills: '',
    resumeUrl: '',
    portfolioUrl: '',
    preferredRoles: '',
    preferredLocations: '',
    isRemotePreferred: false,
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    contactPersonName: '',
    companyLocation: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        contactNumber: profile.contactNumber || '',
        educationSummary: profile.educationSummary || '',
        skills: profile.skills?.join(', ') || '',
        resumeUrl: profile.resumeUrl || '',
        portfolioUrl: profile.portfolioUrl || '',
        preferredRoles: profile.preferredRoles?.join(', ') || '',
        preferredLocations: profile.preferredLocations?.join(', ') || '',
        isRemotePreferred: !!profile.isRemotePreferred,
        companyName: profile.companyName || '',
        companyWebsite: profile.companyWebsite || '',
        companyDescription: profile.companyDescription || '',
        contactPersonName: profile.contactPersonName || '',
        companyLocation: profile.companyLocation || '',
      });
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || !role) return;
    setIsLoading(true);

    try {
      const targetCollection = role === 'employer' ? 'employerProfiles' : 'jobseekerProfile';
      const profileRef = doc(db, targetCollection, user.uid);
      
      const updateData = role === 'employer' ? {
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        companyDescription: formData.companyDescription,
        contactPersonName: formData.contactPersonName,
        companyLocation: formData.companyLocation,
        contactNumber: formData.contactNumber,
        updatedAt: new Date().toISOString(),
      } : {
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        educationSummary: formData.educationSummary,
        skills: (formData.skills || '').split(',').map((s: string) => s.trim()).filter((s: string) => s !== ''),
        resumeUrl: formData.resumeUrl,
        portfolioUrl: formData.portfolioUrl,
        preferredRoles: (formData.preferredRoles || '').split(',').map((s: string) => s.trim()).filter((s: string) => s !== ''),
        preferredLocations: (formData.preferredLocations || '').split(',').map((s: string) => s.trim()).filter((s: string) => s !== ''),
        isRemotePreferred: formData.isRemotePreferred,
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(profileRef, updateData, { merge: true });
      await CacheService.set(`profile_${user.uid}`, { ...profile, ...updateData });

      toast({ title: "Identity Updated", description: "Your professional profile is now synced." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update Failed", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !db || !role) return;
    setIsDeleting(true);
    try {
      const collectionName = role === 'employer' ? 'employerProfiles' : 'jobseekerProfile';
      await deleteDoc(doc(db, collectionName, user.uid));
      await deleteUser(user);
      await CacheService.clear();
      toast({ title: "Account Terminated", description: "All data has been permanently wiped." });
      router.push('/');
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Security Check", 
        description: "Please log out and log back in to verify your identity before deletion." 
      });
      setIsDeleting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Syncing Identity...</p>
      </div>
    );
  }

  if (!user || !role) return null;

  const isEmployer = role === 'employer';
  const isComplete = isEmployer ? !!profile?.companyWebsite : (!!profile?.educationSummary && !!profile?.resumeUrl);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 font-bold group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </Button>
        <div className="text-right">
          <h1 className="text-3xl font-black tracking-tight">Manage <span className="text-primary gold-glow">Profile</span></h1>
          <p className="text-muted-foreground text-sm font-medium">Control your professional footprint on Konnex.</p>
        </div>
      </div>

      {!isComplete && (
        <Alert className="bg-primary/10 border-primary/20 rounded-3xl p-6 border-dashed animate-pulse">
          <AlertCircle className="h-5 w-5 text-primary" />
          <AlertTitle className="text-lg font-black tracking-tight">Crucial Details Missing</AlertTitle>
          <AlertDescription className="text-sm font-medium mt-1">
            {isEmployer 
              ? "Complete your company details to start posting job vacancies."
              : "Profiles without a Resume Link and Education Summary are 80% less likely to be reviewed."
            }
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-8">
          <Card className="glass-card border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="bg-primary/5 border-b border-white/5">
              <CardTitle className="text-xl flex items-center gap-2">
                {isEmployer ? <Building2 className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-primary" />}
                {isEmployer ? 'Corporate Identity' : 'Professional Dossier'}
              </CardTitle>
              <CardDescription>
                {isEmployer ? 'How your brand appears to top talent.' : 'Your verified credentials shared with potential employers.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleUpdate} className="space-y-8">
                {!isEmployer ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                      <Input 
                        value={formData.firstName || ''} 
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                      <Input 
                        value={formData.lastName || ''} 
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Education & Experience Summary</Label>
                      <Textarea 
                        placeholder="Detail your academic background and previous professional highlights..."
                        value={formData.educationSummary || ''} 
                        onChange={(e) => setFormData({...formData, educationSummary: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl min-h-[140px]"
                      />
                    </div>
                    
                    <div className="space-y-2 sm:col-span-2 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Assets & Links
                        </Label>
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      </div>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Resume (Google Drive / Dropbox)</Label>
                            {formData.resumeUrl && <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1">Test Link <ExternalLink className="w-2.5 h-2.5" /></a>}
                          </div>
                          <Input 
                            placeholder="https://drive.google.com/file/d/..."
                            value={formData.resumeUrl || ''} 
                            onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})}
                            className="bg-white/5 border-white/10 rounded-xl h-11 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Professional Portfolio / Website</Label>
                            {formData.portfolioUrl && <a href={formData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1">Test Link <ExternalLink className="w-2.5 h-2.5" /></a>}
                          </div>
                          <Input 
                            placeholder="https://yourname.com"
                            value={formData.portfolioUrl || ''} 
                            onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                            className="bg-white/5 border-white/10 rounded-xl h-11 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mastered Skills (comma separated)</Label>
                      <Input 
                        placeholder="React, TypeScript, Figma, Project Management..."
                        value={formData.skills || ''} 
                        onChange={(e) => setFormData({...formData, skills: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preferred Roles</Label>
                      <Input 
                        placeholder="Engineering Lead, UX Designer..."
                        value={formData.preferredRoles || ''} 
                        onChange={(e) => setFormData({...formData, preferredRoles: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Locations</Label>
                      <Input 
                        placeholder="London, Remote, Tokyo..."
                        value={formData.preferredLocations || ''} 
                        onChange={(e) => setFormData({...formData, preferredLocations: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2 flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-bold">Remote Opportunity Bias</Label>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Prioritize remote-first roles</p>
                      </div>
                      <Switch 
                        checked={!!formData.isRemotePreferred} 
                        onCheckedChange={(checked) => setFormData({...formData, isRemotePreferred: checked})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Legal Entity Name</Label>
                      <Input 
                        value={formData.companyName || ''} 
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Primary Representative</Label>
                      <Input 
                        value={formData.contactPersonName || ''} 
                        onChange={(e) => setFormData({...formData, contactPersonName: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl h-12"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Globe className="w-3 h-3" /> Digital HQ (Website)</Label>
                        <Input 
                          placeholder="https://company.io"
                          value={formData.companyWebsite || ''} 
                          onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                          className="bg-white/5 border-white/10 rounded-xl h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><MapPin className="w-3 h-3" /> Operational Hub</Label>
                        <Input 
                          placeholder="City, Country"
                          value={formData.companyLocation || ''} 
                          onChange={(e) => setFormData({...formData, companyLocation: e.target.value})}
                          className="bg-white/5 border-white/10 rounded-xl h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Organizational Mission</Label>
                      <Textarea 
                        placeholder="Describe the company's core values and current trajectory..."
                        value={formData.companyDescription || ''} 
                        onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-xl min-h-[140px]"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Phone className="w-3 h-3" /> Direct Contact Line</Label>
                  <Input 
                    value={formData.contactNumber || ''} 
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-xl h-12"
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-14 font-black gold-border-glow rounded-xl text-lg mt-4">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-3" /> Sync Professional Changes</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="glass-card border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <CardHeader className="bg-white/2 border-b border-white/5 p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Security Console
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1 mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Auth Identifier</p>
                <p className="text-xs font-bold flex items-center gap-2 truncate text-white">{user.email}</p>
              </div>
              <Button variant="outline" className="w-full h-11 font-bold border-white/10 rounded-xl hover:bg-white/5" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> End Session
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full h-11 font-black rounded-xl">
                    <Trash2 className="w-4 h-4 mr-2" /> Terminate Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card border-white/10 rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black">Irreversible Action</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This will permanently purge your professional footprint from Konnex. All applications, bookmarks, and listings will be deleted from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="rounded-xl font-bold border-white/10">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="rounded-xl font-black bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDeleteAccount}
                    >
                      {isDeleting ? "Wiping Servers..." : "Confirm Purge"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/5 rounded-3xl p-6 bg-primary/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> Identity Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Tier</span>
                <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-tighter bg-primary/10 text-primary border-primary/20">
                  {role}
                </Badge>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Completeness</span>
                <span className={`text-[10px] font-black uppercase ${isComplete ? 'text-green-400' : 'text-amber-400'}`}>
                  {isComplete ? '100% (High)' : 'Partial (Low)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Visibility</span>
                <span className={`text-[10px] font-black uppercase ${isComplete ? 'text-green-400' : 'text-red-400'}`}>
                  {isComplete ? 'DISCOVERABLE' : 'UNVERIFIED'}
                </span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}