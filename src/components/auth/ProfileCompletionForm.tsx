
"use client";

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
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
  Sparkles, 
  FileText,
  MapPin,
  Link as LinkIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ProfileCompletionForm() {
  const { user, role } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const seekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: seekerDoc } = useDoc(seekerRef);
  
  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerDoc } = useDoc(employerRef);

  const isEmployer = role === 'employer';
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [skills, setSkills] = useState('');
  const [educationSummary, setEducationSummary] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');

  useEffect(() => {
    if (seekerDoc) {
      setFirstName(seekerDoc.firstName || '');
      setLastName(seekerDoc.lastName || '');
      setContactNumber(seekerDoc.contactNumber || '');
      setEducationSummary(seekerDoc.educationSummary || '');
      setSkills(seekerDoc.skills?.join(', ') || '');
      setResumeUrl(seekerDoc.resumeUrl || '');
    } else if (employerDoc) {
      setCompanyName(employerDoc.companyName || '');
      setContactPersonName(employerDoc.contactPersonName || '');
      setCompanyWebsite(employerDoc.companyWebsite || '');
      setCompanyDescription(employerDoc.companyDescription || '');
      setCompanyLocation(employerDoc.companyLocation || '');
      setContactNumber(employerDoc.contactNumber || '');
    }
  }, [seekerDoc, employerDoc]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    setIsLoading(true);

    try {
      const targetCollection = isEmployer ? 'employerProfiles' : 'jobseekerProfile';
      const profileRef = doc(db, targetCollection, user.uid);
      
      const profileData = isEmployer ? {
        companyName,
        companyWebsite,
        companyDescription: companyDescription || "Pioneering innovation through talent.",
        contactPersonName,
        contactEmail: user.email,
        contactNumber,
        companyLocation,
        updatedAt: new Date().toISOString(),
      } : {
        firstName,
        lastName,
        contactNumber,
        educationSummary,
        resumeUrl,
        skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(profileRef, profileData, { merge: true });

      toast({
        title: "Onboarding Complete",
        description: `Your workspace is now ready.`,
      });
      
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: err.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto glass-card border-white/5 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="text-center border-b border-white/5 bg-primary/5 p-8">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          {isEmployer ? <Building2 className="w-6 h-6 text-primary-foreground" /> : <User className="w-6 h-6 text-primary-foreground" />}
        </div>
        <CardTitle className="text-2xl font-black text-white">Refine Your Identity</CardTitle>
        <CardDescription className="text-muted-foreground font-medium">Finalize these details to access the Konnex network.</CardDescription>
      </CardHeader>

      <CardContent className="p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isEmployer ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                  <Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                  <Input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Phone className="w-3 h-3 text-primary" /> Contact Number</Label>
                <Input required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><FileText className="w-3 h-3 text-primary" /> Resume Link (Google Drive / Dropbox)</Label>
                <Input required type="url" placeholder="https://drive.google.com/..." value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><LinkIcon className="w-3 h-3 text-primary" /> Professional Bio</Label>
                <Textarea required placeholder="Describe your career goals and core expertise..." value={educationSummary} onChange={(e) => setEducationSummary(e.target.value)} className="bg-white/5 border-white/10 min-h-[120px] rounded-xl text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Sparkles className="w-3 h-3 text-primary" /> Tech Stack (comma separated)</Label>
                <Input placeholder="React, SQL, Python..." value={skills} onChange={(e) => setSkills(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Building2 className="w-3 h-3 text-primary" /> Official Company Name</Label>
                <Input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Globe className="w-3 h-3 text-primary" /> Corporate Website</Label>
                <Input required type="url" placeholder="https://brand.com" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mission Statement</Label>
                <Textarea placeholder="What impact is your organization making?" value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="bg-white/5 border-white/10 min-h-[120px] rounded-xl text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Lead</Label>
                  <Input required value={contactPersonName} onChange={(e) => setContactPersonName(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><MapPin className="w-3 h-3 text-primary" /> Main Hub</Label>
                  <Input required placeholder="City, Country" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 font-black text-lg gold-border-glow rounded-xl mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Proceed'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
